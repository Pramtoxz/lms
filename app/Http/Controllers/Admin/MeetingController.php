<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\ZoomMeeting;
use App\Services\ZoomService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingController extends Controller
{
    private ZoomService $zoomService;

    public function __construct(ZoomService $zoomService)
    {
        $this->zoomService = $zoomService;
    }

    public function index(Request $request)
    {
        $query = ZoomMeeting::with('course');

        // Search
        if ($request->filled('search')) {
            $query->whereHas('course', function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%");
            });
        }

        // Filter by course
        if ($request->filled('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        $meetings = $query->latest('start_time')->paginate(10)->withQueryString();
        $courses = Course::select('id', 'title')->orderBy('title')->get();

        return Inertia::render('admin/meetings/index', [
            'meetings' => $meetings,
            'courses' => $courses,
            'filters' => $request->only(['search', 'course_id']),
        ]);
    }

    public function create()
    {
        $courses = Course::select('id', 'title')->orderBy('title')->get();

        return Inertia::render('admin/meetings/create', [
            'courses' => $courses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'start_time' => 'required|date|after:now',
            'duration' => 'required|integer|min:15|max:480', // 15 min to 8 hours
        ]);

        try {
            $course = Course::findOrFail($validated['course_id']);
            
            // Format start_time to ISO 8601 (Zoom format)
            $startTime = \Carbon\Carbon::parse($validated['start_time'])->format('Y-m-d\TH:i:s\Z');
            
            // Create meeting via Zoom API
            $zoomMeeting = $this->zoomService->createMeeting(
                $course->title . ' - Live Class',
                $startTime,
                $validated['duration']
            );

            // Save to database
            ZoomMeeting::create([
                'course_id' => $validated['course_id'],
                'zoom_meeting_id' => $zoomMeeting['id'],
                'start_time' => $validated['start_time'],
                'duration' => $validated['duration'],
                'join_url' => $zoomMeeting['join_url'],
                'start_url' => $zoomMeeting['start_url'],
            ]);

            return redirect()->route('admin.meetings.index')
                ->with('success', 'Meeting created successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy(ZoomMeeting $meeting)
    {
        try {
            // Delete from Zoom
            $this->zoomService->deleteMeeting($meeting->zoom_meeting_id);
            
            // Delete from database
            $meeting->delete();

            return redirect()->route('admin.meetings.index')
                ->with('success', 'Meeting deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
