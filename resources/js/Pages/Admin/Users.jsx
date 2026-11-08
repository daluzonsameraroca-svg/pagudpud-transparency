import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default function Users({ users = [] }) {
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [creationMessage, setCreationMessage] = useState('');
    const [pendingRoleChange, setPendingRoleChange] = useState(null);
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        engineering_permission: 'viewer',
    });

    const createEngineeringAccount = (event) => {
        event.preventDefault();
        setCreationMessage('');

        post('/admin/users', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsCreateFormOpen(false);
                setCreationMessage('Engineering account created successfully.');
            },
        });
    };

    const closeCreateForm = () => {
        reset();
        clearErrors();
        setCreationMessage('');
        setIsCreateFormOpen(false);
    };

    const updateRole = (user, role) => {
        if (role === user.role) return;

        setPendingRoleChange({ user, role });
    };

    const confirmRoleChange = () => {
        if (!pendingRoleChange) return;

        const { user, role } = pendingRoleChange;
        setPendingRoleChange(null);
        router.put(
            `/admin/users/${user.id}`,
            { role },
            {
                preserveScroll: true,
            }
        );
    };

    const updateEngineeringPermission = (user, engineeringPermission) => {
        if (engineeringPermission === user.engineering_permission) return;

        router.put(
            `/admin/users/${user.id}`,
            { engineering_permission: engineeringPermission },
            {
                preserveScroll: true,
            },
        );
    };

    const getRoleClass = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-50 text-purple-700 ring-purple-200';
            case 'engineering':
                return 'bg-blue-50 text-blue-700 ring-blue-200';
            case 'citizen':
                return 'bg-blue-50 text-blue-700 ring-blue-200';
            default:
                return 'bg-gray-100 text-gray-600 ring-gray-200';
        }
    };

    const getRoleName = (role) => {
        switch (role) {
            case 'admin':
                return 'Administrator';
            case 'engineering':
                return 'Municipal Engineering Office';
            case 'citizen':
                return 'Citizen';
            default:
                return role || 'Unknown';
        }
    };

    const citizenCount = users.filter(
        (user) => user.role === 'citizen'
    ).length;

    const engineeringCount = users.filter(
        (user) => user.role === 'engineering'
    ).length;

    const adminCount = users.filter(
        (user) => user.role === 'admin'
    ).length;

    const summaryCards = [
        {
            label: 'Total Users',
            value: users.length,
            icon: '♙',
            color: 'text-blue-700',
            iconBg: 'bg-blue-50',
            border: 'border-l-blue-500',
        },
        {
            label: 'Citizens',
            value: citizenCount,
            icon: '♧',
            color: 'text-blue-700',
            iconBg: 'bg-blue-50',
            border: 'border-l-blue-500',
        },
        {
            label: 'Engineering',
            value: engineeringCount,
            icon: '▤',
            color: 'text-blue-700',
            iconBg: 'bg-blue-50',
            border: 'border-l-blue-500',
        },
        {
            label: 'Administrators',
            value: adminCount,
            icon: '⚙',
            color: 'text-purple-700',
            iconBg: 'bg-purple-50',
            border: 'border-l-purple-500',
        },
    ];

    const systemRoles = [
        {
            role: 'Citizen',
            badge: 'bg-blue-50 text-blue-700 ring-blue-200',
            marker: 'bg-blue-500',
        },
        {
            role: 'Municipal Engineering Office',
            badge: 'bg-blue-50 text-blue-700 ring-blue-200',
            marker: 'bg-blue-500',
        },
        {
            role: 'Administrator',
            badge: 'bg-purple-50 text-purple-700 ring-purple-200',
            marker: 'bg-purple-500',
        },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-slate-50 font-sans">
                <header className="border-b border-blue-100 bg-white px-5 py-6 sm:px-8">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-700">
                                    ♙
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                                        User Accounts
                                    </h1>

                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-3">
                            <p className="text-sm font-medium text-blue-700">
                                Registered Accounts
                            </p>

                            <p className="mt-1 text-2xl font-bold text-blue-800">
                                {users.length}
                                <span className="ml-2 text-sm font-medium">
                                    users
                                </span>
                            </p>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
                    {creationMessage && (
                        <div
                            className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800"
                            role="status"
                        >
                            {creationMessage}
                        </div>
                    )}

                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-slate-800">
                                User Overview
                            </h2>

                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {summaryCards.map((card) => (
                                <div
                                    key={card.label}
                                    className={`rounded-xl border border-slate-200 border-l-4 ${card.border} bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-slate-600">
                                            {card.label}
                                        </p>

                                        <span
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${card.iconBg} ${card.color}`}
                                        >
                                            {card.icon}
                                        </span>
                                    </div>

                                    <p className={`mt-4 text-3xl font-bold ${card.color}`}>
                                        {card.value}
                                    </p>

                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-5 sm:px-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Registered Users
                                </h2>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 ring-1 ring-blue-200">
                                    {users.length} records
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCreationMessage('');
                                        setIsCreateFormOpen((isOpen) => !isOpen);
                                    }}
                                    aria-expanded={isCreateFormOpen}
                                    aria-controls="create-engineering-account"
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    <span aria-hidden="true">+</span>
                                    {isCreateFormOpen
                                        ? 'Close form'
                                        : 'Create Engineering Account'}
                                </button>
                            </div>
                        </div>

                        {isCreateFormOpen && (
                            <form
                                id="create-engineering-account"
                                onSubmit={createEngineeringAccount}
                                className="space-y-5 border-b border-slate-200 bg-slate-50 p-5 sm:p-6"
                            >
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        New Engineering Account
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        Choose whether this account can only
                                        view projects or can also create
                                        projects and post progress updates.
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="engineering-name"
                                            className="mb-1.5 block text-sm font-medium text-slate-700"
                                        >
                                            Full name
                                        </label>
                                        <input
                                            id="engineering-name"
                                            name="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(event) =>
                                                setData('name', event.target.value)
                                            }
                                            autoComplete="name"
                                            maxLength={255}
                                            required
                                            disabled={processing}
                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                                        />
                                        {errors.name && (
                                            <p className="mt-1.5 text-sm text-red-600" role="alert">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="engineering-email"
                                            className="mb-1.5 block text-sm font-medium text-slate-700"
                                        >
                                            Email address
                                        </label>
                                        <input
                                            id="engineering-email"
                                            name="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(event) =>
                                                setData('email', event.target.value)
                                            }
                                            autoComplete="email"
                                            maxLength={255}
                                            required
                                            disabled={processing}
                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                                        />
                                        {errors.email && (
                                            <p className="mt-1.5 text-sm text-red-600" role="alert">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="engineering-password"
                                            className="mb-1.5 block text-sm font-medium text-slate-700"
                                        >
                                            Initial password
                                        </label>
                                        <input
                                            id="engineering-password"
                                            name="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(event) =>
                                                setData('password', event.target.value)
                                            }
                                            autoComplete="new-password"
                                            minLength={8}
                                            required
                                            disabled={processing}
                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                                        />
                                        {errors.password && (
                                            <p className="mt-1.5 text-sm text-red-600" role="alert">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="engineering-password-confirmation"
                                            className="mb-1.5 block text-sm font-medium text-slate-700"
                                        >
                                            Confirm password
                                        </label>
                                        <input
                                            id="engineering-password-confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(event) =>
                                                setData(
                                                    'password_confirmation',
                                                    event.target.value,
                                                )
                                            }
                                            autoComplete="new-password"
                                            minLength={8}
                                            required
                                            disabled={processing}
                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                                        />
                                        {errors.password_confirmation && (
                                            <p className="mt-1.5 text-sm text-red-600" role="alert">
                                                {errors.password_confirmation}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="engineering-permission"
                                            className="mb-1.5 block text-sm font-medium text-slate-700"
                                        >
                                            Project access
                                        </label>
                                        <select
                                            id="engineering-permission"
                                            name="engineering_permission"
                                            value={data.engineering_permission}
                                            onChange={(event) =>
                                                setData(
                                                    'engineering_permission',
                                                    event.target.value,
                                                )
                                            }
                                            required
                                            disabled={processing}
                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                                        >
                                                <option value="viewer">
                                                Viewer — view all projects and
                                                feedback
                                            </option>
                                            <option value="editor">
                                                    Editor — view, create, and
                                                    update projects
                                                </option>
                                        </select>
                                        {errors.engineering_permission && (
                                            <p className="mt-1.5 text-sm text-red-600" role="alert">
                                                {errors.engineering_permission}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeCreateForm}
                                        disabled={processing}
                                        className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {processing
                                            ? 'Creating account...'
                                            : 'Create Engineering Account'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {users.length === 0 ? (
                            <div className="px-5 py-16 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl text-blue-700">
                                    ♙
                                </div>

                                <h3 className="mt-4 text-lg font-semibold text-slate-800">
                                    No users found
                                </h3>

                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1080px] text-left">
                                    <thead className="bg-blue-50/70">
                                        <tr className="border-b border-blue-100">
                                            {[
                                                'User Information',
                                                'Contact Number',
                                                'Address',
                                                'Current Role',
                                                'Change Role',
                                                'Engineering Project Access',
                                            ].map((heading) => (
                                                <th
                                                    key={heading}
                                                    className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-blue-900"
                                                >
                                                    {heading}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="transition hover:bg-blue-50/30"
                                            >
                                                <td className="px-5 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-bold text-blue-800 ring-1 ring-blue-200">
                                                            {(user.name || 'U')
                                                                .trim()
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="max-w-[230px] truncate text-sm font-semibold text-slate-800">
                                                                {user.name || 'Unnamed User'}
                                                            </p>

                                                            <p className="mt-1 max-w-[230px] truncate text-sm text-slate-500">
                                                                {user.email || 'No email provided'}
                                                            </p>

                                                            <p className="mt-1 text-xs text-slate-400">
                                                                User ID: {user.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-5 text-sm text-slate-600">
                                                    {user.phone_number || 'Not provided'}
                                                </td>

                                                <td className="max-w-[240px] px-5 py-5">
                                                    <p
                                                        className="truncate text-sm text-slate-600"
                                                        title={user.address || ''}
                                                    >
                                                        {user.address || 'Not provided'}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-5">
                                                    <span
                                                        className={`inline-flex rounded-lg px-3 py-2 text-xs font-semibold ring-1 ${getRoleClass(user.role)}`}
                                                    >
                                                        {getRoleName(user.role)}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-5">
                                                    <select
                                                        value={user.role || 'citizen'}
                                                        onChange={(event) =>
                                                            updateRole(
                                                                user,
                                                                event.target.value
                                                            )
                                                        }
                                                        aria-label={`Change role for ${user.name}`}
                                                        className="w-full max-w-[210px] rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                    >
                                                        <option value="citizen">
                                                            Citizen
                                                        </option>

                                                        <option value="engineering">
                                                            Municipal Engineering Office
                                                        </option>

                                                        <option value="admin">
                                                            Administrator
                                                        </option>
                                                    </select>

                                                </td>

                                                <td className="px-5 py-5">
                                                    {user.role === 'engineering' ? (
                                                        <select
                                                            value={user.engineering_permission || 'viewer'}
                                                            onChange={(event) =>
                                                                updateEngineeringPermission(
                                                                    user,
                                                                    event.target.value,
                                                                )
                                                            }
                                                            aria-label={`Change Engineering project access for ${user.name}`}
                                                            className="w-full max-w-[210px] rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                        >
                                                            <option value="viewer">
                                                                Viewer — view
                                                                only
                                                            </option>
                                                            <option value="editor">
                                                                Editor — view,
                                                                create, and update
                                                            </option>
                                                        </select>
                                                    ) : (
                                                        <span className="text-sm text-slate-400">
                                                            Not applicable
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {users.length > 0 && (
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
                                <p className="text-sm text-slate-600">
                                    Showing {users.length} registered account
                                    {users.length !== 1 ? 's' : ''}
                                </p>

                            </div>
                        )}
                    </section>

                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-slate-800">
                                System Roles
                            </h2>

                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {systemRoles.map((item) => (
                                <div
                                    key={item.role}
                                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex items-start gap-3">
                                        <span
                                            className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${item.marker}`}
                                        />

                                        <div className="min-w-0">
                                            <span
                                                className={`inline-flex rounded-lg px-3 py-2 text-sm font-semibold ring-1 ${item.badge}`}
                                            >
                                                {item.role}
                                            </span>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <footer className="border-t border-slate-200 pt-5 text-center text-sm text-slate-500">
                        <p className="font-medium text-blue-800">
                            Pagudpud Transparency
                        </p>
                        <p className="mt-1">
                            Web-Based Local Government Project Monitoring System
                        </p>
                    </footer>
                </main>
            </div>

            {pendingRoleChange && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setPendingRoleChange(null);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="change-role-title"
                        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl font-bold text-amber-700">
                            !
                        </div>

                        <h2
                            id="change-role-title"
                            className="mt-5 text-xl font-bold text-slate-900"
                        >
                            Confirm Role Change
                        </h2>

                        <p className="mt-3 break-words text-sm leading-7 text-slate-600">
                            Change{' '}
                            <span className="font-semibold text-slate-900">
                                {pendingRoleChange.user.name}
                            </span>
                            's role from{' '}
                            <span className="font-semibold text-slate-900">
                                {getRoleName(pendingRoleChange.user.role)}
                            </span>{' '}
                            to{' '}
                            <span className="font-semibold text-slate-900">
                                {getRoleName(pendingRoleChange.role)}
                            </span>
                            ?
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            Changing a role may change which parts of the system
                            this account can access.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setPendingRoleChange(null)}
                                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={confirmRoleChange}
                                className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Confirm Role Change
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
