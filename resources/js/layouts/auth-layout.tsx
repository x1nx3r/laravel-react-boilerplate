/**
 * Auth Layout Wrapper
 *
 * Available layout options (swap import to switch):
 * - auth-enhanced-split-layout: Modern split-screen with animated background (Current)
 * - auth-split-layout: Simple split-screen with dark branded panel
 * - auth-simple-layout: Minimalist centered card design
 * - auth-card-layout: Card-based with muted background
 */
import AuthLayoutTemplate from '@/layouts/auth/auth-enhanced-split-layout';

export default function AuthLayout({
    children,
    title,
    description,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}
