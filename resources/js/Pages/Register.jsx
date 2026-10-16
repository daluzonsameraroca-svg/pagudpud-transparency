
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

function FieldError({ message }) {
    if (!message) return null;

    return (
        <p className="mt-2 text-sm text-red-600" role="alert">
            {message}
        </p>
    );
}

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    const inputClass =
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10';

    const labelClass =
        'mb-2 block text-sm font-semibold text-slate-700';

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
                            CITIZEN PARTICIPATION
                        </p>

                        <h1 className="text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
                            Be informed. Make your voice heard.
                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-8 text-emerald-50/85">
                            Create your Citizen account to explore local
                            government project information and share your
                            observations about projects in your community.
                        </p>

                        <div className="mt-9 space-y-5">
                            {[
                                'Browse project details and budgets',
                                'Follow reported project progress',
                                'Submit project-related feedback',
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

                {/* Registration form */}
                <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-12 xl:px-16">
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

                    <main className="mx-auto w-full max-w-md flex-1 py-10 sm:py-12">
                        <div className="mb-8">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                >
                                    <circle cx="9" cy="8" r="3.5" />
                                    <path d="M2.5 20v-1.5a6.5 6.5 0 0 1 13 0V20z" />
                                    <path d="M17 8v6m-3-3h6" />
                                </svg>
                            </div>

                            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-emerald-800">
                                JOIN THE COMMUNITY
                            </p>

                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                                Create your account
                            </h2>

                            <p className="mt-4 text-base leading-7 text-slate-500">
                                Register as a Citizen to access the platform
                                and participate in project monitoring.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Full name */}
                            <div>
                                <label htmlFor="name" className={labelClass}>
                                    Full name
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Enter your full name"
                                    required
                                    aria-invalid={Boolean(errors.name)}
                                    aria-describedby={
                                        errors.name ? 'name-error' : undefined
                                    }
                                    className={inputClass}
                                />

                                <FieldError message={errors.name} />
                            </div>

                            {/* Email and phone */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="email" className={labelClass}>
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
                                        placeholder="name@example.com"
                                        required
                                        aria-invalid={Boolean(errors.email)}
                                        aria-describedby={
                                            errors.email
                                                ? 'email-error'
                                                : undefined
                                        }
                                        className={inputClass}
                                    />

                                    <FieldError message={errors.email} />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone_number"
                                        className={labelClass}
                                    >
                                        Phone number
                                    </label>

                                    <input
                                        id="phone_number"
                                        name="phone_number"
                                        type="tel"
                                        autoComplete="tel"
                                        value={data.phone_number}
                                        onChange={(e) =>
                                            setData(
                                                'phone_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter phone number"
                                        aria-invalid={Boolean(
                                            errors.phone_number,
                                        )}
                                        aria-describedby={
                                            errors.phone_number
                                                ? 'phone-error'
                                                : undefined
                                        }
                                        className={inputClass}
                                    />

                                    <FieldError message={errors.phone_number} />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label htmlFor="address" className={labelClass}>
                                    Address
                                </label>

                                <textarea
                                    id="address"
                                    name="address"
                                    autoComplete="street-address"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    placeholder="Enter your barangay or address"
                                    rows={3}
                                    aria-invalid={Boolean(errors.address)}
                                    aria-describedby={
                                        errors.address
                                            ? 'address-error'
                                            : undefined
                                    }
                                    className={`${inputClass} resize-y leading-6`}
                                />

                                <FieldError message={errors.address} />
                            </div>

                            {/* Account type */}
                            <div>
                                <label className={labelClass}>
                                    Account type
                                </label>

                                <div className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            Citizen
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Standard public account
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800">
                                        Citizen access
                                    </span>
                                </div>

                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Public registration is available for
                                    Citizens. Engineering and Administrator
                                    accounts are assigned administratively.
                                </p>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className={labelClass}
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder="Create a password"
                                    required
                                    aria-invalid={Boolean(errors.password)}
                                    aria-describedby={
                                        errors.password
                                            ? 'password-error'
                                            : undefined
                                    }
                                    className={inputClass}
                                />

                                <FieldError message={errors.password} />
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className={labelClass}
                                >
                                    Confirm password
                                </label>

                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter your password again"
                                    required
                                    aria-invalid={Boolean(
                                        errors.password_confirmation,
                                    )}
                                    aria-describedby={
                                        errors.password_confirmation
                                            ? 'confirmation-error'
                                            : undefined
                                    }
                                    className={inputClass}
                                />

                                <FieldError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing
                                    ? 'Creating account...'
                                    : 'Create Citizen Account'}

                                {!processing && (
                                    <span aria-hidden="true">→</span>
                                )}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-600">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </main>

                    <footer className="pt-5 text-center text-xs text-slate-400">
                        © {new Date().getFullYear()} Pagudpud Transparency
                    </footer>
                </section>
            </div>
        </div>
    );
}
