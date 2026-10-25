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

const STATUS_COLORS = {
    Ongoing: '#3b82f6',
    Completed: '#1d4ed8',
    Planned: '#f59e0b',
    Suspended: '#ef4444',
};

export default function Dashboard({
    projects = [],
    completionStats = [],
}) {
    const totalProjects = projects.length;

    const ongoingProjects = projects.filter(
        (project) => project.status === 'Ongoing',
    ).length;

    const completedProjects = projects.filter(
        (project) => project.status === 'Completed',
    ).length;

    const plannedProjects = projects.filter(
        (project) => project.status === 'Planned',
    ).length;

    const suspendedProjects = projects.filter(
        (project) => project.status === 'Suspended',
    ).length;

    const averageProgress =
        totalProjects > 0
            ? Math.round(
                  projects.reduce(
                      (total, project) =>
                          total + Number(project.progress || 0),
                      0,
                  ) / totalProjects,
              )
            : 0;

    const statusData = [
        { name: 'Ongoing', value: ongoingProjects },
        { name: 'Completed', value: completedProjects },
        { name: 'Planned', value: plannedProjects },
        { name: 'Suspended', value: suspendedProjects },
    ].filter((item) => item.value > 0);

    const recentProjects = projects
        .filter((project) => project.status !== 'Completed')
        .slice(0, 5);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-blue-50 text-blue-700 ring-blue-600/20';
            case 'Ongoing':
                return 'bg-blue-50 text-blue-700 ring-blue-600/20';
            case 'Planned':
                return 'bg-amber-50 text-amber-700 ring-amber-600/20';
            case 'Suspended':
                return 'bg-red-50 text-red-700 ring-red-600/20';
            default:
                return 'bg-slate-100 text-slate-600 ring-slate-500/20';
        }
    };

    const statCards = [
        {
            label: 'Total Projects',
            value: totalProjects,
            color: 'bg-slate-100 text-slate-700',
            icon: '▤',
        },
        {
            label: 'Ongoing',
            value: ongoingProjects,
            color: 'bg-blue-50 text-blue-700',
            icon: '◷',
        },
        {
            label: 'Completed',
            value: completedProjects,
            color: 'bg-blue-50 text-blue-700',
            icon: '✓',
        },
        {
            label: 'Planned',
            value: plannedProjects,
            color: 'bg-amber-50 text-amber-700',
            icon: '▦',
        },
        {
            label: 'Average Progress',
            value: `${averageProgress}%`,
            color: 'bg-blue-50 text-blue-700',
            icon: '↗',
        },
    ];

    return (
        <DashboardLayout role="engineering">
            <div className="min-h-screen bg-slate-50 text-slate-800">
                <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
                    <div className="mx-auto flex max-w-[1500px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Engineering 
                            </h1>

                        </div>

                        <Link
                            href="/engineering/projects/create"
                            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:self-center"
                        >
                            <span className="text-lg">+</span>
                            Add New Project
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-[1500px] px-5 py-6 sm:px-8">
                    <section>
                        <div className="mb-4">
                            <h2 className="text-base font-bold text-slate-900">
                                Project Overview
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                            {statCards.map((card) => (
                                <div
                                    key={card.label}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">
                                                {card.label}
                                            </p>

                                            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                                                {card.value}
                                            </p>
                                        </div>

                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${card.color}`}
                                        >
                                            {card.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {suspendedProjects > 0 && (
                        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-sm font-bold text-red-700">
                                !
                            </span>

                            <div>
                                <p className="text-sm font-bold text-red-800">
                                    Suspended Projects
                                </p>
                            </div>
                        </div>
                    )}

                    <section className="mt-8">
                        <div className="mb-4">
                            <h2 className="text-base font-bold text-slate-900">
                                Project Analytics
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                                <div className="mb-4">
                                    <h3 className="text-base font-bold text-slate-900">
                                        Project Status
                                    </h3>
                                </div>

                                <div className="h-72">
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
                                                    innerRadius={55}
                                                    outerRadius={85}
                                                    paddingAngle={3}
                                                    stroke="none"
                                                    label={({ percent }) =>
                                                        `${Math.round(percent * 100)}%`
                                                    }
                                                    labelLine={false}
                                                >
                                                    {statusData.map((entry) => (
                                                        <Cell
                                                            key={entry.name}
                                                            fill={
                                                                STATUS_COLORS[
                                                                    entry.name
                                                                ] || '#94a3b8'
                                                            }
                                                        />
                                                    ))}
                                                </Pie>

                                                <Tooltip
                                                    formatter={(value, name) => [
                                                        value,
                                                        name,
                                                    ]}
                                                />

                                                <Legend
                                                    verticalAlign="bottom"
                                                    iconType="circle"
                                                    iconSize={9}
                                                    wrapperStyle={{
                                                        fontSize: '12px',
                                                        paddingTop: '12px',
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center rounded-xl bg-slate-50 text-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-700">
                                                ◔
                                            </div>
                                            <p className="mt-3 text-sm font-semibold text-slate-700">
                                                No project data available
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                                <div className="mb-4">
                                    <h3 className="text-base font-bold text-slate-900">
                                        Project Progress
                                    </h3>
                                </div>
                                <ProjectProgressBarChart projects={projects} />
                            </section>
                        </div>
                    </section>

                    <ProjectCompletionLineChart data={completionStats} />

                    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">
                                    Recent Projects
                                </h2>
                            </div>

                            <Link
                                href="/engineering/projects"
                                className="self-start text-sm font-semibold text-blue-700 transition hover:text-blue-900 sm:self-center"
                            >
                                View All Projects
                            </Link>
                        </div>

                        {recentProjects.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {recentProjects.map((project) => {
                                    const progress = Math.min(
                                        100,
                                        Math.max(
                                            0,
                                            Number(project.progress || 0),
                                        ),
                                    );

                                    return (
                                        <div
                                            key={project.id}
                                            className="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50 sm:px-6 md:flex-row md:items-center md:justify-between"
                                        >
                                            <div className="flex min-w-0 items-start gap-3">
                                                {project.image_url ? (
                                                    <img
                                                        src={project.image_url}
                                                        alt={`${project.project_name || 'Project'} photo`}
                                                        loading="lazy"
                                                        className="h-14 w-20 shrink-0 rounded-xl bg-slate-100 object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-700">
                                                        ▤
                                                    </div>
                                                )}

                                                <div className="min-w-0">
                                                    <Link
                                                        href="/engineering/projects"
                                                        className="break-words text-sm font-semibold text-slate-900 transition hover:text-blue-700"
                                                    >
                                                        {project.project_name ||
                                                            'Untitled Project'}
                                                    </Link>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {project.location ||
                                                            'Location not specified'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                                                <span
                                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getStatusClass(project.status)}`}
                                                >
                                                    {project.status || 'Unknown'}
                                                </span>

                                                <div className="w-full sm:w-36">
                                                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                                                        <span>Progress</span>
                                                        <span className="font-semibold text-slate-700">
                                                            {progress}%
                                                        </span>
                                                    </div>

                                                    <div
                                                        className="h-2 overflow-hidden rounded-full bg-slate-100"
                                                        role="progressbar"
                                                        aria-valuenow={progress}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                        aria-label={`${project.project_name || 'Project'} progress`}
                                                    >
                                                        <div
                                                            className={`h-full rounded-full transition-all ${
                                                                project.status ===
                                                                'Completed'
                                                                    ? 'bg-blue-700'
                                                                    : 'bg-blue-500'
                                                            }`}
                                                            style={{
                                                                width: `${progress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="px-5 py-14 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-700">
                                    ▤
                                </div>
                                <p className="mt-4 text-sm font-semibold text-slate-800">
                                    {projects.length === 0
                                        ? 'No projects available'
                                        : 'No recent projects'}
                                </p>
                                {projects.length === 0 ? (
                                    <Link
                                        href="/engineering/projects/create"
                                        className="mt-5 inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                                    >
                                        Add First Project
                                    </Link>
                                ) : (
                                    <p className="mt-2 text-sm text-slate-500">
                                        Completed projects remain in View All Projects.
                                    </p>
                                )}
                            </div>
                        )}
                    </section>

                    <section className="mt-8">
                        <div className="mb-4">
                            <h2 className="text-base font-bold text-slate-900">
                                Quick Actions
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Link
                                href="/engineering/projects"
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700 transition group-hover:bg-blue-100">
                                        ▤
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 transition group-hover:text-blue-700">
                                            Manage Projects
                                        </h3>
                                        <span className="mt-3 inline-block text-sm font-semibold text-blue-700">
                                            Open projects
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/engineering/projects/create"
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-700 transition group-hover:bg-blue-100">
                                        +
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 transition group-hover:text-blue-700">
                                            Add New Project
                                        </h3>
                                        <span className="mt-3 inline-block text-sm font-semibold text-blue-700">
                                            Create project
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </section>

                    <footer className="mt-10 border-t border-slate-200 py-5 text-center text-xs text-slate-400">
                        Pagudpud Transparency · Engineering Office
                    </footer>
                </main>
            </div>
        </DashboardLayout>
    );
}
