<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_their_profile(): void
    {
        $user = User::factory()->create([
            'role' => 'citizen',
            'phone_number' => '555-0100',
            'address' => 'Pagudpud',
        ]);

        $response = $this->actingAs($user)->get('/profile');

        $response->assertInertia(fn ($page) => $page
            ->component('Profile/Show')
            ->where('user.name', $user->name)
            ->where('user.email', $user->email)
            ->where('user.phone_number', '555-0100')
            ->where('user.address', 'Pagudpud')
            ->where('user.role', 'citizen')
        );
    }

    public function test_guest_is_redirected_to_login_from_the_profile_page(): void
    {
        $response = $this->get('/profile');

        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_update_only_their_editable_profile_fields(): void
    {
        $user = User::factory()->create([
            'role' => 'citizen',
            'phone_number' => '555-0100',
            'address' => 'Old address',
        ]);
        $originalEmail = $user->email;
        $originalPassword = $user->password;

        $response = $this->actingAs($user)->put('/profile', [
            'name' => 'Updated Citizen',
            'phone_number' => '555-0199',
            'address' => 'New address, Pagudpud',
            'email' => 'changed@example.com',
            'role' => 'admin',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Citizen',
            'email' => $originalEmail,
            'phone_number' => '555-0199',
            'address' => 'New address, Pagudpud',
            'role' => 'citizen',
            'password' => $originalPassword,
        ]);
    }

    public function test_profile_update_requires_a_name(): void
    {
        $user = User::factory()->create([
            'role' => 'citizen',
        ]);

        $response = $this->actingAs($user)->from('/profile')->put('/profile', [
            'name' => '',
            'phone_number' => '555-0199',
            'address' => 'Pagudpud',
        ]);

        $response->assertRedirect('/profile');
        $response->assertSessionHasErrors([
            'name' => 'The name field is required.',
        ]);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => $user->name,
        ]);
    }
}
