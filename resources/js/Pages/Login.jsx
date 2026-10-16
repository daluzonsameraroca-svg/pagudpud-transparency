
import { Link, useForm } from '@inertiajs/react';

function AppLogo() {
    return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
            <svg
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7"
                aria-hidden="true"
            >
                <path d="M4 12 16 5l12 7" />
                <path d="M7 13h18M9 13v11m7-11v11m7-11v11M5 25h22" />
            </svg>
        </div>
    );
}

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    const inputClass =
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <div className="grid min-h-screen lg:grid-cols-2">

                {/* Branding panel */}
                <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 p-10 text-white lg:flex xl:p-14">
                    <div
                        className="pointer-events-none absolute inset-0 opacity-10"
                        aria-hidden="true"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)',
                            backgroundSize: '24px 24px',
                        }}
                    />

                    <Link
                        href="/"
                        className="relative flex items-center gap-3"
                    >
                        <AppLogo />

                        <div>
                            <p className="text-base font-extrabold tracking-tight">
                                Pagudpud Transparency
                            </p>
                            <p className="mt-1 text-xs text-emerald-100/75">
                                Municipality of Pagudpud · Ilocos Norte
                            </p>
                        </div>
                    </Link>

                    <div className="relative my-12 max-w-xl">
                        <p className="mb-5 text-xs font-bold tracking-[0.18em] text-emerald-300">
                            LOCAL PROJECT MONITORING
                        </p>

                        <h1 className="text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
                            A clearer view of local projects.
                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-8 text-emerald-50/85">
                            Access project information, follow reported
                            progress, and take part in your community through
                            one centralized platform.
                        </p>

                        <div className="mt-9 space-y-5">
                            {[
                                'View project details and schedules',
                                'Follow reported project progress',
                                'Submit feedback as a citizen',
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 text-sm text-emerald-50/90"
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/30 text-xs">
                                        ✓
                                    </span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative border-t border-white/15 pt-5">
                        <p className="text-xs leading-6 text-emerald-100/65">
                            Web-Based Local Government Project Monitoring
                            System · Pagudpud, Ilocos Norte
                        </p>
                    </div>
                </section>

                {/* Login form panel */}
                <section className="flex min-h-screen flex-col justify-between px-5 py-6 sm:px-10 lg:px-12 xl:px-20">
                    <header className="flex items-center justify-between gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-3 lg:hidden"
                        >
                            <AppLogo />
                            <span className="text-sm font-extrabold text-slate-950">
                                Pagudpud Transparency
                            </span>
                        </Link>

                        <Link
                            href="/"
                            className="ml-auto rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-emerald-800"
                        >
                            ← Back to home
                        </Link>
                    </header>

                    <main className="mx-auto w-full max-w-md py-12">
                        <div className="mb-9">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                >
                                    <rect
                                        x="5"
                                        y="10"
                                        width="14"
                                        height="11"
                                        rx="2"
                                    />
                                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                    <path d="M12 14v3" />
                                </svg>
                            </div>

                            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-emerald-800">
                                WELCOME BACK
                            </p>

                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                                Sign in to your account
                            </h2>

                            <p className="mt-4 text-base leading-7 text-slate-500">
                                Enter your account details to continue to
                                Pagudpud Transparency.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="Enter your email"
                                    required
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby={
                                        errors.email ? 'email-error' : undefined
                                    }
                                    className={inputClass}
                                />

                                {errors.email && (
                                    <p
                                        id="email-error"
                                        className="mt-2 text-sm text-red-600"
                                    >
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    required
                                    aria-invalid={Boolean(errors.password)}
                                    aria-describedby={
                                        errors.password
                                            ? 'password-error'
                                            : undefined
                                    }
                                    className={inputClass}
                                />

                                {errors.password && (
                                    <p
                                        id="password-error"
                                        className="mt-2 text-sm text-red-600"
                                    >
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Signing in...' : 'Sign in'}

                                {!processing && (
                                    <span aria-hidden="true">→</span>
                                )}
                            </button>
                        </form>

                        <div className="my-8 flex items-center gap-4">
                            <div className="h-px flex-1 bg-slate-200" />
                            <span className="text-xs font-medium text-slate-400">
                                NEW TO THE PLATFORM?
                            </span>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <p className="text-center text-sm text-slate-600">
                            Don't have an account?{' '}
                            <Link
                                href="/register"
                                className="font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
                            >
                                Register as a Citizen
                            </Link>
                        </p>

                        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    >
                                        <path d="M12 3 4.5 6v5c0 5 3.2 8.5 7.5 10 4.3-1.5 7.5-5 7.5-10V6L12 3Z" />
                                        <path d="m9 12 2 2 4-4" />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-slate-800">
                                        Account access
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        Public registration is for Citizens.
                                        Engineering and Administrator accounts
                                        are assigned by the system administrator.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer className="pt-5 text-center text-xs text-slate-400">
                        © {new Date().getFullYear()} Pagudpud Transparency
                    </footer>
                </section>
            </div>
        </div>
    );
}
