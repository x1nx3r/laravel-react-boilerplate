import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-shell/app-logo-icon';
import type { AuthLayoutProps } from '@/types';

export default function AuthEnhancedSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="flex min-h-dvh">
            {/* Left Panel - Welcome Section */}
            <div className="relative hidden overflow-hidden bg-linear-to-br from-primary via-primary/90 to-primary lg:flex lg:w-1/2">
                {/* Floating Animated Shapes */}
                <div className="absolute top-20 left-10 h-32 w-32 animate-pulse rounded-full bg-white/10"></div>
                <div className="absolute top-40 right-20 h-20 w-20 animate-bounce rounded-full bg-white/5"></div>
                <div className="absolute bottom-32 left-20 h-24 w-24 animate-ping rounded-full bg-white/10"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-start justify-center p-12 text-white">
                    {/* Logo */}
                    <div className="mb-8 flex items-center">
                        <div className="mr-4 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-white">
                            <AppLogoIcon className="h-32 w-32 fill-primary" />
                        </div>
                        <span className="text-4xl font-bold">{name}</span>
                    </div>

                    {/* Welcome Text */}
                    <h1 className="mb-4 text-7xl leading-tight font-bold">
                        Selamat Datang!
                    </h1>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="mb-8 text-center lg:hidden">
                        <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-lg">
                            <AppLogoIcon className="h-28 w-28 fill-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            {name}
                        </h2>
                    </div>

                    {/* Welcome Text */}
                    <div className="mb-8">
                        <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-sm text-balance text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Form Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}
