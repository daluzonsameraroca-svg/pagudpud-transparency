
import { Link, useForm } from '@inertiajs/react';
import BackButton from '../Components/BackButton';
import PasswordInput from '../Components/PasswordInput';

function AppLogo() {
    return (
        <img
            src="/images/pagudpud-logo.png.png"
            alt=""
            className="h-28 w-28 shrink-0 object-contain"
        />
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
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10';

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-8 text-slate-800 sm:px-8">
            <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-lg flex-col justify-center">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                    <div className="mb-8 text-center">
                        <Link href="/" className="mb-5 inline-flex justify-center">
                            <AppLogo />
                        </Link>
                        <p className="text-sm font-bold text-blue-900">
                            Pagudpud Transparency
                        </p>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                            Sign in to your account
                        </h1>
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

                                <PasswordInput
                                    id="password"
                                    name="password"
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
                                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Signing in...' : 'Sign in'}

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
                                className="font-bold text-blue-800 hover:text-blue-950 hover:underline"
                            >
                                Register
                            </Link>
                        </p>

                        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
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

                                
                            </div>
                        </div>

                        <BackButton fallback="/" className="mt-8" />
                </section>
                <footer className="pt-5 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} Pagudpud Transparency
                </footer>
            </main>
        </div>
    );
}
