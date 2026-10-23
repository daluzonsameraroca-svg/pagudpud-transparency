
import { Link, useForm } from '@inertiajs/react';
import BackButton from '../Components/BackButton';
import PasswordInput from '../Components/PasswordInput';
import usePagudpudBarangays from '../Hooks/usePagudpudBarangays';

function AppLogo() {
    return (
        <img
            src="/images/pagudpud-logo.png.png"
            alt="Pagudpud Transparency logo"
            className="h-28 w-28 object-contain"
        />
    );
}

function FieldError({ id, message }) {
    if (!message) return null;

    return (
        <p id={id} className="mt-2 text-sm text-red-600" role="alert">
            {message}
        </p>
    );
}

export default function Register() {
    const {
        barangays,
        loading: barangaysLoading,
        error: barangaysError,
        retry: retryBarangays,
    } = usePagudpudBarangays();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone_number: '',
        barangay: '',
        sitio: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    const inputClass =
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10';

    const passwordMeetsLengthRequirement = data.password.length >= 8;
    const passwordsMatch =
        data.password_confirmation.length > 0 &&
        data.password === data.password_confirmation;

    const labelClass =
        'mb-2 block text-sm font-semibold text-slate-700';

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-8 text-slate-800 sm:px-8">
            <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col justify-center">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                    <div className="mb-8 text-center">
                        <Link href="/" className="mb-3 inline-flex justify-center">
                            <AppLogo />
                        </Link>
                        <p className="text-sm font-bold text-blue-900">
                            Pagudpud Transparency
                        </p>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                            Create your account
                        </h1>
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
                                        required
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
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="barangay"
                                            className={labelClass}
                                        >
                                            Barangay
                                        </label>
                                        <select
                                            id="barangay"
                                            name="barangay"
                                            value={data.barangay}
                                            onChange={(event) =>
                                                setData(
                                                    'barangay',
                                                    event.target.value,
                                                )
                                            }
                                            required
                                            disabled={
                                                barangaysLoading ||
                                                Boolean(barangaysError)
                                            }
                                            aria-invalid={Boolean(
                                                errors.barangay ||
                                                    barangaysError,
                                            )}
                                            aria-describedby={
                                                errors.barangay
                                                    ? 'barangay-error'
                                                    : barangaysError
                                                      ? 'barangay-load-error'
                                                      : undefined
                                            }
                                            className={inputClass}
                                        >
                                            <option value="">
                                                {barangaysLoading
                                                    ? 'Loading barangays...'
                                                    : 'Select your barangay'}
                                            </option>
                                            {barangays.map((barangay) => (
                                                <option
                                                    key={barangay.code}
                                                    value={barangay.name}
                                                >
                                                    {barangay.name}
                                                </option>
                                            ))}
                                        </select>
                                        <FieldError message={errors.barangay} />
                                        {barangaysError && (
                                            <div
                                                id="barangay-load-error"
                                                className="mt-2 text-sm text-red-600"
                                                role="alert"
                                            >
                                                <p>{barangaysError}</p>
                                                <button
                                                    type="button"
                                                    onClick={retryBarangays}
                                                    className="mt-1 font-semibold underline"
                                                >
                                                    Try again
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="sitio"
                                            className={labelClass}
                                        >
                                            Sitio / Purok
                                        </label>
                                        <input
                                            id="sitio"
                                            name="sitio"
                                            type="text"
                                            value={data.sitio}
                                            onChange={(event) =>
                                                setData(
                                                    'sitio',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Enter your sitio or purok"
                                            required
                                            aria-invalid={Boolean(errors.sitio)}
                                            aria-describedby={
                                                errors.sitio
                                                    ? 'sitio-error'
                                                    : undefined
                                            }
                                            className={inputClass}
                                        />
                                        <FieldError message={errors.sitio} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 px-4 py-3 text-sm sm:grid-cols-2">
                                    <p>
                                        <span className="block text-xs text-slate-500">
                                            Municipality
                                        </span>
                                        <span className="font-medium text-slate-800">
                                            Pagudpud
                                        </span>
                                    </p>
                                    <p>
                                        <span className="block text-xs text-slate-500">
                                            Province
                                        </span>
                                        <span className="font-medium text-slate-800">
                                            Ilocos Norte
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className={labelClass}
                                >
                                    Password
                                </label>

                                <PasswordInput
                                    id="password"
                                    name="password"
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
                                            ? 'password-error password-requirements'
                                            : 'password-requirements'
                                    }
                                    className={inputClass}
                                />

                                <ul
                                    id="password-requirements"
                                    className="mt-2 space-y-1 text-xs"
                                    aria-label="Password requirements"
                                >
                                    <li
                                        className={
                                            passwordMeetsLengthRequirement
                                                ? 'text-blue-700'
                                                : 'text-slate-500'
                                        }
                                    >
                                        {passwordMeetsLengthRequirement
                                            ? '✓'
                                            : '•'}{' '}
                                        At least 8 characters
                                    </li>
                                    <li
                                        className={
                                            passwordsMatch
                                                ? 'text-blue-700'
                                                : 'text-slate-500'
                                        }
                                    >
                                        {passwordsMatch ? '✓' : '•'} Password
                                        confirmation must match
                                    </li>
                                </ul>

                                <FieldError
                                    id="password-error"
                                    message={errors.password}
                                />
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className={labelClass}
                                >
                                    Confirm password
                                </label>

                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
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
                                    id="confirmation-error"
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing
                                    ? 'Creating account...'
                                    : 'Create Citizen Account'}

                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-600">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-bold text-blue-800 hover:text-blue-950 hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>

                        <BackButton fallback="/" className="mt-8" />
                </section>
                <footer className="pt-5 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} Pagudpud Transparency
                </footer>
            </main>
        </div>
    );
}
