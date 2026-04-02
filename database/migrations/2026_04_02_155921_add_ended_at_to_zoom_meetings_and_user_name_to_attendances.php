<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('zoom_meetings', function (Blueprint $table) {
            $table->timestamp('ended_at')->nullable()->after('start_url');
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->string('user_name')->nullable()->after('user_id');
            $table->string('zoom_user_id')->nullable()->after('user_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('zoom_meetings', function (Blueprint $table) {
            $table->dropColumn('ended_at');
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn(['user_name', 'zoom_user_id']);
        });
    }
};
