<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_progress_updates', function (Blueprint $table) {
            $table->id();

            $table->foreignId('project_id')
                ->constrained('projects')
                ->cascadeOnDelete();

            $table->string('status');

            $table->unsignedTinyInteger('progress');

            $table->text('update_description')->nullable();

            $table->date('update_date');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_progress_updates');
    }
};