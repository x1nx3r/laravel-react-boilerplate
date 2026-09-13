import { Head, Link } from '@inertiajs/react';
import {
    ShieldAlert,
    FileQuestion,
    ServerCrash,
    Construction,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorPage({ status }: { status: number }) {
    const title =
        {
            503: 'Sedang Dalam Perbaikan',
            500: 'Terjadi Kesalahan Server',
            404: 'Halaman Tidak Ditemukan',
            403: 'Akses Ditolak',
        }[status] || 'Terjadi Kesalahan';

    const description =
        {
            503: 'Maaf, kami sedang melakukan pemeliharaan rutin. Silakan coba lagi nanti.',
            500: 'Oops, sesuatu gik salah di server kami.',
            404: 'Maaf, halaman yang Anda cari tidak dapat ditemukan.',
            403: 'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.',
        }[status] || 'Maaf, terjadi kesalahan yang tidak terduga.';

    const Icon =
        {
            503: Construction,
            500: ServerCrash,
            404: FileQuestion,
            403: ShieldAlert,
        }[status] || ServerCrash;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
            <Head title={title} />

            <div className="flex max-w-md flex-col items-center space-y-6 text-center">
                <div className="rounded-full bg-muted p-6">
                    <Icon className="h-16 w-16 text-primary" />
                </div>

                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    {title}
                </h1>

                <p className="text-lg text-muted-foreground">{description}</p>

                <div className="flex gap-4">
                    <Button asChild size="lg">
                        <Link href="/">Kembali ke Beranda</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
