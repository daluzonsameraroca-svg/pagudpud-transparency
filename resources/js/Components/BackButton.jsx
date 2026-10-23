import { router, usePage } from '@inertiajs/react';

export default function BackButton({
    fallback = '/',
    className = '',
}) {
    const { url } = usePage();
    const currentPath = new URL(url, 'http://localhost').pathname;
    const hasPreviousPage =
        typeof window !== 'undefined' && window.history.length > 1;
    const disabled = !hasPreviousPage && currentPath === fallback;

    const goBack = () => {
        if (window.history.length > 1) {
            window.history.back();
            return;
        }

        if (currentPath !== fallback) {
            router.visit(fallback);
        }
    };

    return (
        <button
            type="button"
            onClick={goBack}
            disabled={disabled}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            aria-label="Go back"
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
            >
                <path d="M19 12H5m7 7-7-7 7-7" />
            </svg>
            <span>Back</span>
        </button>
    );
}
