import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import usePagudpudBarangays from '../../Hooks/usePagudpudBarangays';

function parseAddress(address, barangays) {
    const parts = (address ?? '')
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.at(-1)?.toLowerCase() === 'ilocos norte') {
        parts.pop();

        if (parts.at(-1)?.toLowerCase() === 'pagudpud') {
            parts.pop();
        }
    }

    const barangayIndex = parts.findLastIndex((part) =>
        barangays.some(
            (barangay) =>
                barangay.name.toLowerCase() === part.toLowerCase(),
        ),
    );

    if (barangayIndex === -1) {
        return { sitio: parts.join(', '), barangay: '' };
    }

    return {
        sitio: parts.slice(0, barangayIndex).join(', '),
        barangay: parts[barangayIndex],
    };
}

function Field({ label, name, value, onChange, error, readOnly = false }) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-medium text-slate-700"
            >
                {label}
            </label>
            <input
                id={name}
                name={name}
                type="text"
                value={value ?? ''}
                onChange={onChange}
                readOnly={readOnly}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${
                    readOnly
                        ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                        : 'border-slate-300 bg-white text-slate-800'
                }`}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${name}-error` : undefined}
            />
            {error && (
                <p
                    id={`${name}-error`}
                    className="mt-1 text-sm text-red-600"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

export default function Show({ user }) {
    const { props } = usePage();
    const role = props.auth?.user?.role ?? 'citizen';
    const layoutRole = role === 'administrator' ? 'admin' : role;
    const {
        barangays,
        loading: barangaysLoading,
        error: barangaysError,
        retry: retryBarangays,
    } = usePagudpudBarangays({ enabled: layoutRole !== 'admin' });
    const [locationChanged, setLocationChanged] = useState(false);
    const [locationError, setLocationError] = useState('');
    const { data, setData, put, processing, errors, recentlySuccessful } =
        useForm({
            name: user.name ?? '',
            phone_number: user.phone_number ?? '',
            address: user.address ?? '',
            sitio: '',
            barangay: '',
        });

    useEffect(() => {
        if (barangays.length > 0) {
            const location = parseAddress(user.address, barangays);
            setData('sitio', location.sitio);
            setData('barangay', location.barangay);
        }
    }, [barangays, user.address, setData]);

    const updateField = (event) => {
        setData(event.target.name, event.target.value);
    };

    const updateLocation = (event) => {
        const { name, value } = event.target;
        const nextLocation = { ...data, [name]: value };
        const hasSitio = Boolean(nextLocation.sitio.trim());
        const hasBarangay = Boolean(nextLocation.barangay);

        setLocationChanged(true);
        setLocationError('');
        setData({
            ...nextLocation,
            address:
                hasSitio && hasBarangay
                    ? `${nextLocation.sitio.trim()}, ${nextLocation.barangay}, Pagudpud, Ilocos Norte`
                    : !hasSitio && !hasBarangay
                      ? ''
                      : nextLocation.address,
        });
    };

    const submit = (event) => {
        event.preventDefault();

        if (
            locationChanged &&
            Boolean(data.sitio.trim()) !== Boolean(data.barangay)
        ) {
            setLocationError(
                'Enter both a sitio or purok and barangay, or clear both fields.',
            );

            return;
        }

        put('/profile', { preserveScroll: true });
    };

    return (
        <DashboardLayout role={layoutRole}>
            <Head title="My Profile" />

            <div className="min-h-screen bg-slate-50">
                <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                        Account
                    </p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                        My Profile
                    </h1>
                </header>

                <main className="mx-auto max-w-3xl space-y-5 p-5 sm:p-7">
                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center gap-4 border-b border-slate-100 bg-emerald-50/60 px-5 py-5 sm:px-7">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-lg font-bold text-white">
                                {(user.name || 'User')
                                    .trim()
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <h2 className="truncate text-lg font-semibold text-slate-900">
                                    {user.name}
                                </h2>
                            </div>
                        </div>

                        <form
                            onSubmit={submit}
                            className="space-y-5 p-5 sm:p-7"
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field
                                    label="Full name"
                                    name="name"
                                    value={data.name}
                                    onChange={updateField}
                                    error={errors.name}
                                />
                                <Field
                                    label="Email address"
                                    name="email"
                                    value={user.email}
                                    readOnly
                                />
                                <Field
                                    label="Phone number"
                                    name="phone_number"
                                    value={data.phone_number}
                                    onChange={updateField}
                                    error={errors.phone_number}
                                />
                            </div>

                            {layoutRole !== 'admin' && (
                                <div className="space-y-4">
                                        <label
                                            htmlFor="sitio"
                                            className="block text-sm font-medium text-slate-700"
                                        >
                                            Address
                                        </label>
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="sitio"
                                                    className="mb-2 block text-sm font-medium text-slate-700"
                                                >
                                                    Sitio / Purok
                                                </label>
                                                <input
                                                    id="sitio"
                                                    name="sitio"
                                                    type="text"
                                                    value={data.sitio}
                                                    onChange={updateLocation}
                                                    disabled={
                                                        barangaysLoading ||
                                                        Boolean(barangaysError)
                                                    }
                                                    placeholder="Enter your sitio or purok"
                                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="barangay"
                                                    className="mb-2 block text-sm font-medium text-slate-700"
                                                >
                                                    Barangay
                                                </label>
                                                <select
                                                    id="barangay"
                                                    name="barangay"
                                                    value={data.barangay}
                                                    onChange={updateLocation}
                                                    disabled={
                                                        barangaysLoading ||
                                                        Boolean(barangaysError)
                                                    }
                                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
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
                                            </div>
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <Field
                                                label="Municipality"
                                                name="municipality"
                                                value="Pagudpud"
                                                readOnly
                                            />
                                            <Field
                                                label="Province"
                                                name="province"
                                                value="Ilocos Norte"
                                                readOnly
                                            />
                                        </div>

                                        {barangaysError && (
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-red-600">
                                                <p role="alert">
                                                    {barangaysError}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={retryBarangays}
                                                    className="font-semibold text-emerald-800 hover:text-emerald-950 hover:underline"
                                                >
                                                    Try again
                                                </button>
                                            </div>
                                        )}

                                        {(locationError || errors.address) && (
                                            <p
                                                id="address-error"
                                                className="mt-1 text-sm text-red-600"
                                                role="alert"
                                            >
                                                {locationError || errors.address}
                                            </p>
                                        )}
                                </div>
                            )}

                            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
                                {recentlySuccessful && (
                                    <p
                                        role="status"
                                        className="mr-auto text-sm font-medium text-emerald-700"
                                    >
                                        Profile updated.
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? 'Saving...' : 'Save changes'}
                                </button>
                            </div>
                        </form>
                    </section>
                </main>
            </div>
        </DashboardLayout>
    );
}
