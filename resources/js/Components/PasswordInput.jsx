import { useState } from 'react';

export default function PasswordInput({
    id,
    className = '',
    ...inputProps
}) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <input
                {...inputProps}
                id={id}
                type={visible ? 'text' : 'password'}
                className={`${className} pr-12`}
            />
            <button
                type="button"
                onClick={() => setVisible((current) => !current)}
                aria-label={visible ? 'Hide password' : 'Show password'}
                aria-controls={id}
                aria-pressed={visible}
                className="absolute inset-y-0 right-0 z-10 flex w-12 items-center justify-center bg-transparent text-slate-600 transition hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-blue-700"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="pointer-events-none h-5 w-5"
                    aria-hidden="true"
                >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            </button>
        </div>
    );
}
