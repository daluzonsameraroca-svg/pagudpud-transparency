<?php

namespace App\Http\Controllers;

use App\Models\AdministrativePost;
use Illuminate\Http\Request;

class AdminPostController extends Controller
{
    // Display posts for the administrator.
    public function index()
    {
        $posts = AdministrativePost::with('user')
            ->latest()
            ->get();

        return inertia('Admin/Posts', [
            'posts' => $posts,
        ]);
    }

    // Display published posts for citizens.
    public function citizenIndex()
    {
        $posts = AdministrativePost::with('user')
            ->latest()
            ->get();

        return inertia('Citizen/Posts', [
            'posts' => $posts,
        ]);
    }

    // Create a new administrative post.
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'content' => [
                'required',
                'string',
            ],
        ]);

        AdministrativePost::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'user_id' => auth()->id(),
        ]);

        return back()->with(
            'success',
            'Administrative post published successfully.'
        );
    }

    // Update an existing administrative post.
    public function update(
        Request $request,
        AdministrativePost $post
    ) {
        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'content' => [
                'required',
                'string',
            ],
        ]);

        $post->update($validated);

        return back()->with(
            'success',
            'Administrative post updated successfully.'
        );
    }

    // Delete an administrative post.
    public function destroy(AdministrativePost $post)
    {
        $post->delete();

        return back()->with(
            'success',
            'Administrative post deleted successfully.'
        );
    }
}