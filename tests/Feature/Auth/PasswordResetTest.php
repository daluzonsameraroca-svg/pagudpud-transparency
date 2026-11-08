<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_citizen_can_request_a_password_reset_link(): void
    {
        Notification::fake();
        $citizen = User::factory()->create([
            'email' => 'citizen@example.com',
            'role' => 'citizen',
        ]);

        $response = $this->from('/forgot-password')
            ->post('/forgot-password', [
                'email' => '  CITIZEN@EXAMPLE.COM ',
            ]);

        $response->assertRedirect('/forgot-password');
        $response->assertSessionHas(
            'status',
            'If an account exists for that email address, we have sent a password reset link.',
        );
        Notification::assertSentTo($citizen, ResetPassword::class);
    }

    public function test_password_reset_request_does_not_reveal_if_an_email_exists(): void
    {
        Notification::fake();
        $citizen = User::factory()->create([
            'email' => 'citizen@example.com',
            'role' => 'citizen',
        ]);
        $message = 'If an account exists for that email address, we have sent a password reset link.';

        $registeredResponse = $this->from('/forgot-password')
            ->post('/forgot-password', [
                'email' => $citizen->email,
            ]);
        $missingResponse = $this->from('/forgot-password')
            ->post('/forgot-password', [
                'email' => 'missing@example.com',
            ]);

        $registeredResponse->assertSessionHas('status', $message);
        $missingResponse->assertSessionHas('status', $message);
        Notification::assertSentTo($citizen, ResetPassword::class);
    }

    public function test_citizen_can_reset_password_with_a_valid_token(): void
    {
        $citizen = User::factory()->create([
            'email' => 'citizen@example.com',
            'role' => 'citizen',
        ]);
        $token = Password::createToken($citizen);

        $response = $this->from('/reset-password/'.$token)
            ->post('/reset-password', [
                'token' => $token,
                'email' => '  CITIZEN@EXAMPLE.COM ',
                'password' => 'new-secure-password',
                'password_confirmation' => 'new-secure-password',
            ]);

        $response->assertRedirect('/login');
        $response->assertSessionHas(
            'status',
            'Your password has been reset. You can now sign in.',
        );
        $citizen->refresh();
        $this->assertTrue(Hash::check('new-secure-password', $citizen->password));
        $this->assertDatabaseMissing('password_reset_tokens', [
            'email' => $citizen->email,
        ]);

        $this->post('/login', [
            'email' => $citizen->email,
            'password' => 'new-secure-password',
        ])->assertRedirect('/citizen/dashboard');
    }

    public function test_password_is_not_changed_when_the_reset_token_is_invalid(): void
    {
        $citizen = User::factory()->create([
            'email' => 'citizen@example.com',
            'role' => 'citizen',
        ]);
        $originalPassword = $citizen->password;

        $response = $this->from('/reset-password/invalid-token')
            ->post('/reset-password', [
                'token' => 'invalid-token',
                'email' => $citizen->email,
                'password' => 'new-secure-password',
                'password_confirmation' => 'new-secure-password',
            ]);

        $response->assertRedirect('/reset-password/invalid-token');
        $response->assertSessionHasErrors(['email']);
        $this->assertSame($originalPassword, $citizen->fresh()->password);
    }
}
