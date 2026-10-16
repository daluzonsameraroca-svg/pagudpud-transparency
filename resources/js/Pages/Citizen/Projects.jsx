import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';

function Icon({ name, className = 'h-4 w-4' }) {
    const icons = {
        search: (
            <>
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 4 4" />
            </>
        ),
        folder: (
            <>
                <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
            </>
        ),
        arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
        filter: (
            <>
                <path d="M4 7h16M7 12h10m-7 5h4" />
                <circle cx="8" cy="7" r="1" />
            </>
        ),
    };

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {icons[name] || icons.folder}
        </svg>
    );
}

function StatusBadge({ status }) {
    const styles = {
        Ongoing: 'bg-[#edf3fb] text-[#426da9]',
        Completed: 'bg-[#eaf5ef] text-[#428764]',
        Planned: 'bg-[#fbf4e6] text-[#a77b29]',
        Suspended: 'bg-[#faeded] text-[#b65050]',
    };

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-medium ${
                styles[status] || 'bg-gray-100 text-gray-600'
            }`}
        >
            {status || 'Unknown'}
        </span>
    );
}

function formatBudget(budget) {
    if (budget === null || budget === undefined || budget === '') {
        return '—';
    }

    return Number(budget).toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2,
    });
}

function formatDate(date) {
    if (!date) return 'Not specified';

    // Parse date-only values locally to avoid timezone date shifts.
    const parts = String(date).slice(0, 10).split('-');

    if (parts.length === 3) {
        const [year, month, day] = parts.map(Number);
        const parsed = new Date(year, month - 1, day);

        if (!Number.isNaN(parsed.getTime())) {
            return parsed.toLocaleDateString('en-PH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        }
    }

    return 'Not specified';
}

export default function Projects({ projects = [], search = '' }) {
    const [searchTerm, setSearchTerm] = useState(search);
    const [statusFilter, setStatusFilter] = useState('');

    const handleSearch = (event) => {
        event.preventDefault();

        router.get(
            '/citizen/projects',
            {
                search: searchTerm.trim() || undefined,
                status: statusFilter || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');

        router.get(
            '/citizen/projects',
            {},
            {
                preserveState: false,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    return (
        <DashboardLayout role="citizen">
            <div className="min-h-screen bg-[#f5f7fa]">
                {/* Top navigation */}
                <header className="flex h-12 items-center justify-between border-b border-[#e3e8ef] bg-white px-5 sm:px-7">
                    <div className="flex items-center gap-2 text-[10px] text-[#8793a3]">
                        <span>Pagudpud Transparency</span>
                        <span>/</span>
                        <Link
                            href="/citizen/dashboard"
                            className="hover:text-[#416b9f]"
                        >
                            Dashboard
                        </Link>
                        <span>/</span>
                        <span className="font-medium text-[#344860]">
                            Projects
                        </span>
                    </div>

                    <span className="text-[10px] text-[#7b899a]">
                        Public Project Records
                    </span>
                </header>

                <main className="space-y-5 px-5 py-5 sm:px-7">
                    {/* Page heading */}
                    <section>
                        <h1 className="text-[19px] font-semibold tracking-tight text-[#253951]">
                            Government Projects
                        </h1>
                        <p className="mt-1 text-[11px] text-[#7b899a]">
                            View and monitor local government projects in
                            Pagudpud, Ilocos Norte.
                        </p>
                    </section>

                    {/* Information notice */}
                    <div className="rounded-md border border-[#dce7f3] bg-[#eef4fa] px-3 py-2.5 text-[10px] leading-4 text-[#49627f]">
                        Project information and official progress updates are
                        provided by the responsible municipal office.
                    </div>

                    {/* Search and filters */}
                    <section className="rounded-md border border-[#e3e8ef] bg-white p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <Icon
                                name="search"
                                className="h-4 w-4 text-[#52739b]"
                            />
                            <h2 className="text-[12px] font-semibold text-[#293d55]">
                                Search Projects
                            </h2>
                        </div>

                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col gap-2 sm:flex-row"
                        >
                            <div className="relative min-w-0 flex-1">
                                <Icon
                                    name="search"
                                    className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#97a2b0]"
                                />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                    placeholder="Search by project name or location..."
                                    className="h-9 w-full rounded-md border border-[#dfe5ec] bg-white pl-9 pr-3 text-[11px] text-[#344860] outline-none transition placeholder:text-[#a0aab7] focus:border-[#7898bd] focus:ring-2 focus:ring-[#e7eef7]"
                                />
                            </div>

                            <div className="relative sm:w-40">
                                <Icon
                                    name="filter"
                                    className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8793a3]"
                                />
                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(event.target.value)
                                    }
                                    className="h-9 w-full appearance-none rounded-md border border-[#dfe5ec] bg-white pl-9 pr-3 text-[11px] text-[#52647a] outline-none focus:border-[#7898bd]"
                                >
                                    <option value="">All statuses</option>
                                    <option value="Planned">Planned</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="h-9 rounded-md bg-[#304b6b] px-5 text-[11px] font-medium text-white transition hover:bg-[#243c58]"
                            >
                                Search
                            </button>

                            {(searchTerm || statusFilter) && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="h-9 rounded-md border border-[#dfe5ec] px-4 text-[11px] font-medium text-[#65758a] transition hover:bg-[#f8fafc]"
                                >
                                    Clear
                                </button>
                            )}
                        </form>
                    </section>

                    {/* Project table */}
                    <section className="overflow-hidden rounded-md border border-[#e3e8ef] bg-white">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8edf2] px-4 py-3">
                            <div>
                                <h2 className="text-[13px] font-semibold text-[#293d55]">
                                    Project List
                                </h2>
                                <p className="mt-1 text-[10px] text-[#8793a3]">
                                    {projects.length}{' '}
                                    {projects.length === 1
                                        ? 'project'
                                        : 'projects'}{' '}
                                    found
                                </p>
                            </div>

                            <span className="rounded-md border border-[#e3e8ef] bg-[#f8fafc] px-2.5 py-1.5 text-[9px] text-[#718096]">
                                Updated project records
                            </span>
                        </div>

                        {projects.length === 0 ? (
                            <div className="px-4 py-12 text-center">
                                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#edf3fa] text-[#52739b]">
                                    <Icon
                                        name="folder"
                                        className="h-5 w-5"
                                    />
                                </div>
                                <h3 className="mt-3 text-[12px] font-semibold text-[#354960]">
                                    No projects found
                                </h3>
                                <p className="mx-auto mt-1 max-w-sm text-[10px] leading-5 text-[#8793a3]">
                                    Try another project name or location, or
                                    clear your filters to view all projects.
                                </p>
                                {(searchTerm || statusFilter) && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="mt-3 text-[10px] font-medium text-[#416b9f] hover:underline"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[760px] text-left">
                                    <thead className="bg-[#f8fafc]">
                                        <tr className="text-[9px] font-semibold uppercase tracking-wide text-[#8290a1]">
                                            <th className="px-4 py-3">
                                                Project
                                            </th>
                                            <th className="px-4 py-3">
                                                Budget
                                            </th>
                                            <th className="px-4 py-3">
                                                Target Completion
                                            </th>
                                            <th className="px-4 py-3">
                                                Status
                                            </th>
                                            <th className="px-4 py-3">
                                                Progress
                                            </th>
                                            <th className="px-4 py-3">
                                                Details
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-[#edf0f4]">
                                        {projects.map((project) => {
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
                                                    className="transition hover:bg-[#fafbfd]"
                                                >
                                                    <td className="px-4 py-3.5">
                                                        <p className="max-w-[230px] truncate text-[11px] font-medium text-[#354960]">
                                                            {project.project_name ||
                                                                'Untitled Project'}
                                                        </p>
                                                        <p className="mt-1 text-[10px] text-[#8793a3]">
                                                            {project.location ||
                                                                'Location not specified'}
                                                        </p>
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-3.5 text-[10px] text-[#5d6d81]">
                                                        {formatBudget(
                                                            project.budget
                                                        )}
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-3.5 text-[10px] text-[#5d6d81]">
                                                        {formatDate(
                                                            project.target_completion_date
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3.5">
                                                        <StatusBadge
                                                            status={
                                                                project.status
                                                            }
                                                        />
                                                    </td>

                                                    <td className="px-4 py-3.5">
                                                        <div className="w-24">
                                                            <div className="mb-1.5 flex items-center justify-between text-[9px] text-[#7c8a9b]">
                                                                <span>
                                                                    Progress
                                                                </span>
                                                                <span className="font-medium text-[#52647a]">
                                                                    {progress}%
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 overflow-hidden rounded-full bg-[#e9edf2]">
                                                                <div
                                                                    className="h-full rounded-full bg-[#5278ae] transition-all"
                                                                    style={{
                                                                        width: `${progress}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3.5">
                                                        <Link
                                                            href={`/citizen/projects/${project.id}`}
                                                            className="inline-flex items-center gap-1 whitespace-nowrap text-[10px] font-medium text-[#416b9f] hover:text-[#244a79] hover:underline"
                                                        >
                                                            View details
                                                            <Icon
                                                                name="arrow"
                                                                className="h-3 w-3"
                                                            />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="border-t border-[#e8edf2] bg-[#fbfcfd] px-4 py-2.5 text-[9px] text-[#929eac]">
                            Project progress reflects the latest recorded
                            information provided by the responsible office.
                        </div>
                    </section>
                </main>
            </div>
        </DashboardLayout>
    );
}
