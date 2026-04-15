<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Course::query()->withCount('lessons', 'questions');

        if ($request->filled('search')) {
            $query->whereLike('title', "%{$request->search}%");
        }

        if ($request->filled('status')) {
            $query->where('is_published', $request->status === 'published');
        }

        if ($request->filled('type')) {
            if ($request->type === 'free') {
                $query->where('is_free', true);
            } elseif ($request->type === 'paid') {
                $query->where('is_free', false);
            }
        }

        $courses = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/courses/index', [
            'courses' => $courses,
            'filters' => $request->only(['search', 'status', 'type']),
        ]);
    }

    public function create(): Response
    {
        $availableFonts = config('certificate.available_fonts');

        return Inertia::render('admin/courses/create', [
            'availableFonts' => $availableFonts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'thumbnail' => 'nullable|image|max:2048',
            'price' => 'required|numeric|min:0|decimal:0,2',
            'is_free' => 'required|boolean',
            'certificate_template' => 'nullable|image|max:5120',
            'certificate_font' => 'nullable|string',
            'exam_duration' => 'required|integer|min:5|max:180',
            'is_published' => 'boolean',
            'capstar_course_number' => 'nullable|integer|between:1,5',
        ]);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        if ($request->hasFile('certificate_template')) {
            $validated['certificate_template'] = $request->file('certificate_template')->store('certificate-templates', 'public');
        }

        Course::create($validated);

        return redirect()->route('admin.courses.index')
            ->with('success', 'Course created successfully.');
    }

    public function edit(Course $course): Response
    {
        $availableFonts = config('certificate.available_fonts');

        return Inertia::render('admin/courses/edit', [
            'course' => $course,
            'availableFonts' => $availableFonts,
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'thumbnail' => 'nullable|image|max:2048',
            'price' => 'required|numeric|min:0|decimal:0,2',
            'is_free' => 'required|boolean',
            'certificate_template' => 'nullable|image|max:5120',
            'certificate_font' => 'nullable|string',
            'exam_duration' => 'required|integer|min:5|max:180',
            'is_published' => 'boolean',
            'capstar_course_number' => 'nullable|integer|between:1,5',
        ]);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
        } else {
            unset($validated['thumbnail']);
        }

        if ($request->hasFile('certificate_template')) {
            $validated['certificate_template'] = $request->file('certificate_template')->store('certificate-templates', 'public');
        } else {
            unset($validated['certificate_template']);
        }

        $course->update($validated);

        return redirect()->route('admin.courses.index')
            ->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        $course->delete();

        return redirect()->route('admin.courses.index')
            ->with('success', 'Course deleted successfully.');
    }
}
