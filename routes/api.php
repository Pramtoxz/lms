<?php

use App\Http\Controllers\Api\ZoomWebhookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Zoom webhook - stateless API route (no CSRF protection)
Route::post('/zoom/webhook', [ZoomWebhookController::class, 'handle']);
