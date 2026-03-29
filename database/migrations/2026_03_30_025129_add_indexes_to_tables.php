<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('course_id');
            $table->index('status');
            $table->index('created_at');
        });

        Schema::table('exam_results', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('course_id');
            $table->index(['user_id', 'course_id']);
            $table->index('is_passed');
            $table->index('created_at');
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('zoom_meeting_id');
            $table->index('created_at');
        });

        Schema::table('lessons', function (Blueprint $table) {
            $table->index('course_id');
            $table->index(['course_id', 'order']);
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->index('course_id');
        });
    }

    public function down(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['course_id']);
            $table->dropIndex(['status']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('exam_results', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['course_id']);
            $table->dropIndex(['user_id', 'course_id']);
            $table->dropIndex(['is_passed']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['zoom_meeting_id']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('lessons', function (Blueprint $table) {
            $table->dropIndex(['course_id']);
            $table->dropIndex(['course_id', 'order']);
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->dropIndex(['course_id']);
        });
    }
};
