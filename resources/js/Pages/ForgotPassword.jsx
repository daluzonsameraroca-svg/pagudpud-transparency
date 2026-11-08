import { Link, useForm } from '@inertiajs/react';
import BackButton from '../Components/BackButton';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/forgot-password');
    };

    const inputClass =
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10';

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-8 text-slate-800 sm:px-8">
            <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-lg flex-col justify-center">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                    <div className="mb-8 text-center">
                        <Link href="/" className="mb-5 inline-flex justify-center">
                            <img
                                src="/images/pagudpud-logo.png.png"
                                alt=""
                                className="h-28 w-28 object-contain"
                            />
                        </Link>
                        <p className="text-sm font-bold text-blue-900">
                            Pagudpud Transparency
                        </p>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                            Forgot your password?
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            Enter the email address linked to your account. If
                            it is registered, we will send you a link to reset
                            your password.
                        </p>
                    </div>

                    {status && (
                        <p
                            role="status"
                            className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800"
                        >
                            {status}
                        </p>
                    )}

                    <form onSubmit={submit} className="space-y-5">
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
                                onChange={(event) =>
                                    setData('email', event.target.value)
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

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Sending link...' : 'Send reset link'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Remembered your password?{' '}
                        <Link
                            href="/login"
                            className="font-bold text-blue-800 hover:text-blue-950 hover:underline"
                        >
                            Return to sign in
                        </Link>
                    </p>

                    <BackButton fallback="/login" className="mt-8" />
                </section>
                <footer className="pt-5 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} Pagudpud Transparency
                </footer>
            </main>
        </div>
    );
}
