<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PublicImageController extends Controller
{
    public function show(string $path): StreamedResponse
    {
        abort_unless(
            preg_match(
                '/\A(?:projects|feedback)\/[A-Za-z0-9][A-Za-z0-9._\/-]*\.(?:jpe?g|png|webp)\z/i',
                $path,
            ) === 1
            && ! collect(explode('/', $path))
                ->contains(fn (string $segment): bool => in_array($segment, ['', '.', '..'], true)),
            404,
        );

        $disk = Storage::disk(config('filesystems.upload_disk', 'public'));

        abort_unless($disk->exists($path), 404);

        $stream = $disk->readStream($path);

        if (! is_resource($stream)) {
            throw new RuntimeException('The requested image could not be read from storage.');
        }

        $contentType = match (strtolower(pathinfo($path, PATHINFO_EXTENSION))) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'webp' => 'image/webp',
        };

        return response()->stream(function () use ($stream): void {
            try {
                fpassthru($stream);
            } finally {
                if (is_resource($stream)) {
                    fclose($stream);
                }
            }
        }, headers: [
            'Cache-Control' => 'public, max-age=86400',
            'Content-Disposition' => 'inline',
            'Content-Type' => $contentType,
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
