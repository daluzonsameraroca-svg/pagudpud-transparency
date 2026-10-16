import { Link, usePage } from '@inertiajs/react';
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
    Ongoing: '#426da9',
    Completed: '#4d9877',
    Planned: '#d5a64b',
    Suspended: '#c96565',
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
            <>
                <path d="M21 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 2v-6a7.5 7.5 0 1 1 18-3.5Z" />
            </>
        ),
        announcement: (
            <>
                <path d="m3 11 18-5v12L3 13v-2Z" />
                <path d="m7 14 2 6h4l-2-5M21 10v4" />
            </>
        ),
        chart: (
            <>
                <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
            </>
        ),
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
        <div className="rounded-md border border-[#e3e8ef] bg-white px-4 py-3.5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-medium text-[#718096]">
                        {label}
                    </p>
                    <p className="mt-1.5 text-[25px] font-semibold leading-7 tracking-tight text-[#23364e]">
                        {value}
                    </p>
                    {note && (
                        <p className="mt-1.5 text-[10px] text-[#8996a7]">
                            {note}
                        </p>
                    )}
                </div>

                <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
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
                <h2 className="text-[13px] font-semibold text-[#293d55]">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 text-[10px] leading-4 text-[#8793a3]">
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
        Ongoing: 'bg-[#edf3fb] text-[#426da9]',
        Completed: 'bg-[#eaf5ef] text-[#428764]',
        Planned: 'bg-[#fbf4e6] text-[#a77b29]',
        Suspended: 'bg-[#faeded] text-[#b65050]',
    };

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-medium ${
                classes[status] || 'bg-gray-100 text-gray-600'
            }`}
        >
            {status || 'Unknown'}
        </span>
    );
}

export default function Dashboard({ projects = [] }) {
    const { props } = usePage();
    const user = props.auth?.user;

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
            <div className="min-h-screen bg-[#f5f7fa]">
                {/* Top navigation */}
                <header className="flex h-12 items-center justify-between border-b border-[#e3e8ef] bg-white px-5 sm:px-7">
                    <div className="flex items-center gap-2 text-[10px] text-[#8793a3]">
                        <span>Pagudpud Transparency</span>
                        <span>/</span>
                        <span className="font-medium text-[#344860]">
                            Dashboard
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Notifications"
                            className="relative flex h-7 w-7 items-center justify-center rounded-md text-[#64758a] hover:bg-gray-100"
                        >
                            <Icon name="bell" className="h-4 w-4" />
                        </button>

                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e7edf5] text-[10px] font-semibold text-[#385879]">
                            {(user?.name || 'Citizen')
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="space-y-5 px-5 py-5 sm:px-7">
                    {/* Page heading */}
                    <section>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-[19px] font-semibold tracking-tight text-[#253951]">
                                Citizen Dashboard
                            </h1>
                            <span className="rounded-full border border-[#dce7f3] bg-[#edf3fa] px-2 py-1 text-[9px] font-medium text-[#42658d]">
                                Demonstration data
                            </span>
                        </div>

                        <p className="mt-1 text-[11px] text-[#7b899a]">
                            Monitor local government projects and stay informed
                            about project progress.
                        </p>

                        <div className="mt-3 rounded-md border border-[#dce7f3] bg-[#eef4fa] px-3 py-2.5 text-[10px] leading-4 text-[#49627f]">
                            Official project status and progress are maintained
                            by the Municipal Engineering Office. Citizens can
                            view project information and submit feedback.
                        </div>
                    </section>

                    {/* Statistics */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            label="Total Projects"
                            value={totalProjects}
                            icon="projects"
                            color="#4a6fa5"
                            note="Projects in the register"
                        />
                        <StatCard
                            label="Ongoing Projects"
                            value={ongoingProjects}
                            icon="ongoing"
                            color="#4a6fa5"
                            note="Currently in implementation"
                        />
                        <StatCard
                            label="Completed Projects"
                            value={completedProjects}
                            icon="completed"
                            color="#4c9878"
                            note="Marked as completed"
                        />
                        <StatCard
                            label="Average Progress"
                            value={`${averageProgress}%`}
                            icon="chart"
                            color="#c39845"
                            note="Across all listed projects"
                        />
                    </section>

                    {/* Charts */}
                    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <div className="rounded-md border border-[#e3e8ef] bg-white p-4">
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
                                                        fill={
                                                            COLORS[entry.name]
                                                        }
                                                        stroke="none"
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    fontSize: 11,
                                                    borderRadius: 6,
                                                    borderColor: '#e3e8ef',
                                                }}
                                            />
                                            <Legend
                                                verticalAlign="bottom"
                                                iconType="circle"
                                                iconSize={7}
                                                wrapperStyle={{
                                                    fontSize: 10,
                                                    color: '#68788c',
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-[11px] text-[#8793a3]">
                                        No project data available.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-md border border-[#e3e8ef] bg-white p-4">
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
                                                stroke="#edf0f4"
                                                strokeDasharray="3 3"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="name"
                                                tick={{
                                                    fontSize: 9,
                                                    fill: '#7b899a',
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
                                                    fill: '#7b899a',
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
                                                    borderRadius: 6,
                                                    borderColor: '#e3e8ef',
                                                }}
                                            />
                                            <Bar
                                                dataKey="progress"
                                                name="Progress"
                                                fill="#5278ae"
                                                maxBarSize={34}
                                                radius={[3, 3, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-[11px] text-[#8793a3]">
                                        No project data available.
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Recent Projects */}
                    <section className="overflow-hidden rounded-md border border-[#e3e8ef] bg-white">
                        <div className="flex items-center justify-between border-b border-[#e8edf2] px-4 py-3">
                            <div>
                                <h2 className="text-[13px] font-semibold text-[#293d55]">
                                    Recent Projects
                                </h2>
                                <p className="mt-1 text-[10px] text-[#8793a3]">
                                    Recently added government projects
                                </p>
                            </div>

                            <Link
                                href="/citizen/projects"
                                className="flex items-center gap-1 text-[10px] font-medium text-[#416b9f] hover:text-[#244a79]"
                            >
                                View all
                                <Icon name="arrow" className="h-3 w-3" />
                            </Link>
                        </div>

                        {recentProjects.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[650px] text-left">
                                    <thead className="bg-[#f8fafc]">
                                        <tr className="text-[9px] font-semibold uppercase tracking-wide text-[#8290a1]">
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

                                    <tbody className="divide-y divide-[#edf0f4]">
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
                                                    className="hover:bg-[#fafbfd]"
                                                >
                                                    <td className="px-4 py-3">
                                                        <p className="max-w-[220px] truncate text-[11px] font-medium text-[#354960]">
                                                            {project.project_name ||
                                                                'Untitled Project'}
                                                        </p>
                                                        <p className="mt-1 text-[10px] text-[#8793a3]">
                                                            {project.location ||
                                                                'Location not provided'}
                                                        </p>
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-3 text-[10px] text-[#5d6d81]">
                                                        {formatBudget(
                                                            project.budget
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <StatusBadge
                                                            status={
                                                                project.status
                                                            }
                                                        />
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <div className="w-24">
                                                            <div className="mb-1 flex justify-between text-[9px] text-[#7c8a9b]">
                                                                <span>
                                                                    Progress
                                                                </span>
                                                                <span>
                                                                    {progress}%
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 overflow-hidden rounded-full bg-[#e9edf2]">
                                                                <div
                                                                    className="h-full rounded-full bg-[#5278ae]"
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
                                                            className="whitespace-nowrap text-[10px] font-medium text-[#416b9f] hover:underline"
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
                            <div className="px-4 py-10 text-center text-[11px] text-[#8793a3]">
                                No projects available.
                            </div>
                        )}
                    </section>

                    {/* Quick Actions */}
                    <section>
                        <SectionTitle
                            title="Quick Actions"
                            description="Quick access to common citizen activities"
                        />

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <Link
                                href="/citizen/projects"
                                className="group flex items-start gap-3 rounded-md border border-[#e3e8ef] bg-white p-3.5 transition hover:border-[#bdcfe3]"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#edf3fa] text-[#456c9e]">
                                    <Icon name="search" />
                                </div>
                                <div>
                                    <h3 className="text-[11px] font-semibold text-[#354960] group-hover:text-[#416b9f]">
                                        Browse Projects
                                    </h3>
                                    <p className="mt-1 text-[10px] leading-4 text-[#8793a3]">
                                        Search and view local government
                                        projects.
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/citizen/posts"
                                className="group flex items-start gap-3 rounded-md border border-[#e3e8ef] bg-white p-3.5 transition hover:border-[#bdcfe3]"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#edf5ef] text-[#4b8b68]">
                                    <Icon name="announcement" />
                                </div>
                                <div>
                                    <h3 className="text-[11px] font-semibold text-[#354960] group-hover:text-[#416b9f]">
                                        Administrative Posts
                                    </h3>
                                    <p className="mt-1 text-[10px] leading-4 text-[#8793a3]">
                                        Read official announcements and
                                        updates.
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/citizen/feedback"
                                className="group flex items-start gap-3 rounded-md border border-[#e3e8ef] bg-white p-3.5 transition hover:border-[#bdcfe3]"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#fbf4e7] text-[#b58a39]">
                                    <Icon name="message" />
                                </div>
                                <div>
                                    <h3 className="text-[11px] font-semibold text-[#354960] group-hover:text-[#416b9f]">
                                        Submit Feedback
                                    </h3>
                                    <p className="mt-1 text-[10px] leading-4 text-[#8793a3]">
                                        Share feedback about a project.
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="border-t border-[#e3e8ef] pt-3 text-[9px] leading-4 text-[#929eac]">
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
