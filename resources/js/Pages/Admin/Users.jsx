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
                return 'bg-purple-50 text-purple-700';
            case 'engineering':
                return 'bg-blue-50 text-blue-700';
            case 'citizen':
                return 'bg-green-50 text-green-700';
            default:
                return 'bg-gray-100 text-gray-600';
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
            color: 'text-[#315f91]',
            iconBg: 'bg-blue-50',
        },
        {
            label: 'Citizens',
            value: citizenCount,
            description: 'Public platform users',
            icon: '♧',
            color: 'text-green-700',
            iconBg: 'bg-green-50',
        },
        {
            label: 'Engineering',
            value: engineeringCount,
            description: 'Project status managers',
            icon: '▤',
            color: 'text-blue-700',
            iconBg: 'bg-blue-50',
        },
        {
            label: 'Administrators',
            value: adminCount,
            description: 'System administrators',
            icon: '⚙',
            color: 'text-purple-700',
            iconBg: 'bg-purple-50',
        },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-[#f4f6f9]">
                {/* Page header */}
                <header className="border-b border-[#e4e8ee] bg-white px-5 py-4 sm:px-7">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="mb-1 flex items-center gap-2 text-[11px] text-gray-400">
                                <span>Home</span>
                                <span>/</span>
                                <span>System Management</span>
                                <span>/</span>
                                <span className="text-[#315f91]">
                                    User Accounts
                                </span>
                            </div>

                            <h1 className="text-xl font-bold tracking-tight text-[#24364b]">
                                User Accounts
                            </h1>

                            <p className="mt-1 text-xs text-gray-500">
                                Manage registered users and their system roles.
                            </p>
                        </div>

                        <div className="rounded-md border border-[#e1e6ed] bg-[#f8fafc] px-3 py-2">
                            <p className="text-[10px] text-gray-500">
                                Registered Accounts
                            </p>
                            <p className="mt-0.5 text-sm font-semibold text-[#283b52]">
                                {users.length} users
                            </p>
                        </div>
                    </div>
                </header>

                <main className="space-y-5 p-4 sm:p-6">
                    {/* Summary cards */}
                    <section>
                        <div className="mb-3">
                            <h2 className="text-sm font-semibold text-[#283b52]">
                                User Overview
                            </h2>
                            <p className="mt-1 text-[11px] text-gray-500">
                                Breakdown of accounts by assigned role.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {summaryCards.map((card) => (
                                <div
                                    key={card.label}
                                    className="rounded-lg border border-[#e1e6ed] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-[11px] font-medium text-gray-500">
                                            {card.label}
                                        </p>

                                        <span
                                            className={`flex h-8 w-8 items-center justify-center rounded-md text-lg ${card.iconBg} ${card.color}`}
                                        >
                                            {card.icon}
                                        </span>
                                    </div>

                                    <p
                                        className={`mt-3 text-2xl font-bold ${card.color}`}
                                    >
                                        {card.value}
                                    </p>

                                    <p className="mt-1 text-[10px] text-gray-400">
                                        {card.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Registered users table */}
                    <section className="overflow-hidden rounded-lg border border-[#e1e6ed] bg-white">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8ecf1] px-4 py-4 sm:px-5">
                            <div>
                                <h2 className="text-sm font-semibold text-[#283b52]">
                                    Registered Users
                                </h2>

                                <p className="mt-1 text-[11px] text-gray-500">
                                    Review account details and change assigned
                                    system roles.
                                </p>
                            </div>

                            <span className="rounded-md bg-[#edf3f9] px-2.5 py-1.5 text-[10px] font-medium text-[#315f91]">
                                {users.length} records
                            </span>
                        </div>

                        {users.length === 0 ? (
                            <div className="px-5 py-14 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#edf3f9] text-2xl text-[#315f91]">
                                    ♙
                                </div>

                                <h3 className="mt-3 text-sm font-semibold text-[#283b52]">
                                    No users found
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Registered accounts will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[850px] text-left">
                                    <thead className="bg-[#f8fafc]">
                                        <tr className="border-b border-[#e8ecf1]">
                                            {[
                                                'User Information',
                                                'Contact Number',
                                                'Address',
                                                'Current Role',
                                                'Change Role',
                                            ].map((heading) => (
                                                <th
                                                    key={heading}
                                                    className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-500"
                                                >
                                                    {heading}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="transition hover:bg-[#fafbfd]"
                                            >
                                                {/* User information */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf3f9] text-xs font-semibold text-[#315f91]">
                                                            {(user.name || 'U')
                                                                .trim()
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="max-w-[220px] truncate text-xs font-semibold text-[#283b52]">
                                                                {user.name}
                                                            </p>

                                                            <p className="mt-1 max-w-[220px] truncate text-[11px] text-gray-500">
                                                                {user.email}
                                                            </p>

                                                            <p className="mt-1 text-[10px] text-gray-400">
                                                                User ID: {user.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact */}
                                                <td className="px-5 py-4 text-xs text-gray-600">
                                                    {user.phone_number ||
                                                        'Not provided'}
                                                </td>

                                                {/* Address */}
                                                <td className="max-w-[220px] px-5 py-4">
                                                    <p
                                                        className="truncate text-xs text-gray-600"
                                                        title={user.address || ''}
                                                    >
                                                        {user.address ||
                                                            'Not provided'}
                                                    </p>
                                                </td>

                                                {/* Current role */}
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${getRoleClass(
                                                            user.role
                                                        )}`}
                                                    >
                                                        {getRoleName(user.role)}
                                                    </span>
                                                </td>

                                                {/* Change role */}
                                                <td className="px-5 py-4">
                                                    <select
                                                        value={user.role || 'citizen'}
                                                        onChange={(event) =>
                                                            updateRole(
                                                                user,
                                                                event.target.value
                                                            )
                                                        }
                                                        aria-label={`Change role for ${user.name}`}
                                                        className="w-full max-w-[190px] rounded-md border border-[#d8dee7] bg-white px-2.5 py-2 text-xs text-[#283b52] outline-none transition focus:border-[#7898ba] focus:ring-2 focus:ring-[#dce8f4]"
                                                    >
                                                        <option value="citizen">
                                                            Citizen
                                                        </option>

                                                        <option value="engineering">
                                                            Municipal Engineering
                                                            Office
                                                        </option>

                                                        <option value="admin">
                                                            Administrator
                                                        </option>
                                                    </select>

                                                    <p className="mt-1.5 text-[10px] text-gray-400">
                                                        Saves when changed
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Table footer */}
                        {users.length > 0 && (
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#e8ecf1] bg-[#fbfcfd] px-5 py-3">
                                <p className="text-[10px] text-gray-500">
                                    Showing {users.length} registered account
                                    {users.length !== 1 ? 's' : ''}
                                </p>

                                <p className="text-[10px] text-gray-400">
                                    Role changes are saved to the system.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Role information */}
                    <section>
                        <div className="mb-3">
                            <h2 className="text-sm font-semibold text-[#283b52]">
                                System Roles
                            </h2>
                            <p className="mt-1 text-[11px] text-gray-500">
                                Reference for the available account roles.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            {[
                                {
                                    role: 'Citizen',
                                    description:
                                        'Views public project information and submits feedback.',
                                    badge: 'bg-green-50 text-green-700',
                                    marker: 'bg-green-500',
                                },
                                {
                                    role: 'Municipal Engineering Office',
                                    description:
                                        'Manages project records and updates official project progress.',
                                    badge: 'bg-blue-50 text-blue-700',
                                    marker: 'bg-blue-500',
                                },
                                {
                                    role: 'Administrator',
                                    description:
                                        'Manages user accounts, administrative posts, projects, and feedback.',
                                    badge: 'bg-purple-50 text-purple-700',
                                    marker: 'bg-purple-500',
                                },
                            ].map((item) => (
                                <div
                                    key={item.role}
                                    className="rounded-lg border border-[#e1e6ed] bg-white p-4"
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`h-2 w-2 rounded-full ${item.marker}`}
                                        />

                                        <span
                                            className={`rounded-md px-2 py-1 text-[10px] font-semibold ${item.badge}`}
                                        >
                                            {item.role}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-[11px] leading-5 text-gray-500">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="border-t border-[#e1e6ed] pt-4 text-center text-[10px] text-gray-400">
                        Pagudpud Transparency · Web-Based Local Government
                        Project Monitoring System
                    </footer>
                </main>
            </div>
        </DashboardLayout>
    );
}
