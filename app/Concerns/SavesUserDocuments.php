<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\ImageManager;
use Throwable;

trait SavesUserDocuments
{
    /**
     * Persist uploaded files for a user, generating scaled-down
     * thumbnails for images.
     *
     * @param  array<int, UploadedFile>  $files
     */
    protected function saveUserDocuments(User $user, array $files, ?string $category = null): void
    {
        foreach ($files as $uploadedFile) {
            $stored = $uploadedFile->store("user-documents/{$user->id}", 'local');

            $thumbnailPath = null;
            $mimeType = $uploadedFile->getMimeType();

            if (str_starts_with((string) $mimeType, 'image/')) {
                $thumbnailPath = $this->generateThumbnail($uploadedFile->getPathname(), $stored, $user->id);
            }

            $user->documents()->create([
                'original_name' => $uploadedFile->getClientOriginalName(),
                'stored_name' => basename($stored),
                'path' => $stored,
                'thumbnail_path' => $thumbnailPath,
                'mime_type' => $mimeType,
                'size' => $uploadedFile->getSize(),
                'category' => $category,
            ]);
        }
    }

    private function generateThumbnail(string $sourcePath, string $storedName, string $userId): ?string
    {
        try {
            $manager = new ImageManager(new GdDriver);
            $image = $manager->decodePath($sourcePath);
            $image->scaleDown(500, 500);

            $thumbRelativePath = "user-documents/{$userId}/thumb_".basename($storedName);
            $thumbAbsolutePath = Storage::disk('local')->path($thumbRelativePath);

            if (! file_exists(dirname($thumbAbsolutePath))) {
                mkdir(dirname($thumbAbsolutePath), 0755, true);
            }

            $image->save($thumbAbsolutePath);

            return $thumbRelativePath;
        } catch (Throwable $e) {
            Log::warning('Thumbnail generation failed: '.$e->getMessage());

            return null;
        }
    }
}
