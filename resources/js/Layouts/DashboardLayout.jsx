
import { Link, router, usePage, usePoll } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar';

function BellIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
        </svg>
    );
}

function DashboardTopbar({ role }) {
    const { props } = usePage();
    const user = props.auth?.user;
    const notifications = props.notifications ?? [];
    const unreadNotificationCount = props.unreadNotificationCount ?? 0;
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    usePoll(30000, {
        only: ['notifications', 'unreadNotificationCount'],
    }, {
        autoStart: role === 'citizen',
    });

    const openNotification = (event, notification) => {
        event.preventDefault();

        const destination =
            notification.data.url ??
            `/citizen/projects/${notification.data.project_id}`;

        setNotificationsOpen(false);

        if (notification.read_at) {
            router.visit(destination);

            return;
        }

        router.patch(
            `/citizen/notifications/${notification.id}/read`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => router.visit(destination),
            },
        );
    };

    return (
        <header className="sticky top-0 z-30 flex min-h-12 items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 pl-16 sm:px-7">
            <div className="flex min-w-0 items-center">
                <span className="hidden min-w-0 truncate text-xs font-semibold tracking-tight text-blue-900 min-[480px]:block">
                    Pagudpud Transparency
                </span>
            </div>

            <div className="flex items-center gap-3">
                {role === 'citizen' && (
                    <div className="relative">
                        <button
                            type="button"
                            aria-label={`Notifications${unreadNotificationCount ? `, ${unreadNotificationCount} unread` : ''}`}
                            aria-controls="dashboard-notifications-menu"
                            aria-expanded={notificationsOpen}
                            onClick={() =>
                                setNotificationsOpen((open) => !open)
                            }
                            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <BellIcon />
                            {unreadNotificationCount > 0 && (
                                <span
                                    aria-label={`${unreadNotificationCount} unread notifications`}
                                    className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-600"
                                />
                            )}
                        </button>

                        {notificationsOpen && (
                            <section
                                id="dashboard-notifications-menu"
                                aria-label="Recent notifications"
                                className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
                            >
                                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                                    <h2 className="text-sm font-semibold text-slate-800">
                                        Notifications
                                    </h2>
                                    <span className="text-xs text-slate-500">
                                        {unreadNotificationCount} unread
                                    </span>
                                </div>

                                {notifications.length === 0 ? (
                                    <p className="px-4 py-6 text-center text-sm text-slate-500">
                                        You're all caught up.
                                    </p>
                                ) : (
                                    <ul className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <li
                                                key={notification.id}
                                                className={`px-4 py-3 ${
                                                    notification.read_at
                                                        ? 'bg-white'
                                                        : 'bg-blue-50/60'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <Link
                                                            href={
                                                                notification
                                                                    .data.url ??
                                                                `/citizen/projects/${notification.data.project_id}`
                                                            }
                                                            onClick={(event) =>
                                                                openNotification(
                                                                    event,
                                                                    notification,
                                                                )
                                                            }
                                                            className="text-sm font-medium text-slate-800 hover:text-blue-700"
                                                        >
                                                            {notification.data.title ??
                                                                notification
                                                                    .data
                                                                    .project_name}
                                                        </Link>
                                                        <p className="mt-1 text-xs leading-5 text-slate-600">
                                                            {
                                                                notification
                                                                    .data
                                                                    .message
                                                            }
                                                        </p>
                                                        {notification.data
                                                            .details && (
                                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                                {
                                                                    notification
                                                                        .data
                                                                        .details
                                                                }
                                                            </p>
                                                        )}
                                                        <time
                                                            dateTime={
                                                                notification.created_at
                                                            }
                                                            className="mt-1 block text-[10px] text-slate-400"
                                                        >
                                                            {new Date(
                                                                notification.created_at,
                                                            ).toLocaleString()}
                                                        </time>
                                                    </div>

                                                    {!notification.read_at && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                router.patch(
                                                                    `/citizen/notifications/${notification.id}/read`,
                                                                    {},
                                                                    {
                                                                        preserveScroll: true,
                                                                        preserveState: true,
                                                                    },
                                                                )
                                                            }
                                                            className="shrink-0 text-[10px] font-medium text-blue-700 hover:text-blue-900"
                                                        >
                                                            Mark read
                                                        </button>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        )}
                    </div>
                )}

                <Link
                    href="/profile"
                    aria-label="View your profile"
                    title="View profile"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-800 transition hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {(user?.name || 'User').trim().charAt(0).toUpperCase()}
                </Link>
            </div>
        </header>
    );
}

export default function DashboardLayout({ children, role }) {
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return window.localStorage.getItem('dashboard-sidebar-collapsed') === 'true';
    });

    useEffect(() => {
        window.localStorage.setItem(
            'dashboard-sidebar-collapsed',
            String(isDesktopCollapsed),
        );
    }, [isDesktopCollapsed]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Sidebar
                role={role}
                isDesktopCollapsed={isDesktopCollapsed}
                setIsDesktopCollapsed={setIsDesktopCollapsed}
            />

            <main
                className={`min-h-screen w-full transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    isDesktopCollapsed ? 'lg:pl-20' : 'lg:pl-64'
                }`}
            >
                <div className="mx-auto min-h-screen w-full max-w-[1800px]">
                    <DashboardTopbar role={role} />
                    {children}
                </div>
            </main>
        </div>
    );
}
