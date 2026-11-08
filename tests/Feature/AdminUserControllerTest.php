<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminUserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_an_engineering_editor_account(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)
            ->from('/admin/users')
            ->post('/admin/users', [
                'name' => 'Engineering Editor',
                'email' => 'EDITOR@EXAMPLE.COM',
                'password' => 'SecurePassword123!',
                'password_confirmation' => 'SecurePassword123!',
                'engineering_permission' => 'editor',
                'role' => 'admin',
            ]);

        $response->assertRedirect('/admin/users');
        $engineer = User::where('email', 'editor@example.com')->firstOrFail();
        $this->assertSame('engineering', $engineer->role);
        $this->assertSame('editor', $engineer->engineering_permission);
        $this->assertTrue(Hash::check('SecurePassword123!', $engineer->password));
    }

    public function test_admin_can_create_an_engineering_viewer_account(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)
            ->from('/admin/users')
            ->post('/admin/users', [
                'name' => 'Engineering Viewer',
                'email' => 'viewer@example.com',
                'password' => 'SecurePassword123!',
                'password_confirmation' => 'SecurePassword123!',
                'engineering_permission' => 'viewer',
            ]);

        $response->assertRedirect('/admin/users');
        $this->assertDatabaseHas('users', [
            'name' => 'Engineering Viewer',
            'email' => 'viewer@example.com',
            'role' => 'engineering',
            'engineering_permission' => 'viewer',
        ]);
    }

    public function test_non_admin_cannot_create_an_engineering_account(): void
    {
        $citizen = User::factory()->create(['role' => 'citizen']);

        $this->actingAs($citizen)
            ->post('/admin/users', [
                'name' => 'Engineering Editor',
                'email' => 'editor@example.com',
                'password' => 'SecurePassword123!',
                'password_confirmation' => 'SecurePassword123!',
                'engineering_permission' => 'editor',
            ])
            ->assertForbidden();

        $this->assertDatabaseMissing('users', [
            'email' => 'editor@example.com',
        ]);
    }

    public function test_engineering_account_creation_rejects_an_invalid_permission(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)
            ->from('/admin/users')
            ->post('/admin/users', [
                'name' => 'Engineering User',
                'email' => 'engineer@example.com',
                'password' => 'SecurePassword123!',
                'password_confirmation' => 'SecurePassword123!',
                'engineering_permission' => 'administrator',
            ]);

        $response->assertRedirect('/admin/users');
        $response->assertSessionHasErrors(['engineering_permission']);
        $this->assertDatabaseMissing('users', [
            'email' => 'engineer@example.com',
        ]);
    }

    public function test_engineering_account_creation_requires_confirmed_password(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)
            ->from('/admin/users')
            ->post('/admin/users', [
                'name' => 'Engineering User',
                'email' => 'engineer@example.com',
                'password' => 'SecurePassword123!',
                'password_confirmation' => 'DifferentPassword123!',
                'engineering_permission' => 'viewer',
            ]);

        $response->assertRedirect('/admin/users');
        $response->assertSessionHasErrors(['password']);
        $this->assertDatabaseMissing('users', [
            'email' => 'engineer@example.com',
        ]);
    }

    public function test_engineering_account_creation_rejects_duplicate_email_case_insensitively(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->create(['email' => 'existing@example.com']);

        $response = $this->actingAs($admin)
            ->from('/admin/users')
            ->post('/admin/users', [
                'name' => 'Duplicate Engineering User',
                'email' => 'EXISTING@EXAMPLE.COM',
                'password' => 'SecurePassword123!',
                'password_confirmation' => 'SecurePassword123!',
                'engineering_permission' => 'viewer',
            ]);

        $response->assertRedirect('/admin/users');
        $response->assertSessionHasErrors(['email']);
        $this->assertDatabaseCount('users', 2);
    }

    public function test_admin_can_assign_editor_access_to_an_engineering_user(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $engineer = User::factory()->create(['role' => 'engineering']);

        $response = $this->actingAs($admin)
            ->put("/admin/users/{$engineer->id}", [
                'engineering_permission' => 'editor',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $engineer->id,
            'engineering_permission' => 'editor',
        ]);

        $engineer->refresh();

        $this->actingAs($engineer)
            ->get('/engineering/projects')
            ->assertInertia(fn ($page) => $page
                ->component('Engineering/Projects')
                ->where('auth.user.engineering_permission', 'editor')
            );
    }

    public function test_admin_cannot_assign_engineering_access_to_a_non_engineering_user(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $citizen = User::factory()->create(['role' => 'citizen']);

        $response = $this->actingAs($admin)
            ->from('/admin/users')
            ->put("/admin/users/{$citizen->id}", [
                'engineering_permission' => 'editor',
            ]);

        $response->assertRedirect('/admin/users');
        $response->assertSessionHasErrors(['engineering_permission']);
        $this->assertDatabaseHas('users', [
            'id' => $citizen->id,
            'role' => 'citizen',
            'engineering_permission' => 'viewer',
        ]);
    }

    public function test_admin_cannot_assign_an_unknown_engineering_permission(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $engineer = User::factory()->create(['role' => 'engineering']);

        $response = $this->actingAs($admin)
            ->from('/admin/users')
            ->put("/admin/users/{$engineer->id}", [
                'engineering_permission' => 'administrator',
            ]);

        $response->assertRedirect('/admin/users');
        $response->assertSessionHasErrors(['engineering_permission']);
        $this->assertDatabaseHas('users', [
            'id' => $engineer->id,
            'engineering_permission' => 'viewer',
        ]);
    }

    public function test_changing_a_user_role_resets_engineering_access_to_viewer(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $citizen = User::factory()->create([
            'role' => 'citizen',
            'engineering_permission' => 'editor',
        ]);

        $response = $this->actingAs($admin)
            ->put("/admin/users/{$citizen->id}", [
                'role' => 'engineering',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $citizen->id,
            'role' => 'engineering',
            'engineering_permission' => 'viewer',
        ]);
    }
}
