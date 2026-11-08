import { Link, useForm } from '@inertiajs/react';
import BackButton from '../Components/BackButton';
import PasswordInput from '../Components/PasswordInput';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/reset-password');
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
                            Set a new password
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            Choose a new password for your account.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <input type="hidden" name="token" value={data.token} />

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
                                New password
                            </label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(event) =>
                                    setData('password', event.target.value)
                                }
                                placeholder="At least 8 characters"
                                minLength={8}
                                required
                                aria-invalid={Boolean(errors.password)}
                                aria-describedby={
                                    errors.password ? 'password-error' : undefined
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

                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Confirm new password
                            </label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(event) =>
                                    setData(
                                        'password_confirmation',
                                        event.target.value,
                                    )
                                }
                                placeholder="Re-enter your new password"
                                minLength={8}
                                required
                                aria-invalid={Boolean(
                                    errors.password_confirmation,
                                )}
                                aria-describedby={
                                    errors.password_confirmation
                                        ? 'password-confirmation-error'
                                        : undefined
                                }
                                className={inputClass}
                            />
                            {errors.password_confirmation && (
                                <p
                                    id="password-confirmation-error"
                                    className="mt-2 text-sm text-red-600"
                                >
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Updating password...' : 'Reset password'}
                        </button>
                    </form>

                    <BackButton fallback="/login" className="mt-8" />
                </section>
                <footer className="pt-5 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} Pagudpud Transparency
                </footer>
            </main>
        </div>
    );
}
