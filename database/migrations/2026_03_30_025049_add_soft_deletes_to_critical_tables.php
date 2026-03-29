<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('enrollments', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('exam_results', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('exam_results', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
