<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuestionController extends Controller
{
    public function index(Request $request, Course $course): Response
    {
        $query = $course->questions();

        if ($request->filled('search')) {
            $query->whereLike('question_text', "%{$request->search}%");
        }

        if ($request->filled('correct_answer')) {
            $query->where('correct_answer', $request->correct_answer);
        }

        $questions = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/questions/index', [
            'course' => $course,
            'questions' => $questions,
            'filters' => $request->only(['search', 'correct_answer']),
        ]);
    }

    public function create(Course $course): Response
    {
        return Inertia::render('admin/questions/create', [
            'course' => $course,
        ]);
    }

    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'question_text' => 'required|string',
            'option_a' => 'required|string|max:255',
            'option_b' => 'required|string|max:255',
            'option_c' => 'required|string|max:255',
            'option_d' => 'required|string|max:255',
            'correct_answer' => 'required|in:a,b,c,d',
        ]);

        $course->questions()->create($validated);

        return redirect()->route('admin.courses.questions.index', $course)
            ->with('success', 'Question created successfully.');
    }

    public function edit(Question $question): Response
    {
        $question->load('course');

        return Inertia::render('admin/questions/edit', [
            'course' => $question->course,
            'question' => $question,
        ]);
    }

    public function update(Request $request, Question $question)
    {
        $validated = $request->validate([
            'question_text' => 'required|string',
            'option_a' => 'required|string|max:255',
            'option_b' => 'required|string|max:255',
            'option_c' => 'required|string|max:255',
            'option_d' => 'required|string|max:255',
            'correct_answer' => 'required|in:a,b,c,d',
        ]);

        $question->update($validated);

        return redirect()->route('admin.courses.questions.index', $question->course_id)
            ->with('success', 'Question updated successfully.');
    }

    public function destroy(Question $question)
    {
        $courseId = $question->course_id;
        $question->delete();

        return redirect()->route('admin.courses.questions.index', $courseId)
            ->with('success', 'Question deleted successfully.');
    }
}
