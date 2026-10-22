<?php

use App\Http\Controllers\AdminFeedbackController;
use App\Http\Controllers\AdminPostController;
use App\Http\Controllers\AdminProjectController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\EngineeringProjectController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ProjectController;
use App\Models\AdministrativePost;
use App\Models\Feedback;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public pages
Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/login', fn () => Inertia::render('Login'))
    ->name('login');

Route::get('/register', function () {
    return Inertia::render('Register');
});

Route::post('/login', [LoginController::class, 'store']);
Route::post('/register', [RegisterController::class, 'store']);

// Citizen routes
Route::get('/citizen/dashboard', function () {
    $projects = Project::orderBy('created_at', 'desc')->get();
    $user = request()->user();

    return Inertia::render('Citizen/Dashboard', [
        'projects' => $projects,
        'notifications' => $user->notifications()
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn ($notification) => [
                'id' => $notification->id,
                'data' => $notification->data,
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
            ]),
        'unreadNotificationCount' => $user->unreadNotifications()->count(),
    ]);
})->middleware(['auth', 'role:citizen']);

Route::patch('/citizen/notifications/{notification}/read', function (
    Request $request,
    string $notification,
) {
    $request->user()
        ->notifications()
        ->whereKey($notification)
        ->firstOrFail()
        ->markAsRead();

    return back();
})->middleware(['auth', 'role:citizen']);

Route::get('/citizen/projects', [ProjectController::class, 'index'])
    ->middleware(['auth', 'role:citizen']);

Route::get('/citizen/projects/{project}', [ProjectController::class, 'show'])
    ->middleware(['auth', 'role:citizen']);

Route::post('/citizen/projects/{project}/feedback', [FeedbackController::class, 'store'])
    ->middleware(['auth', 'role:citizen']);

Route::get('/citizen/posts', [AdminPostController::class, 'citizenIndex'])
    ->middleware(['auth', 'role:citizen']);

Route::get('/citizen/feedback', [FeedbackController::class, 'myFeedback'])
    ->middleware(['auth', 'role:citizen']);

// Engineering routes
Route::get('/engineering/dashboard', function () {
    return Inertia::render('Engineering/Dashboard', [
        'projects' => Project::orderBy('created_at', 'desc')->get(),
    ]);
})->middleware(['auth', 'role:engineering']);

Route::get('/engineering/projects', [EngineeringProjectController::class, 'index'])
    ->middleware(['auth', 'role:engineering']);

Route::get('/engineering/projects/create', [EngineeringProjectController::class, 'create'])
    ->middleware(['auth', 'role:engineering']);

Route::post('/engineering/projects', [EngineeringProjectController::class, 'store'])
    ->middleware(['auth', 'role:engineering']);

Route::put('/engineering/projects/{project}', [EngineeringProjectController::class, 'update'])
    ->middleware(['auth', 'role:engineering']);

// Admin routes
Route::get('/admin/dashboard', function () {
    $projects = Project::orderBy('created_at', 'desc')->get();
    $users = User::count();
    $feedback = Feedback::count();
    $posts = AdministrativePost::count();

    return Inertia::render('Admin/Dashboard', [
        'projects' => $projects,
        'totalUsers' => $users,
        'totalFeedback' => $feedback,
        'totalPosts' => $posts,
    ]);
})->middleware(['auth', 'role:admin']);

Route::get('/admin/feedback', [AdminFeedbackController::class, 'index'])
    ->middleware(['auth', 'role:admin']);

Route::put('/admin/feedback/{feedback}', [AdminFeedbackController::class, 'update'])
    ->middleware(['auth', 'role:admin']);

Route::get('/admin/users', [AdminUserController::class, 'index'])
    ->middleware(['auth', 'role:admin']);

Route::put('/admin/users/{user}', [AdminUserController::class, 'update'])
    ->middleware(['auth', 'role:admin']);

Route::get('/admin/projects', [AdminProjectController::class, 'index'])
    ->middleware(['auth', 'role:admin']);

Route::put('/admin/projects/{project}', [AdminProjectController::class, 'update'])
    ->middleware(['auth', 'role:admin']);

Route::delete('/admin/projects/{project}', [AdminProjectController::class, 'destroy'])
    ->middleware(['auth', 'role:admin']);

Route::get('/admin/posts', [AdminPostController::class, 'index'])
    ->middleware(['auth', 'role:admin']);

Route::post('/admin/posts', [AdminPostController::class, 'store'])
    ->middleware(['auth', 'role:admin']);

Route::put('/admin/posts/{post}', [AdminPostController::class, 'update'])
    ->middleware(['auth', 'role:admin']);

Route::delete('/admin/posts/{post}', [AdminPostController::class, 'destroy'])
    ->middleware(['auth', 'role:admin']);

// Logout
Route::post('/logout', [LogoutController::class, 'store'])
    ->middleware('auth');
