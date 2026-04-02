<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\ZoomMeeting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with(['user', 'zoomMeeting.course']);

        if ($request->filled('meeting_id')) {
            $query->where('zoom_meeting_id', $request->meeting_id);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('user_name', 'like', "%{$request->search}%")
                    ->orWhereHas('user', function ($q) use ($request) {
                        $q->where('name', 'like', "%{$request->search}%")
                            ->orWhere('email', 'like', "%{$request->search}%");
                    });
            });
        }

        $attendances = $query->latest('check_in_time')->paginate(10)->withQueryString();
        $meetings = ZoomMeeting::with('course')->latest('start_time')->get();

        return Inertia::render('admin/attendances/index', [
            'attendances' => $attendances,
            'meetings' => $meetings,
            'filters' => $request->only(['meeting_id', 'search']),
        ]);
    }
}
