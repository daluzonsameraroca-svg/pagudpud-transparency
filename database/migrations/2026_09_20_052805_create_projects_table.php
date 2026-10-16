<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();

            $table->string('project_name');

            $table->text('description')->nullable();

            $table->string('location');

            $table->decimal('budget', 15, 2);

            $table->date('start_date')->nullable();

            $table->date('target_completion_date')->nullable();

            $table->string('status')->default('Planned');

            $table->integer('progress')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};