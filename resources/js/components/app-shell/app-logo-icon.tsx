import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGSVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M16 3l11 6.4v13.2L16 29 5 22.6V9.4L16 3z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            <circle cx="16" cy="16" r="3.5" fill="currentColor" />
        </svg>
    );
}
