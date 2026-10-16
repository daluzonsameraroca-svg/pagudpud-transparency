import { Link } from '@inertiajs/react';
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

export default function Dashboard({
    projects = [],
    totalUsers = 0,
    totalFeedback = 0,
    totalPosts = 0,
}) {
    const totalProjects = projects.length;

    const ongoingProjects = projects.filter(
        (project) => project.status === 'Ongoing'
    ).length;

    const completedProjects = projects.filter(
        (project) => project.status === 'Completed'
    ).length;

    const plannedProjects = projects.filter(
        (project) => project.status === 'Planned'
    ).length;

    const suspendedProjects = projects.filter(
        (project) => project.status === 'Suspended'
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
        { name: 'Ongoing', value: ongoingProjects },
        { name: 'Completed', value: completedProjects },
        { name: 'Planned', value: plannedProjects },
        { name: 'Suspended', value: suspendedProjects },
    ].filter((item) => item.value > 0);

    const chartColors = {
        Ongoing: '#3974c6',
        Completed: '#31936a',
        Planned: '#d6a13d',
        Suspended: '#d45d5d',
    };

    const progressData = projects.map((project) => {
        const name = project.project_name || 'Untitled Project';

        return {
            name:
                name.length > 19
                    ? `${name.substring(0, 19)}...`
                    : name,
            progress: Math.min(
                100,
                Math.max(0, Number(project.progress || 0))
            ),
        };
    });

    const recentProjects = projects.slice(0, 5);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-50 text-green-700';
            case 'Ongoing':
                return 'bg-blue-50 text-blue-700';
            case 'Planned':
                return 'bg-amber-50 text-amber-700';
            case 'Suspended':
                return 'bg-red-50 text-red-700';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const statCards = [
        {
            label: 'Total Users',
            value: totalUsers,
            note: 'Registered accounts',
            icon: '♙',
            color: 'text-[#315f91]',
            iconBg: 'bg-blue-50',
        },
        {
            label: 'Total Projects',
            value: totalProjects,
            note: 'Recorded projects',
            icon: '▤',
            color: 'text-[#315f91]',
            iconBg: 'bg-blue-50',
        },
        {
            label: 'Citizen Feedback',
            value: totalFeedback,
            note: 'Submitted feedback',
            icon: '☷',
            color: 'text-[#8061a7]',
            iconBg: 'bg-purple-50',
        },
        {
            label: 'Administrative Posts',
            value: totalPosts,
            note: 'Published records',
            icon: '▧',
            color: 'text-[#b77936]',
            iconBg: 'bg-orange-50',
        },
        {
            label: 'Average Progress',
            value: `${averageProgress}%`,
            note: 'Across all projects',
            icon: '↗',
            color: 'text-[#27835c]',
            iconBg: 'bg-green-50',
        },
    ];

    const managementLinks = [
        {
            title: 'Manage Users',
            description: 'Manage system accounts and user roles.',
            href: '/admin/users',
            icon: '♙',
        },
        {
            title: 'Manage Projects',
            description: 'Maintain official project information.',
            href: '/admin/projects',
            icon: '▤',
        },
        {
            title: 'Administrative Posts',
            description: 'Publish and manage announcements.',
            href: '/admin/posts',
            icon: '▧',
        },
        {
            title: 'Citizen Feedback',
            description: 'Review feedback submitted by citizens.',
            href: '/admin/feedback',
            icon: '☷',
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
                                <span className="text-[#315f91]">
                                    Dashboard
                                </span>
                            </div>

                            <h1 className="text-xl font-bold tracking-tight text-[#24364b]">
                                Administrator Dashboard
                            </h1>

                            <p className="mt-1 text-xs text-gray-500">
                                Overview of users, projects, posts, and citizen
                                feedback.
                            </p>
                        </div>

                        <Link
                            href="/admin/projects"
                            className="inline-flex items-center gap-2 rounded-md bg-[#25476b] px-3.5 py-2 text-xs font-medium text-white transition hover:bg-[#1b3653]"
                        >
                            <span className="text-base leading-none">+</span>
                            View Projects
                        </Link>
                    </div>
                </header>

                <main className="space-y-5 p-4 sm:p-6">
                    {/* Statistics */}
                    <section>
                        <div className="mb-3">
                            <h2 className="text-sm font-semibold text-[#283b52]">
                                System Overview
                            </h2>
                            <p className="mt-1 text-[11px] text-gray-500">
                                Summary of the current system records.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                            {statCards.map((card) => (
                                <div
                                    key={card.label}
                                    className="rounded-lg border border-[#e1e6ed] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-[11px] font-medium text-gray-500">
                                            {card.label}
                                        </p>

                                        <span
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-lg ${card.iconBg} ${card.color}`}
                                        >
                                            {card.icon}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-2xl font-bold tracking-tight text-[#25384e]">
                                        {card.value}
                                    </p>

                                    <p className="mt-1 text-[10px] text-gray-400">
                                        {card.note}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Project status summary */}
                    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {[
                            {
                                label: 'Ongoing Projects',
                                value: ongoingProjects,
                                color: 'bg-blue-500',
                                text: 'text-blue-700',
                                bg: 'bg-blue-50',
                            },
                            {
                                label: 'Completed Projects',
                                value: completedProjects,
                                color: 'bg-green-500',
                                text: 'text-green-700',
                                bg: 'bg-green-50',
                            },
                            {
                                label: 'Planned Projects',
                                value: plannedProjects,
                                color: 'bg-amber-500',
                                text: 'text-amber-700',
                                bg: 'bg-amber-50',
                            },
                            {
                                label: 'Suspended Projects',
                                value: suspendedProjects,
                                color: 'bg-red-500',
                                text: 'text-red-700',
                                bg: 'bg-red-50',
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-3 rounded-lg border border-[#e1e6ed] bg-white p-3.5"
                            >
                                <span
                                    className={`h-9 w-1 rounded-full ${item.color}`}
                                />

                                <div>
                                    <p className="text-[10px] text-gray-500">
                                        {item.label}
                                    </p>
                                    <p
                                        className={`mt-1 text-lg font-bold ${item.text}`}
                                    >
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Charts */}
                    <section>
                        <div className="mb-3">
                            <h2 className="text-sm font-semibold text-[#283b52]">
                                Project Analytics
                            </h2>
                            <p className="mt-1 text-[11px] text-gray-500">
                                Visual summaries of project status and
                                implementation progress.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                            {/* Project status chart */}
                            <div className="rounded-lg border border-[#e1e6ed] bg-white p-4">
                                <div className="border-b border-gray-100 pb-3">
                                    <h3 className="text-sm font-semibold text-[#283b52]">
                                        Project Status
                                    </h3>
                                    <p className="mt-1 text-[11px] text-gray-500">
                                        Distribution of recorded projects.
                                    </p>
                                </div>

                                <div className="mt-3 h-[250px]">
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
                                                    cy="45%"
                                                    innerRadius={48}
                                                    outerRadius={76}
                                                    paddingAngle={3}
                                                >
                                                    {statusData.map((entry) => (
                                                        <Cell
                                                            key={entry.name}
                                                            fill={
                                                                chartColors[
                                                                    entry.name
                                                                ]
                                                            }
                                                            stroke="none"
                                                        />
                                                    ))}
                                                </Pie>

                                                <Tooltip
                                                    contentStyle={{
                                                        borderRadius: '6px',
                                                        border: '1px solid #e1e6ed',
                                                        fontSize: '12px',
                                                    }}
                                                />

                                                <Legend
                                                    verticalAlign="bottom"
                                                    iconType="circle"
                                                    iconSize={8}
                                                    wrapperStyle={{
                                                        fontSize: '11px',
                                                        paddingTop: '8px',
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                            No project data available.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Project progress chart */}
                            <div className="rounded-lg border border-[#e1e6ed] bg-white p-4">
                                <div className="border-b border-gray-100 pb-3">
                                    <h3 className="text-sm font-semibold text-[#283b52]">
                                        Project Progress
                                    </h3>
                                    <p className="mt-1 text-[11px] text-gray-500">
                                        Current completion percentage per
                                        project.
                                    </p>
                                </div>

                                <div className="mt-3 h-[250px]">
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
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid
                                                    stroke="#edf0f4"
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                />

                                                <XAxis
                                                    dataKey="name"
                                                    tick={{
                                                        fontSize: 9,
                                                        fill: '#7b8797',
                                                    }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    interval={0}
                                                    angle={-15}
                                                    textAnchor="end"
                                                    height={55}
                                                />

                                                <YAxis
                                                    domain={[0, 100]}
                                                    tickFormatter={(value) =>
                                                        `${value}%`
                                                    }
                                                    tick={{
                                                        fontSize: 10,
                                                        fill: '#7b8797',
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
                                                        borderRadius: '6px',
                                                        border: '1px solid #e1e6ed',
                                                        fontSize: '12px',
                                                    }}
                                                />

                                                <Bar
                                                    dataKey="progress"
                                                    name="Progress"
                                                    fill="#3974c6"
                                                    radius={[3, 3, 0, 0]}
                                                    maxBarSize={36}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                            No project data available.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Recent projects */}
                    <section className="overflow-hidden rounded-lg border border-[#e1e6ed] bg-white">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8ecf1] px-4 py-3.5 sm:px-5">
                            <div>
                                <h2 className="text-sm font-semibold text-[#283b52]">
                                    Recent Projects
                                </h2>
                                <p className="mt-1 text-[11px] text-gray-500">
                                    A quick view of the recorded government
                                    projects.
                                </p>
                            </div>

                            <Link
                                href="/admin/projects"
                                className="text-xs font-semibold text-[#315f91] hover:text-[#203e60]"
                            >
                                Manage Projects →
                            </Link>
                        </div>

                        {recentProjects.length > 0 ? (
                            <>
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full text-left">
                                        <thead className="bg-[#f8fafc]">
                                            <tr className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                                                <th className="px-5 py-3">
                                                    Project
                                                </th>
                                                <th className="px-4 py-3">
                                                    Location
                                                </th>
                                                <th className="px-4 py-3">
                                                    Status
                                                </th>
                                                <th className="px-5 py-3">
                                                    Progress
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100">
                                            {recentProjects.map((project) => {
                                                const progress = Math.min(
                                                    100,
                                                    Math.max(
                                                        0,
                                                        Number(
                                                            project.progress || 0
                                                        )
                                                    )
                                                );

                                                return (
                                                    <tr
                                                        key={project.id}
                                                        className="transition hover:bg-gray-50"
                                                    >
                                                        <td className="max-w-[260px] px-5 py-3.5">
                                                            <Link
                                                                href="/admin/projects"
                                                                className="block truncate text-xs font-semibold text-[#283b52] hover:text-[#315f91]"
                                                            >
                                                                {project.project_name ||
                                                                    'Untitled Project'}
                                                            </Link>
                                                        </td>

                                                        <td className="px-4 py-3.5 text-xs text-gray-500">
                                                            {project.location ||
                                                                'Not specified'}
                                                        </td>

                                                        <td className="px-4 py-3.5">
                                                            <span
                                                                className={`inline-flex rounded px-2 py-1 text-[10px] font-medium ${getStatusClass(
                                                                    project.status
                                                                )}`}
                                                            >
                                                                {project.status ||
                                                                    'Unknown'}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-3.5">
                                                            <div className="w-full max-w-[150px]">
                                                                <div className="mb-1.5 flex items-center justify-between gap-3 text-[10px] text-gray-500">
                                                                    <span>
                                                                        Progress
                                                                    </span>
                                                                    <span className="font-semibold text-[#283b52]">
                                                                        {
                                                                            progress
                                                                        }
                                                                        %
                                                                    </span>
                                                                </div>

                                                                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                                                                    <div
                                                                        className="h-full rounded-full bg-[#3974c6] transition-all"
                                                                        style={{
                                                                            width: `${progress}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="divide-y divide-gray-100 md:hidden">
                                    {recentProjects.map((project) => {
                                        const progress = Math.min(
                                            100,
                                            Math.max(
                                                0,
                                                Number(project.progress || 0)
                                            )
                                        );

                                        return (
                                            <div
                                                key={project.id}
                                                className="space-y-3 px-4 py-3.5"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="break-words text-xs font-semibold text-[#283b52]">
                                                            {project.project_name ||
                                                                'Untitled Project'}
                                                        </p>
                                                        <p className="mt-1 text-[10px] text-gray-500">
                                                            {project.location ||
                                                                'Not specified'}
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`shrink-0 rounded px-2 py-1 text-[10px] font-medium ${getStatusClass(
                                                            project.status
                                                        )}`}
                                                    >
                                                        {project.status ||
                                                            'Unknown'}
                                                    </span>
                                                </div>

                                                <div>
                                                    <div className="mb-1 flex justify-between text-[10px] text-gray-500">
                                                        <span>Progress</span>
                                                        <span>
                                                            {progress}%
                                                        </span>
                                                    </div>

                                                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                                                        <div
                                                            className="h-full rounded-full bg-[#3974c6]"
                                                            style={{
                                                                width: `${progress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="px-5 py-10 text-center">
                                <p className="text-sm font-medium text-gray-600">
                                    No projects available
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                    Project records will appear here when
                                    available.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* System management */}
                    <section>
                        <div className="mb-3">
                            <h2 className="text-sm font-semibold text-[#283b52]">
                                System Management
                            </h2>
                            <p className="mt-1 text-[11px] text-gray-500">
                                Open a section to manage its records.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {managementLinks.map((item) => (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className="group rounded-lg border border-[#e1e6ed] bg-white p-4 transition hover:border-[#b8c9dc] hover:shadow-sm"
                                >
                                    <div className="flex items-start justify-between">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#edf3f9] text-lg text-[#315f91]">
                                            {item.icon}
                                        </span>

                                        <span className="text-sm text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-[#315f91]">
                                            →
                                        </span>
                                    </div>

                                    <h3 className="mt-3 text-xs font-semibold text-[#283b52]">
                                        {item.title}
                                    </h3>

                                    <p className="mt-1.5 text-[11px] leading-5 text-gray-500">
                                        {item.description}
                                    </p>
                                </Link>
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
