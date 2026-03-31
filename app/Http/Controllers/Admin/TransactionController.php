<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Transaction::with(['user', 'course']);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->whereLike('order_id', "%{$request->search}%")
                    ->orWhereLike('transaction_id', "%{$request->search}%")
                    ->orWhereHas('user', function ($q) use ($request) {
                        $q->whereLike('name', "%{$request->search}%")
                            ->orWhereLike('email', "%{$request->search}%");
                    })
                    ->orWhereHas('course', function ($q) use ($request) {
                        $q->whereLike('title', "%{$request->search}%");
                    });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $transactions = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/transactions/index', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'status']),
        ]);
    }
}
