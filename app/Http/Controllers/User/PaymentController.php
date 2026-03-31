<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use RazerMerchantServices\Payment;

class PaymentController extends Controller
{
    private Payment $rms;

    public function __construct()
    {
        $this->rms = new Payment(
            env('RMS_MERCHANT_ID'),
            env('RMS_VERIFY_KEY'),
            env('RMS_SECRET_KEY'),
            env('RMS_ENVIRONMENT')
        );
    }

    public function checkout(Course $course)
    {
        // Check if course is free
        if ($course->is_free) {
            return redirect()->route('courses.browse')
                ->with('error', 'This course is free. Please enroll directly.');
        }

        // Check if already enrolled
        $existing = Enrollment::where('user_id', auth()->id())
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return redirect()->route('courses.index')
                ->with('error', 'You are already enrolled in this course.');
        }

        return Inertia::render('user/courses/checkout', [
            'course' => $course,
            'user' => auth()->user(),
        ]);
    }

    public function processPayment(Request $request, Course $course)
    {
        // No validation needed - use auth user data directly
        
        // Check if course is free
        if ($course->is_free) {
            return redirect()->route('courses.browse')
                ->with('error', 'This course is free.');
        }

        // Check if already enrolled
        $existing = Enrollment::where('user_id', auth()->id())
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return redirect()->route('courses.index')
                ->with('error', 'You are already enrolled in this course.');
        }

        $user = auth()->user();

        // Check if there's already a pending transaction for this course
        $pendingTransaction = Transaction::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('status', 'pending')
            ->where('created_at', '>', now()->subMinutes(30)) // Only check transactions from last 30 minutes
            ->first();

        if ($pendingTransaction) {
            // Reuse existing pending transaction
            $orderId = $pendingTransaction->order_id;
        } else {
            // Generate unique order ID
            $orderId = 'LMS-' . time() . '-' . $course->id;

            // Create new pending transaction
            Transaction::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'order_id' => $orderId,
                'amount' => $course->price,
                'currency' => 'MYR',
                'status' => 'pending',
                'payment_method' => 'razerms',
            ]);
        }

        // Generate return URL
        $returnUrl = route('payment.return', ['order_id' => $orderId]);

        // Get payment URL from RMS
        try {
            $paymentUrl = $this->rms->getPaymentUrl(
                orderid: $orderId,
                amount: (float) $course->price,
                bill_name: $user->name,
                bill_email: $user->email,
                bill_mobile: '',
                bill_desc: "Enrollment for {$course->title}",
                currency: 'MYR',
                returnUrl: $returnUrl
            );

            return Inertia::location($paymentUrl);
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Payment gateway error: ' . $e->getMessage());
        }
    }

    public function handleReturn(Request $request, string $order_id)
    {
        $transaction = Transaction::with('course')->where('order_id', $order_id)->firstOrFail();

        auth()->loginUsingId($transaction->user_id);
        $request->session()->regenerate();

        if ($transaction->status === 'paid') {
            return Inertia::render('user/courses/payment-result', [
                'success' => true,
                'course' => $transaction->course,
                'transaction' => $transaction,
            ]);
        }

        $key = md5(
            $request->tranID .
            $request->orderid .
            $request->status .
            $request->domain .
            $request->amount .
            $request->currency
        );

        $isValid = $this->rms->verifySignature(
            $request->paydate,
            $request->domain,
            $key,
            $request->appcode,
            $request->skey
        );

        if (!$isValid) {
            $transaction->update([
                'status' => 'failed',
                'transaction_id' => $request->tranID ?? null,
            ]);

            return Inertia::render('user/courses/payment-result', [
                'success' => false,
                'course' => $transaction->course,
                'transaction' => $transaction,
                'message' => 'Invalid payment signature. Please contact support.',
            ]);
        }

        if ($request->status != '00') {
            $transaction->update([
                'status' => 'failed',
                'transaction_id' => $request->tranID ?? null,
            ]);

            return Inertia::render('user/courses/payment-result', [
                'success' => false,
                'course' => $transaction->course,
                'transaction' => $transaction,
                'message' => 'Payment was not completed. You can try again.',
            ]);
        }

        if ((float) $request->amount != (float) $transaction->amount) {
            $transaction->update([
                'status' => 'failed',
                'transaction_id' => $request->tranID ?? null,
            ]);

            return Inertia::render('user/courses/payment-result', [
                'success' => false,
                'course' => $transaction->course,
                'transaction' => $transaction,
                'message' => 'Payment amount mismatch. Please contact support.',
            ]);
        }

        $transaction->update([
            'status' => 'paid',
            'transaction_id' => $request->tranID,
            'payment_date' => now(),
        ]);

        $existingEnrollment = Enrollment::where('user_id', $transaction->user_id)
            ->where('course_id', $transaction->course_id)
            ->first();

        if (!$existingEnrollment) {
            Enrollment::create([
                'user_id' => $transaction->user_id,
                'course_id' => $transaction->course_id,
                'progress_percentage' => 0,
                'status' => 'ongoing',
                'enrolled_at' => now(),
            ]);
        }

        return Inertia::render('user/courses/payment-result', [
            'success' => true,
            'course' => $transaction->course,
            'transaction' => $transaction,
        ]);
    }

    public function transactions(): Response
    {
        $transactions = Transaction::with('course')
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('user/transactions/index', [
            'transactions' => $transactions,
        ]);
    }
}
