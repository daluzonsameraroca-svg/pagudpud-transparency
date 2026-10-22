import { Link, router, usePage, usePoll } from '@inertiajs/react';
import { useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';

import DashboardLayout from '../../Layouts/DashboardLayout';

const COLORS = {
    Ongoing: '#059669',
    Completed: '#047857',
    Planned: '#d97706',
    Suspended: '#dc2626',
};

function Icon({ name, className = 'h-4 w-4' }) {
    const paths = {
        bell: (
            <>
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M10 21h4" />
            </>
        ),
        projects: (
            <>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M3 9h18M8 4v5M16 4v5" />
            </>
        ),
        ongoing: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </>
        ),
        completed: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12 2.5 2.5L16 9" />
            </>
        ),
        planned: (
            <>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18" />
            </>
        ),
        search: (
            <>
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 4 4" />
            </>
        ),
        arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
        message: (
            <path d="M21 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 2v-6a7.5 7.5 0 1 1 18-3.5Z" />
        ),
        announcement: (
            <>
                <path d="m3 11 18-5v12L3 13v-2Z" />
                <path d="m7 14 2 6h4l-2-5M21 10v4" />
            </>
        ),
        chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
    };

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {paths[name] || paths.projects}
        </svg>
    );
}

function StatCard({ label, value, icon, color, note }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-medium text-slate-500">
                        {label}
                    </p>
                    <p className="mt-1.5 text-[25px] font-semibold leading-7 tracking-tight text-slate-800">
                        {value}
                    </p>
                    {note && (
                        <p className="mt-1.5 text-[10px] text-slate-400">
                            {note}
                        </p>
                    )}
                </div>

                <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${color}18`, color }}
                >
                    <Icon name={icon} className="h-4 w-4" />
                </div>
            </div>
        </div>
    );
}

function SectionTitle({ title, description, action }) {
    return (
        <div className="mb-3 flex items-start justify-between gap-3">
            <div>
                <h2 className="text-[13px] font-semibold text-slate-800">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                        {description}
                    </p>
                )}
            </div>
            {action}
        </div>
    );
}

function StatusBadge({ status }) {
    const classes = {
        Ongoing: 'bg-emerald-50 text-emerald-700',
        Completed: 'bg-green-50 text-green-700',
        Planned: 'bg-amber-50 text-amber-700',
        Suspended: 'bg-red-50 text-red-700',
    };

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-medium ${
                classes[status] || 'bg-slate-100 text-slate-600'
            }`}
        >
            {status || 'Unknown'}
        </span>
    );
}

export default function Dashboard({
    projects = [],
    notifications = [],
    unreadNotificationCount = 0,
}) {
    usePoll(30000, {
        only: ['notifications', 'unreadNotificationCount'],
    });

    const { props } = usePage();
    const user = props.auth?.user;
    const [notificationsOpen, setNotificationsOpen] = useState(false);

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

    const totalProjects = projects.length;

    const ongoingProjects = projects.filter(
        (project) => project.status === 'Ongoing'
    ).length;

    const completedProjects = projects.filter(
        (project) => project.status === 'Completed'
    ).length;

    const averageProgress =
        totalProjects > 0
            ? Math.round(
                  projects.reduce(
                      (total, project) =>
                          total + Number(project.progress || 0),
                      0
                  ) / totalProjects
              )
            : 0;

    const statusData = [
        {
            name: 'Ongoing',
            value: ongoingProjects,
        },
        {
            name: 'Completed',
            value: completedProjects,
        },
        {
            name: 'Planned',
            value: projects.filter(
                (project) => project.status === 'Planned'
            ).length,
        },
        {
            name: 'Suspended',
            value: projects.filter(
                (project) => project.status === 'Suspended'
            ).length,
        },
    ].filter((item) => item.value > 0);

    const progressData = projects.map((project) => ({
        name: project.project_name || 'Untitled Project',
        progress: Math.min(
            100,
            Math.max(0, Number(project.progress || 0))
        ),
    }));

    const recentProjects = projects.slice(0, 5);

    const formatBudget = (budget) =>
        budget == null
            ? '—'
            : Number(budget).toLocaleString('en-PH', {
                  style: 'currency',
                  currency: 'PHP',
                  maximumFractionDigits: 0,
              });

    return (
        <DashboardLayout role="citizen">
            <div className="min-h-screen bg-slate-50">
                <header className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-7">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span>Pagudpud Transparency</span>
                        <span>/</span>
                        <span className="font-medium text-emerald-800">
                            Dashboard
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <button
                                type="button"
                                aria-label={`Notifications${unreadNotificationCount ? `, ${unreadNotificationCount} unread` : ''}`}
                                aria-controls="citizen-notifications-menu"
                                aria-expanded={notificationsOpen}
                                onClick={() =>
                                    setNotificationsOpen((open) => !open)
                                }
                                className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
                            >
                                <Icon name="bell" />
                                {unreadNotificationCount > 0 && (
                                    <span
                                        aria-label={`${unreadNotificationCount} unread notifications`}
                                        className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-600"
                                    />
                                )}
                            </button>

                            {notificationsOpen && (
                                <section
                                    id="citizen-notifications-menu"
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
                                            {notifications.map(
                                                (notification) => (
                                                    <li
                                                        key={notification.id}
                                                        className={`px-4 py-3 ${
                                                            notification.read_at
                                                                ? 'bg-white'
                                                                : 'bg-emerald-50/60'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <Link
                                                                    href={
                                                                        notification
                                                                            .data
                                                                            .url ??
                                                                        `/citizen/projects/${notification.data.project_id}`
                                                                    }
                                                                    onClick={(event) =>
                                                                        openNotification(
                                                                        event,
                                                                        notification,
                                                                        )
                                                                    }
                                                                    className="text-sm font-medium text-slate-800 hover:text-emerald-700"
                                                                >
                                                                    {notification.data.title ??
                                                                        notification
                                                                            .data
                                                                            .project_name}
                                                                </Link>
                                                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                                                    {notification.data.message}
                                                                </p>
                                                                {notification.data.details && (
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
                                                                    className="shrink-0 text-[10px] font-medium text-emerald-700 hover:text-emerald-900"
                                                                >
                                                                    Mark read
                                                                </button>
                                                            )}
                                                        </div>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    )}
                                </section>
                            )}
                        </div>

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-800">
                            {(user?.name || 'Citizen')
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="space-y-5 px-5 py-5 sm:px-7">
                    <section>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-[19px] font-semibold tracking-tight text-slate-800">
                                Citizen Dashboard
                            </h1>

                            
                        </div>

                        <p className="mt-1 text-[11px] text-slate-500">
                            Monitor local government projects and stay informed
                            about project progress.
                        </p>

                        
                    </section>

                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            label="Total Projects"
                            value={totalProjects}
                            icon="projects"
                            color="#059669"
                            note="Projects in the register"
                        />

                        <StatCard
                            label="Ongoing Projects"
                            value={ongoingProjects}
                            icon="ongoing"
                            color="#059669"
                            note="Currently in implementation"
                        />

                        <StatCard
                            label="Completed Projects"
                            value={completedProjects}
                            icon="completed"
                            color="#047857"
                            note="Marked as completed"
                        />

                        <StatCard
                            label="Average Progress"
                            value={`${averageProgress}%`}
                            icon="chart"
                            color="#d97706"
                            note="Across all listed projects"
                        />
                    </section>

                    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <SectionTitle
                                title="Project Status"
                                description="Distribution of current project statuses"
                            />

                            <div className="h-[220px]">
                                {statusData.length > 0 ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="46%"
                                                innerRadius={49}
                                                outerRadius={72}
                                                paddingAngle={3}
                                            >
                                                {statusData.map((entry) => (
                                                    <Cell
                                                        key={entry.name}
                                                        fill={COLORS[entry.name]}
                                                        stroke="none"
                                                    />
                                                ))}
                                            </Pie>

                                            <Tooltip
                                                contentStyle={{
                                                    fontSize: 11,
                                                    borderRadius: 8,
                                                    borderColor: '#e2e8f0',
                                                }}
                                            />

                                            <Legend
                                                verticalAlign="bottom"
                                                iconType="circle"
                                                iconSize={7}
                                                wrapperStyle={{
                                                    fontSize: 10,
                                                    color: '#64748b',
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-[11px] text-slate-500">
                                        No project data available.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <SectionTitle
                                title="Project Progress"
                                description="Current progress of local government projects"
                            />

                            <div className="h-[220px]">
                                {progressData.length > 0 ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={progressData}
                                            margin={{
                                                top: 8,
                                                right: 8,
                                                left: -15,
                                                bottom: 38,
                                            }}
                                        >
                                            <CartesianGrid
                                                stroke="#e2e8f0"
                                                strokeDasharray="3 3"
                                                vertical={false}
                                            />

                                            <XAxis
                                                dataKey="name"
                                                tick={{
                                                    fontSize: 9,
                                                    fill: '#64748b',
                                                }}
                                                angle={-22}
                                                textAnchor="end"
                                                interval={0}
                                                axisLine={false}
                                                tickLine={false}
                                            />

                                            <YAxis
                                                domain={[0, 100]}
                                                tickFormatter={(value) =>
                                                    `${value}%`
                                                }
                                                tick={{
                                                    fontSize: 9,
                                                    fill: '#64748b',
                                                }}
                                                axisLine={false}
                                                tickLine={false}
                                            />

                                            <Tooltip
                                                formatter={(value) => [
                                                    `${value}%`,
                                                    'Progress',
                                                ]}
                                                contentStyle={{
                                                    fontSize: 11,
                                                    borderRadius: 8,
                                                    borderColor: '#e2e8f0',
                                                }}
                                            />

                                            <Bar
                                                dataKey="progress"
                                                name="Progress"
                                                fill="#059669"
                                                maxBarSize={34}
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-[11px] text-slate-500">
                                        No project data available.
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                            <div>
                                <h2 className="text-[13px] font-semibold text-slate-800">
                                    Recent Projects
                                </h2>
                                <p className="mt-1 text-[10px] text-slate-500">
                                    Recently added government projects
                                </p>
                            </div>

                            <Link
                                href="/citizen/projects"
                                className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 hover:text-emerald-900"
                            >
                                View all
                                <Icon name="arrow" className="h-3 w-3" />
                            </Link>
                        </div>

                        {recentProjects.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[650px] text-left">
                                    <thead className="bg-slate-50">
                                        <tr className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                                            <th className="px-4 py-2.5">
                                                Project
                                            </th>
                                            <th className="px-4 py-2.5">
                                                Budget
                                            </th>
                                            <th className="px-4 py-2.5">
                                                Status
                                            </th>
                                            <th className="px-4 py-2.5">
                                                Progress
                                            </th>
                                            <th className="px-4 py-2.5">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {recentProjects.map((project) => {
                                            const progress = Math.min(
                                                100,
                                                Math.max(
                                                    0,
                                                    Number(project.progress || 0)
                                                )
                                            );

                                            return (
                                                <tr
                                                    key={project.id}
                                                    className="transition hover:bg-emerald-50/40"
                                                >
                                                    <td className="px-4 py-3">
                                                        <p className="max-w-[220px] truncate text-[11px] font-medium text-slate-700">
                                                            {project.project_name ||
                                                                'Untitled Project'}
                                                        </p>

                                                        <p className="mt-1 text-[10px] text-slate-500">
                                                            {project.location ||
                                                                'Location not provided'}
                                                        </p>
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-3 text-[10px] text-slate-600">
                                                        {formatBudget(
                                                            project.budget
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <StatusBadge
                                                            status={project.status}
                                                        />
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <div className="w-24">
                                                            <div className="mb-1 flex justify-between text-[9px] text-slate-500">
                                                                <span>
                                                                    Progress
                                                                </span>
                                                                <span>
                                                                    {progress}%
                                                                </span>
                                                            </div>

                                                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                                                <div
                                                                    className="h-full rounded-full bg-emerald-600"
                                                                    style={{
                                                                        width: `${progress}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <Link
                                                            href={`/citizen/projects/${project.id}`}
                                                            className="whitespace-nowrap text-[10px] font-medium text-emerald-700 hover:text-emerald-900 hover:underline"
                                                        >
                                                            View details
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-4 py-10 text-center text-[11px] text-slate-500">
                                No projects available.
                            </div>
                        )}
                    </section>

                    <section>
                        <SectionTitle
                            title="Quick Actions"
                            description="Quick access to common citizen activities"
                        />

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <Link
                                href="/citizen/projects"
                                className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3.5 transition hover:border-emerald-300 hover:shadow-sm"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                                    <Icon name="search" />
                                </div>

                                <div>
                                    <h3 className="text-[11px] font-semibold text-slate-700 group-hover:text-emerald-800">
                                        Browse Projects
                                    </h3>
                                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                                        Search and view local government
                                        projects.
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/citizen/posts"
                                className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3.5 transition hover:border-emerald-300 hover:shadow-sm"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                                    <Icon name="announcement" />
                                </div>

                                <div>
                                    <h3 className="text-[11px] font-semibold text-slate-700 group-hover:text-emerald-800">
                                        Administrative Posts
                                    </h3>
                                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                                        Read official announcements and
                                        updates.
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/citizen/feedback"
                                className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3.5 transition hover:border-emerald-300 hover:shadow-sm"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                                    <Icon name="message" />
                                </div>

                                <div>
                                    <h3 className="text-[11px] font-semibold text-slate-700 group-hover:text-emerald-800">
                                        Submit Feedback
                                    </h3>
                                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                                        Share feedback about a project.
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </section>

                    <footer className="border-t border-slate-200 pt-3 text-[9px] leading-4 text-slate-400">
                        <div className="flex flex-col justify-between gap-1 sm:flex-row">
                            <span>
                                Pagudpud Transparency · Municipality of
                                Pagudpud, Ilocos Norte
                            </span>

                            <span>
                                Demonstration data · Official updates are
                                maintained by the Engineering Office
                            </span>
                        </div>
                    </footer>
                </main>
            </div>
        </DashboardLayout>
    );
}
