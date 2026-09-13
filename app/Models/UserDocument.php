<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDocument extends Model
{
    protected $fillable = [
        'user_id',
        'original_name',
        'stored_name',
        'path',
        'thumbnail_path',
        'mime_type',
        'size',
        'category',
    ];

    protected $appends = ['url', 'thumbnail_url', 'formatted_size'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * URL to download/view the file.
     */
    public function getUrlAttribute(): string
    {
        return route('admin.users.documents.show', [
            'user' => $this->user_id,
            'document' => $this->id,
        ]);
    }

    /**
     * URL to view the generated thumbnail, if any.
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        if ($this->thumbnail_path) {
            return route('admin.users.documents.show', [
                'user' => $this->user_id,
                'document' => $this->id,
                'thumbnail' => 1,
            ]);
        }

        return null;
    }

    /**
     * Human-readable file size (e.g. "2.4 MB").
     */
    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->size;

        if ($bytes < 1024) {
            return $bytes.' B';
        } elseif ($bytes < 1_048_576) {
            return round($bytes / 1024, 1).' KB';
        } elseif ($bytes < 1_073_741_824) {
            return round($bytes / 1_048_576, 1).' MB';
        }

        return round($bytes / 1_073_741_824, 2).' GB';
    }

    protected function casts(): array
    {
        return [
            'size' => 'integer',
        ];
    }
}
