<?php

return [
    'account' => [
        'pending' => 'Akun Anda menunggu verifikasi dari HR.',
        'deactivated' => 'Akun Anda telah dinonaktifkan.',
        'self_role_change' => 'Anda tidak dapat mengubah peran atau menonaktifkan akun sendiri.',
        'self_delete' => 'Anda tidak dapat menghapus akun sendiri.',
    ],

    'users' => [
        'created' => 'Pegawai berhasil dibuat.',
        'updated' => 'Pegawai berhasil diperbarui.',
        'verified' => 'Pegawai berhasil diverifikasi dan diaktifkan.',
        'deleted' => 'Pegawai berhasil dihapus.',
        'document_uploaded' => 'Dokumen berhasil diunggah.',
        'document_deleted' => 'Dokumen berhasil dihapus.',
    ],

    'roles' => [
        'created' => 'Peran berhasil dibuat.',
        'updated' => 'Peran berhasil diperbarui.',
        'deleted' => 'Peran berhasil dihapus.',
        'in_use' => 'Peran yang masih memiliki pengguna tidak dapat dihapus.',
    ],

    'registration' => [
        'updated' => 'Pengaturan pendaftaran berhasil diperbarui.',
    ],

    'attendance' => [
        'checked_in' => 'Berhasil check in. Semoga harimu menyenangkan!',
        'checked_out' => 'Berhasil check out. Sampai jumpa besok!',
        'already_checked_in' => 'Anda sudah check in hari ini.',
        'already_checked_out' => 'Anda sudah check out hari ini.',
        'not_checked_in' => 'Anda belum check in hari ini.',
        'on_leave' => 'Anda sedang cuti hari ini.',
    ],

    'leaves' => [
        'submitted' => 'Pengajuan cuti berhasil dikirim.',
        'approved' => 'Pengajuan cuti disetujui.',
        'rejected' => 'Pengajuan cuti ditolak.',
        'already_reviewed' => 'Pengajuan ini sudah ditinjau.',
        'overlap' => 'Rentang tanggal bertabrakan dengan pengajuan cuti lain yang masih pending atau disetujui.',
    ],
];
