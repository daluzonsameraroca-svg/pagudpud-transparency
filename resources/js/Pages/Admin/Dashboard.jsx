import { Link } from '@inertiajs/react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

import ProjectCompletionLineChart from '../../Components/ProjectCompletionLineChart';
import ProjectProgressBarChart from '../../Components/ProjectProgressBarChart';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default function Dashboard({
    projects = [],
    totalUsers = 0,
    totalFeedback = 0,
    totalPosts = 0,
    completionStats = [],
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
        Ongoing: '#3b82f6',
        Completed: '#1d4ed8',
        Planned: '#d97706',
        Suspended: '#dc2626',
    };

    const recentProjects = projects
        .filter((project) => project.status !== 'Completed')
        .slice(0, 5);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-blue-50 text-blue-800';
            case 'Ongoing':
                return 'bg-blue-50 text-blue-800';
            case 'Planned':
                return 'bg-amber-50 text-amber-800';
            case 'Suspended':
                return 'bg-red-50 text-red-800';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    const statCards = [
        {
            label: 'Total Users',
            value: totalUsers,
            icon: '♙',
            color: 'text-blue-800',
            iconBg: 'bg-blue-50',
        },
        {
            label: 'Total Projects',
            value: totalProjects,
            icon: '▤',
            color: 'text-blue-800',
            iconBg: 'bg-blue-50',
        },
        {
            label: 'Citizen Feedback',
            value: totalFeedback,
            icon: '☷',
            color: 'text-blue-800',
            iconBg: 'bg-blue-50',
        },
        {
            label: 'Administrative Posts',
            value: totalPosts,
            icon: '▧',
            color: 'text-amber-800',
            iconBg: 'bg-amber-50',
        },
        {
            label: 'Average Progress',
            value: `${averageProgress}%`,
            icon: '↗',
            color: 'text-blue-800',
            iconBg: 'bg-blue-50',
        },
    ];

    const managementLinks = [
        {
            title: 'Manage Users',
            href: '/admin/users',
            icon: '♙',
        },
        {
            title: 'Manage Projects',
            href: '/admin/projects',
            icon: '▤',
        },
        {
            title: 'Administrative Posts',
            href: '/admin/posts',
            icon: '▧',
        },
        {
            title: 'Citizen Feedback',
            href: '/admin/feedback',
            icon: '☷',
        },
    ];

    const summaryCards = [
        {
            label: 'Ongoing Projects',
            value: ongoingProjects,
            color: 'bg-blue-500',
            text: 'text-blue-800',
            bg: 'bg-blue-50',
        },
        {
            label: 'Completed Projects',
            value: completedProjects,
            color: 'bg-blue-600',
            text: 'text-blue-800',
            bg: 'bg-blue-50',
        },
        {
            label: 'Planned Projects',
            value: plannedProjects,
            color: 'bg-amber-500',
            text: 'text-amber-800',
            bg: 'bg-amber-50',
        },
        {
            label: 'Suspended Projects',
            value: suspendedProjects,
            color: 'bg-red-500',
            text: 'text-red-800',
            bg: 'bg-red-50',
        },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-slate-50 text-slate-800">
                <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-7">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Administrator Dashboard
                            </h1>

                        </div>

                        <Link
                            href="/admin/projects"
                            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                        >
                            <span className="text-lg leading-none">+</span>
                            View Projects
                        </Link>
                    </div>
                </header>

                <main className="space-y-7 p-4 sm:p-6">
                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-slate-900">
                                System Overview
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                            {statCards.map((card) => (
                                <div
                                    key={card.label}
                                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-sm font-medium leading-5 text-slate-600">
                                            {card.label}
                                        </p>

                                        <span
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl ${card.iconBg} ${card.color}`}
                                        >
                                            {card.icon}
                                        </span>
                                    </div>

                                    <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                                        {card.value}
                                    </p>

                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {summaryCards.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <span
                                    className={`h-12 w-1.5 shrink-0 rounded-full ${item.color}`}
                                />

                                <div>
                                    <p className="text-sm text-slate-600">
                                        {item.label}
                                    </p>
                                    <p className={`mt-1 text-2xl font-bold ${item.text}`}>
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-slate-900">
                                Project Analytics
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="border-b border-slate-100 pb-4">
                                    <h3 className="text-base font-semibold text-slate-900">
                                        Project Status
                                    </h3>
                                </div>

                                <div className="mt-4 h-[280px]">
                                    {statusData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statusData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="45%"
                                                    innerRadius={55}
                                                    outerRadius={85}
                                                    paddingAngle={3}
                                                >
                                                    {statusData.map((entry) => (
                                                        <Cell
                                                            key={entry.name}
                                                            fill={chartColors[entry.name]}
                                                            stroke="none"
                                                        />
                                                    ))}
                                                </Pie>

                                                <Tooltip
                                                    contentStyle={{
                                                        borderRadius: '8px',
                                                        border: '1px solid #e2e8f0',
                                                        fontSize: '13px',
                                                    }}
                                                />

                                                <Legend
                                                    verticalAlign="bottom"
                                                    iconType="circle"
                                                    iconSize={9}
                                                    wrapperStyle={{
                                                        fontSize: '13px',
                                                        paddingTop: '10px',
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                            No project data available.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="border-b border-slate-100 pb-4">
                                    <h3 className="text-base font-semibold text-slate-900">
                                        Project Progress
                                    </h3>
                                </div>
                                <div className="mt-4">
                                    <ProjectProgressBarChart projects={projects} />
                                </div>
                            </div>
                        </div>
                    </section>

                    <ProjectCompletionLineChart data={completionStats} />

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Recent Projects
                                </h2>
                            </div>

                            <Link
                                href="/admin/projects"
                                className="text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                            >
                                Manage Projects
                            </Link>
                        </div>

                        {recentProjects.length > 0 ? (
                            <>
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50">
                                            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                <th className="px-5 py-4">Project</th>
                                                <th className="px-4 py-4">Location</th>
                                                <th className="px-4 py-4">Status</th>
                                                <th className="px-5 py-4">Progress</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-100">
                                            {recentProjects.map((project) => {
                                                const progress = Math.min(
                                                    100,
                                                    Math.max(0, Number(project.progress || 0))
                                                );

                                                return (
                                                    <tr
                                                        key={project.id}
                                                        className="transition hover:bg-blue-50/40"
                                                    >
                                                        <td className="max-w-[300px] px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                {project.image_url && (
                                                                    <img
                                                                        src={project.image_url}
                                                                        alt=""
                                                                        loading="lazy"
                                                                        className="h-12 w-16 shrink-0 rounded-lg bg-slate-100 object-cover"
                                                                    />
                                                                )}
                                                                <Link
                                                                    href="/admin/projects"
                                                                    className="truncate text-sm font-semibold text-slate-800 transition hover:text-blue-700"
                                                                >
                                                                    {project.project_name || 'Untitled Project'}
                                                                </Link>
                                                            </div>
                                                        </td>

                                                        <td className="px-4 py-4 text-sm text-slate-600">
                                                            {project.location || 'Not specified'}
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            <span
                                                                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(project.status)}`}
                                                            >
                                                                {project.status || 'Unknown'}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <div className="w-full max-w-[170px]">
                                                                <div className="mb-2 flex items-center justify-between gap-3 text-xs text-slate-600">
                                                                    <span>Progress</span>
                                                                    <span className="font-semibold text-slate-800">
                                                                        {progress}%
                                                                    </span>
                                                                </div>

                                                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                                    <div
                                                                        className="h-full rounded-full bg-blue-600 transition-all"
                                                                        style={{ width: `${progress}%` }}
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

                                <div className="divide-y divide-slate-100 md:hidden">
                                    {recentProjects.map((project) => {
                                        const progress = Math.min(
                                            100,
                                            Math.max(0, Number(project.progress || 0))
                                        );

                                        return (
                                            <div
                                                key={project.id}
                                                className="space-y-4 px-5 py-4"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex min-w-0 items-start gap-3">
                                                        {project.image_url && (
                                                            <img
                                                                src={project.image_url}
                                                                alt=""
                                                                loading="lazy"
                                                                className="h-14 w-20 shrink-0 rounded-lg bg-slate-100 object-cover"
                                                            />
                                                        )}
                                                        <div className="min-w-0">
                                                        <p className="break-words text-sm font-semibold text-slate-900">
                                                            {project.project_name || 'Untitled Project'}
                                                        </p>
                                                        <p className="mt-1.5 text-sm text-slate-600">
                                                            {project.location || 'Not specified'}
                                                        </p>
                                                        </div>
                                                    </div>

                                                    <span
                                                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(project.status)}`}
                                                    >
                                                        {project.status || 'Unknown'}
                                                    </span>
                                                </div>

                                                <div>
                                                    <div className="mb-2 flex justify-between text-sm text-slate-600">
                                                        <span>Progress</span>
                                                        <span className="font-semibold text-slate-800">
                                                            {progress}%
                                                        </span>
                                                    </div>

                                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                        <div
                                                            className="h-full rounded-full bg-blue-600"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="px-5 py-12 text-center">
                                <p className="text-base font-semibold text-slate-700">
                                    {projects.length === 0
                                        ? 'No projects available'
                                        : 'No recent projects. Completed projects remain available in Manage Projects.'}
                                </p>
                            </div>
                        )}
                    </section>

                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-slate-900">
                                System Management
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {managementLinks.map((item) => (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-800">
                                            {item.icon}
                                        </span>

                                    </div>

                                    <h3 className="mt-4 text-base font-semibold text-slate-900">
                                        {item.title}
                                    </h3>

                                </Link>
                            ))}
                        </div>
                    </section>

                    <footer className="border-t border-slate-200 pt-5 text-center text-sm leading-6 text-slate-500">
                        Pagudpud Transparency · Web-Based Local Government
                        Project Monitoring System
                    </footer>
                </main>
            </div>
        </DashboardLayout>
    );
}