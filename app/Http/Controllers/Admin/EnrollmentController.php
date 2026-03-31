<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnrollmentController extends Controller
{
    // List users with enrollment count
    public function index(Request $request): Response
    {
        $query = User::role('user')->withCount('enrollments');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->whereLike('name', "%{$request->search}%")
                    ->orWhereLike('email', "%{$request->search}%");
            });
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/enrollments/index', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    // Show specific user's enrollments
    public function show(Request $request, User $user): Response
    {
        $query = Enrollment::with(['course'])
            ->where('user_id', $user->id);

        if ($request->filled('search')) {
            $query->whereHas('course', function ($courseQuery) use ($request) {
                $courseQuery->whereLike('title', "%{$request->search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $enrollments = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/enrollments/show', [
            'user' => $user,
            'enrollments' => $enrollments,
            'filters' => $request->only(['search', 'status']),
            'courses' => Course::where('is_published', true)->get(['id', 'title']),
        ]);
    }

    public function store(Request $request, User $user)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        // Check if already enrolled
        $existing = Enrollment::where('user_id', $user->id)
            ->where('course_id', $validated['course_id'])
            ->first();

        if ($existing) {
            return back()->withErrors(['course_id' => 'User is already enrolled in this course.']);
        }

        Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $validated['course_id'],
            'progress_percentage' => 0,
            'status' => 'ongoing',
            'enrolled_at' => now(),
        ]);

        return back()->with('success', 'Enrollment created successfully.');
    }

    public function destroy(Enrollment $enrollment)
    {
        $userId = $enrollment->user_id;
        $enrollment->delete();

        return redirect()->route('admin.enrollments.show', $userId)
            ->with('success', 'Enrollment deleted successfully.');
    }
}
