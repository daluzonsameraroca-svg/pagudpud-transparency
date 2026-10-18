import { router } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default function Users({ users = [] }) {
    const updateRole = (user, role) => {
        if (role === user.role) return;

        router.put(
            `/admin/users/${user.id}`,
            { role },
            {
                preserveScroll: true,
            }
        );
    };

    const getRoleClass = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-50 text-purple-700 ring-purple-200';
            case 'engineering':
                return 'bg-blue-50 text-blue-700 ring-blue-200';
            case 'citizen':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
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
            description: 'All registered accounts',
            icon: '♙',
            color: 'text-emerald-700',
            iconBg: 'bg-emerald-50',
            border: 'border-l-emerald-500',
        },
        {
            label: 'Citizens',
            value: citizenCount,
            description: 'Public platform users',
            icon: '♧',
            color: 'text-emerald-700',
            iconBg: 'bg-emerald-50',
            border: 'border-l-emerald-500',
        },
        {
            label: 'Engineering',
            value: engineeringCount,
            description: 'Project status managers',
            icon: '▤',
            color: 'text-blue-700',
            iconBg: 'bg-blue-50',
            border: 'border-l-blue-500',
        },
        {
            label: 'Administrators',
            value: adminCount,
            description: 'System administrators',
            icon: '⚙',
            color: 'text-purple-700',
            iconBg: 'bg-purple-50',
            border: 'border-l-purple-500',
        },
    ];

    const systemRoles = [
        {
            role: 'Citizen',
            description:
                'Views public project information and submits feedback.',
            badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
            marker: 'bg-emerald-500',
        },
        {
            role: 'Municipal Engineering Office',
            description:
                'Manages project records and updates official project progress.',
            badge: 'bg-blue-50 text-blue-700 ring-blue-200',
            marker: 'bg-blue-500',
        },
        {
            role: 'Administrator',
            description:
                'Manages user accounts, administrative posts, projects, and feedback.',
            badge: 'bg-purple-50 text-purple-700 ring-purple-200',
            marker: 'bg-purple-500',
        },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-slate-50 font-sans">
                <header className="border-b border-emerald-100 bg-white px-5 py-6 sm:px-8">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                <span>Home</span>
                                <span className="text-slate-300">/</span>
                                <span>System Management</span>
                                <span className="text-slate-300">/</span>
                                <span className="font-medium text-emerald-700">
                                    User Accounts
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl text-emerald-700">
                                    ♙
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                                        User Accounts
                                    </h1>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Manage registered users and their system roles.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-3">
                            <p className="text-sm font-medium text-emerald-700">
                                Registered Accounts
                            </p>

                            <p className="mt-1 text-2xl font-bold text-emerald-800">
                                {users.length}
                                <span className="ml-2 text-sm font-medium">
                                    users
                                </span>
                            </p>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-slate-800">
                                User Overview
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Breakdown of registered accounts by assigned role.
                            </p>
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

                                    <p className="mt-2 text-sm text-slate-500">
                                        {card.description}
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

                                <p className="mt-1 text-sm text-slate-500">
                                    Review account details and change assigned system roles.
                                </p>
                            </div>

                            <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                {users.length} records
                            </span>
                        </div>

                        {users.length === 0 ? (
                            <div className="px-5 py-16 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl text-emerald-700">
                                    ♙
                                </div>

                                <h3 className="mt-4 text-lg font-semibold text-slate-800">
                                    No users found
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Registered accounts will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] text-left">
                                    <thead className="bg-emerald-50/70">
                                        <tr className="border-b border-emerald-100">
                                            {[
                                                'User Information',
                                                'Contact Number',
                                                'Address',
                                                'Current Role',
                                                'Change Role',
                                            ].map((heading) => (
                                                <th
                                                    key={heading}
                                                    className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-emerald-900"
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
                                                className="transition hover:bg-emerald-50/30"
                                            >
                                                <td className="px-5 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-base font-bold text-emerald-800 ring-1 ring-emerald-200">
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
                                                        className="w-full max-w-[210px] rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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

                                                    <p className="mt-2 text-xs text-slate-400">
                                                        Saves when changed
                                                    </p>
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

                                <p className="text-xs text-slate-500">
                                    Role changes are saved to the system.
                                </p>
                            </div>
                        )}
                    </section>

                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-slate-800">
                                System Roles
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Reference for the available account roles and their responsibilities.
                            </p>
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

                                            <p className="mt-4 text-sm leading-6 text-slate-600">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <footer className="border-t border-slate-200 pt-5 text-center text-sm text-slate-500">
                        <p className="font-medium text-emerald-800">
                            Pagudpud Transparency
                        </p>
                        <p className="mt-1">
                            Web-Based Local Government Project Monitoring System
                        </p>
                    </footer>
                </main>
            </div>
        </DashboardLayout>
    );
}
