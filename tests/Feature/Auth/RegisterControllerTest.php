<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_registration_creates_and_authenticates_a_citizen(): void
    {
        $response = $this->followingRedirects()->post('/register', [
            'name' => 'Test Citizen',
            'email' => '  CITIZEN@example.com ',
            'phone_number' => '555-0100',
            'barangay' => 'Aggasi',
            'sitio' => 'Sitio Uno',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertInertia(fn ($page) => $page
            ->component('Citizen/Dashboard')
            ->where('isNewCitizen', true)
        );

        $this->get('/citizen/dashboard')
            ->assertInertia(fn ($page) => $page
                ->component('Citizen/Dashboard')
                ->where('isNewCitizen', false)
            );

        $this->assertAuthenticatedAs(User::where('email', 'citizen@example.com')->firstOrFail());

        $this->assertDatabaseHas('users', [
            'email' => 'citizen@example.com',
            'role' => 'citizen',
            'address' => 'Sitio Uno, Aggasi, Pagudpud, Ilocos Norte',
        ]);
    }

    public function test_registration_validation_errors_are_shared_with_the_register_page(): void
    {
        $response = $this->followingRedirects()
            ->from('/register')
            ->post('/register', [
                'name' => 'Test Citizen',
                'email' => 'citizen@example.com',
                'phone_number' => '555-0100',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

        $response->assertInertia(fn ($page) => $page
            ->component('Register')
            ->where('errors.barangay', 'The barangay field is required.')
            ->where('errors.sitio', 'The sitio field is required.')
        );

        $this->assertDatabaseMissing('users', [
            'email' => 'citizen@example.com',
        ]);
        $this->assertGuest();
    }
}
