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

const STATUS_COLORS = {
    Ongoing: '#3b82f6',
    Completed: '#10b981',
    Planned: '#f59e0b',
    Suspended: '#ef4444',
};

export default function Dashboard({ projects = [] }) {
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

    const progressData = projects.map((project) => ({
        name:
            (project.project_name || '').length > 18
                ? `${project.project_name.substring(0, 18)}...`
                : project.project_name || 'Untitled Project',
        fullName: project.project_name || 'Untitled Project',
        progress: Math.min(
            100,
            Math.max(0, Number(project.progress || 0)),
        ),
    }));

    const recentProjects = projects.slice(0, 5);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
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
            description: 'All recorded projects',
            color: 'bg-slate-100 text-slate-700',
            icon: '▤',
        },
        {
            label: 'Ongoing',
            value: ongoingProjects,
            description: 'Currently in progress',
            color: 'bg-blue-50 text-blue-700',
            icon: '◷',
        },
        {
            label: 'Completed',
            value: completedProjects,
            description: 'Finished projects',
            color: 'bg-emerald-50 text-emerald-700',
            icon: '✓',
        },
        {
            label: 'Planned',
            value: plannedProjects,
            description: 'Awaiting implementation',
            color: 'bg-amber-50 text-amber-700',
            icon: '▦',
        },
        {
            label: 'Average Progress',
            value: `${averageProgress}%`,
            description: 'Across all projects',
            color: 'bg-indigo-50 text-indigo-700',
            icon: '↗',
        },
    ];

    return (
        <DashboardLayout role="engineering">
            <div className="min-h-screen bg-[#f4f6f9] text-slate-800">
                {/* Header */}
                <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
                    <div className="mx-auto flex max-w-[1500px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
                                <span>Engineering Office</span>
                                <span>/</span>
                                <span className="font-medium text-slate-700">
                                    Dashboard
                                </span>
                            </div>

                            <h1 className="text-xl font-bold tracking-tight text-[#20334b] sm:text-2xl">
                                Engineering Dashboard
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Monitor government projects and keep project
                                progress information updated.
                            </p>
                        </div>

                        <Link
                            href="/engineering/projects/create"
                            className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-[#20334b] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2c4664] sm:self-center"
                        >
                            <span className="text-base">+</span>
                            Add New Project
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-[1500px] px-5 py-6 sm:px-8">
                    {/* Statistics */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                        {statCards.map((card) => (
                            <div
                                key={card.label}
                                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500">
                                            {card.label}
                                        </p>

                                        <p className="mt-2 text-2xl font-bold tracking-tight text-[#20334b]">
                                            {card.value}
                                        </p>
                                    </div>

                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-base font-semibold ${card.color}`}
                                    >
                                        {card.icon}
                                    </div>
                                </div>

                                <p className="mt-2 text-[11px] text-slate-400">
                                    {card.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Suspended project notice */}
                    {suspendedProjects > 0 && (
                        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-sm font-bold text-red-700">
                                !
                            </span>

                            <div>
                                <p className="text-xs font-semibold text-red-800">
                                    Suspended Projects
                                </p>
                                <p className="mt-1 text-xs leading-5 text-red-700">
                                    {suspendedProjects}{' '}
                                    {suspendedProjects === 1
                                        ? 'project is'
                                        : 'projects are'}{' '}
                                    currently marked as suspended. Review their
                                    records and update their status when appropriate.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Charts */}
                    <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
                        {/* Project status chart */}
                        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <div className="mb-3">
                                <h2 className="text-sm font-semibold text-[#20334b]">
                                    Project Status
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Distribution of recorded project statuses.
                                </p>
                            </div>

                            <div className="h-64">
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
                                                innerRadius={48}
                                                outerRadius={78}
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
                                                iconSize={8}
                                                wrapperStyle={{
                                                    fontSize: '11px',
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center text-center">
                                        <p className="text-sm font-medium text-slate-600">
                                            No project data available
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Add a project to see the status chart.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Project progress chart */}
                        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <div className="mb-3">
                                <h2 className="text-sm font-semibold text-[#20334b]">
                                    Project Progress
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Current completion percentage by project.
                                </p>
                            </div>

                            <div className="h-64">
                                {progressData.length > 0 ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={progressData}
                                            margin={{
                                                top: 12,
                                                right: 8,
                                                left: -15,
                                                bottom: 12,
                                            }}
                                        >
                                            <CartesianGrid
                                                stroke="#e8edf3"
                                                strokeDasharray="3 3"
                                                vertical={false}
                                            />

                                            <XAxis
                                                dataKey="name"
                                                angle={-20}
                                                textAnchor="end"
                                                height={60}
                                                interval={0}
                                                tick={{
                                                    fontSize: 10,
                                                    fill: '#64748b',
                                                }}
                                                axisLine={false}
                                                tickLine={false}
                                            />

                                            <YAxis
                                                domain={[0, 100]}
                                                ticks={[0, 25, 50, 75, 100]}
                                                tickFormatter={(value) =>
                                                    `${value}%`
                                                }
                                                tick={{
                                                    fontSize: 10,
                                                    fill: '#64748b',
                                                }}
                                                axisLine={false}
                                                tickLine={false}
                                            />

                                            <Tooltip
                                                cursor={{
                                                    fill: '#f1f5f9',
                                                }}
                                                formatter={(value) => [
                                                    `${value}%`,
                                                    'Progress',
                                                ]}
                                                labelFormatter={(
                                                    _label,
                                                    payload,
                                                ) =>
                                                    payload?.[0]?.payload
                                                        ?.fullName || _label
                                                }
                                            />

                                            <Bar
                                                dataKey="progress"
                                                name="Progress"
                                                fill="#3b82f6"
                                                maxBarSize={38}
                                                radius={[5, 5, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center text-center">
                                        <p className="text-sm font-medium text-slate-600">
                                            No progress data available
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Project progress will appear here.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Recent projects */}
                    <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                            <div>
                                <h2 className="text-sm font-semibold text-[#20334b]">
                                    Recent Projects
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Projects from your current records.
                                </p>
                            </div>

                            <Link
                                href="/engineering/projects"
                                className="self-start text-xs font-semibold text-blue-700 transition hover:text-blue-900 sm:self-center"
                            >
                                View All Projects →
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
                                            className="flex flex-col gap-3 px-4 py-4 transition hover:bg-slate-50 sm:px-5 md:flex-row md:items-center md:justify-between"
                                        >
                                            <div className="flex min-w-0 items-start gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-600">
                                                    ▤
                                                </div>

                                                <div className="min-w-0">
                                                    <Link
                                                        href="/engineering/projects"
                                                        className="break-words text-xs font-semibold text-[#20334b] hover:text-blue-700"
                                                    >
                                                        {project.project_name ||
                                                            'Untitled Project'}
                                                    </Link>

                                                    <p className="mt-1 text-[11px] text-slate-500">
                                                        {project.location ||
                                                            'Location not specified'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${getStatusClass(project.status)}`}
                                                >
                                                    {project.status ||
                                                        'Unknown'}
                                                </span>

                                                <div className="w-full sm:w-32">
                                                    <div className="mb-1.5 flex items-center justify-between text-[10px] text-slate-500">
                                                        <span>Progress</span>
                                                        <span className="font-semibold text-slate-700">
                                                            {progress}%
                                                        </span>
                                                    </div>

                                                    <div
                                                        className="h-1.5 overflow-hidden rounded-full bg-slate-100"
                                                        role="progressbar"
                                                        aria-valuenow={progress}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                        aria-label={`${project.project_name || 'Project'} progress`}
                                                    >
                                                        <div
                                                            className={`h-full rounded-full ${
                                                                project.status ===
                                                                'Completed'
                                                                    ? 'bg-emerald-500'
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
                            <div className="px-5 py-12 text-center">
                                <p className="text-sm font-medium text-slate-600">
                                    No projects available
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                    Create a project record to get started.
                                </p>
                                <Link
                                    href="/engineering/projects/create"
                                    className="mt-4 inline-flex rounded-lg bg-[#20334b] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#2c4664]"
                                >
                                    Add First Project
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Quick actions */}
                    <section className="mt-6">
                        <div className="mb-3">
                            <h2 className="text-sm font-semibold text-[#20334b]">
                                Quick Actions
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Shortcuts for managing project records.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <Link
                                href="/engineering/projects"
                                className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg text-blue-700">
                                        ▤
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-semibold text-[#20334b] group-hover:text-blue-700">
                                            Manage Projects
                                        </h3>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            View project records and update
                                            project status and progress.
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/engineering/projects/create"
                                className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-lg text-emerald-700">
                                        +
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-semibold text-[#20334b] group-hover:text-emerald-700">
                                            Add New Project
                                        </h3>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Create a new local government
                                            project record.
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </section>

                    <footer className="mt-8 border-t border-slate-200 py-4 text-center text-[10px] text-slate-400">
                        Pagudpud Transparency · Engineering Office
                    </footer>
                </main>
            </div>
        </DashboardLayout>
    );
}
