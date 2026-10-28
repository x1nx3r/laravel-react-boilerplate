import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function FlashToaster() {
    const { flash } = usePage().props;

    const success = flash.success;
    const error = flash.error;

    useEffect(() => {
        if (success) {
            toast.success(success, { id: 'flash-success' });
        }

        if (error) {
            toast.error(error, { id: 'flash-error' });
        }
    }, [success, error]);

    return <Toaster closeButton duration={5000} position="top-right" />;
}
