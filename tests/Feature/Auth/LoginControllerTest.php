<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class LoginControllerTest extends TestCase
{
    use RefreshDatabase;

    #[DataProvider('loginRoles')]
    public function test_successful_login_redirects_to_the_matching_dashboard(
        string $role,
        string $dashboard,
    ): void {
        $user = User::factory()->create([
            'role' => $role,
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect($dashboard);
        $this->assertAuthenticatedAs($user);
    }

    public static function loginRoles(): array
    {
        return [
            'citizen' => ['citizen', '/citizen/dashboard'],
            'engineering' => ['engineering', '/engineering/dashboard'],
            'admin' => ['admin', '/admin/dashboard'],
            'administrator' => ['administrator', '/admin/dashboard'],
        ];
    }

    public function test_login_accepts_email_with_different_casing(): void
    {
        $user = User::factory()->create([
            'email' => 'citizen@example.com',
            'role' => 'citizen',
        ]);

        $response = $this->post('/login', [
            'email' => '  CITIZEN@EXAMPLE.COM  ',
            'password' => 'password',
        ]);

        $response->assertRedirect('/citizen/dashboard');
        $this->assertAuthenticatedAs($user);
    }

    public function test_successful_login_keeps_the_session_on_the_dashboard_request(): void
    {
        $user = User::factory()->create([
            'role' => 'citizen',
        ]);

        $response = $this->followingRedirects()->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertInertia(fn ($page) => $page
            ->component('Citizen/Dashboard')
        );
        $this->assertAuthenticatedAs($user);
    }

    public function test_login_reports_when_the_account_does_not_exist(): void
    {
        $response = $this->followingRedirects()
            ->from('/login')
            ->post('/login', [
                'email' => 'missing@example.com',
                'password' => 'incorrect-password',
            ]);

        $response->assertInertia(fn ($page) => $page
            ->component('Login')
            ->where('errors.email', 'Account does not exist.')
        );
        $this->assertGuest();
    }

    public function test_login_keeps_generic_error_for_an_incorrect_password(): void
    {
        $user = User::factory()->create([
            'email' => 'registered@example.com',
            'role' => 'citizen',
        ]);

        $response = $this->followingRedirects()
            ->from('/login')
            ->post('/login', [
                'email' => $user->email,
                'password' => 'incorrect-password',
            ]);

        $response->assertInertia(fn ($page) => $page
            ->component('Login')
            ->where('errors.email', 'The provided email or password is incorrect.')
        );
        $this->assertGuest();
    }

    public function test_administrator_role_can_access_the_admin_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'administrator',
        ]);

        $response = $this->actingAs($user)->get('/admin/dashboard');

        $response->assertOk();
    }
}
