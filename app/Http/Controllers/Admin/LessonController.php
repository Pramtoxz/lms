<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LessonController extends Controller
{
    public function index(Request $request, Course $course): Response
    {
        $query = $course->lessons();

        if ($request->filled('search')) {
            $query->whereLike('title', "%{$request->search}%");
        }

        if ($request->filled('video_type')) {
            $query->where('video_type', $request->video_type);
        }

        $lessons = $query->orderBy('order')->paginate(10)->withQueryString();

        return Inertia::render('admin/lessons/index', [
            'course' => $course,
            'lessons' => $lessons,
            'filters' => $request->only(['search', 'video_type']),
        ]);
    }

    public function create(Course $course): Response
    {
        return Inertia::render('admin/lessons/create', [
            'course' => $course,
        ]);
    }

    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'video_type' => 'required|in:internal,youtube,gdrive',
            'video_url' => 'required|string',
            'duration' => 'required|integer|min:1',
            'order' => 'required|integer|min:0',
        ]);

        $course->lessons()->create($validated);

        return redirect()->route('admin.courses.lessons.index', $course)
            ->with('success', 'Lesson created successfully.');
    }

    public function edit(Lesson $lesson): Response
    {
        $lesson->load('course');

        return Inertia::render('admin/lessons/edit', [
            'course' => $lesson->course,
            'lesson' => $lesson,
        ]);
    }

    public function update(Request $request, Lesson $lesson)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'video_type' => 'required|in:internal,youtube,gdrive',
            'video_url' => 'required|string',
            'duration' => 'required|integer|min:1',
            'order' => 'required|integer|min:0',
        ]);

        $lesson->update($validated);

        return redirect()->route('admin.courses.lessons.index', $lesson->course_id)
            ->with('success', 'Lesson updated successfully.');
    }

    public function destroy(Lesson $lesson)
    {
        $courseId = $lesson->course_id;
        $lesson->delete();

        return redirect()->route('admin.courses.lessons.index', $courseId)
            ->with('success', 'Lesson deleted successfully.');
    }
}
