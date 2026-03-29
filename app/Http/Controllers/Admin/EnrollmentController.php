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
    public function index(Request $request): Response
    {
        $query = Enrollment::with(['user', 'course']);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('user', function ($userQuery) use ($request) {
                    $userQuery->whereLike('name', "%{$request->search}%")
                        ->orWhereLike('email', "%{$request->search}%");
                })->orWhereHas('course', function ($courseQuery) use ($request) {
                    $courseQuery->whereLike('title', "%{$request->search}%");
                });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        $enrollments = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/enrollments/index', [
            'enrollments' => $enrollments,
            'filters' => $request->only(['search', 'status', 'course_id']),
            'courses' => Course::where('is_published', true)->get(['id', 'title']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/enrollments/create', [
            'users' => User::role('user')->get(['id', 'name', 'email']),
            'courses' => Course::where('is_published', true)->get(['id', 'title']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
        ]);

        // Check if already enrolled
        $existing = Enrollment::where('user_id', $validated['user_id'])
            ->where('course_id', $validated['course_id'])
            ->first();

        if ($existing) {
            return back()->withErrors(['user_id' => 'User is already enrolled in this course.']);
        }

        Enrollment::create([
            'user_id' => $validated['user_id'],
            'course_id' => $validated['course_id'],
            'progress_percentage' => 0,
            'status' => 'ongoing',
            'enrolled_at' => now(),
        ]);

        return redirect()->route('admin.enrollments.index')
            ->with('success', 'Enrollment created successfully.');
    }

    public function destroy(Enrollment $enrollment)
    {
        $enrollment->delete();

        return redirect()->route('admin.enrollments.index')
            ->with('success', 'Enrollment deleted successfully.');
    }
}
