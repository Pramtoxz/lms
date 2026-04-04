<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use App\Models\ZoomMeeting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $stats = [
            'total_courses' => Course::count(),
            'total_students' => User::whereHas('roles', function ($q) {
                $q->where('name', '!=', 'admin');
            })->count(),
            'total_enrollments' => Enrollment::count(),
            'total_meetings' => ZoomMeeting::count(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
        ]);
    }
}
