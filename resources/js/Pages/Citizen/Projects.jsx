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
            <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        ),
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
        Ongoing: 'bg-blue-50 text-blue-700',
        Completed: 'bg-blue-50 text-blue-700',
        Planned: 'bg-amber-50 text-amber-700',
        Suspended: 'bg-red-50 text-red-700',
    };

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-medium ${
                styles[status] || 'bg-slate-100 text-slate-600'
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

    const amount = Number(budget);

    if (!Number.isFinite(amount)) {
        return '—';
    }

    return amount.toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2,
    });
}

function formatDate(date) {
    if (!date) return 'Not specified';

    const parts = String(date).slice(0, 10).split('-');

    if (parts.length === 3) {
        const [year, month, day] = parts.map(Number);

        if (
            Number.isInteger(year) &&
            Number.isInteger(month) &&
            Number.isInteger(day)
        ) {
            const parsed = new Date(year, month - 1, day);

            if (
                parsed.getFullYear() === year &&
                parsed.getMonth() === month - 1 &&
                parsed.getDate() === day
            ) {
                return parsed.toLocaleDateString('en-PH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });
            }
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
            <div className="min-h-screen bg-slate-50">
                <header className="flex h-12 items-center justify-end border-b border-slate-200 bg-white px-5 sm:px-7">
                    <span className="hidden text-[10px] text-slate-500 sm:inline">
                        Public Project Records
                    </span>
                </header>

                <main className="space-y-5 px-5 py-5 sm:px-7">
                    <section>
                        <h1 className="text-[19px] font-semibold tracking-tight text-slate-800">
                            Government Projects
                        </h1>

                    </section>

                    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center gap-2">
                            <Icon
                                name="search"
                                className="h-4 w-4 text-blue-700"
                            />

                            <h2 className="text-[12px] font-semibold text-slate-800">
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
                                    className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                    placeholder="Search by project name or location..."
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="relative sm:w-40">
                                <Icon
                                    name="filter"
                                    className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
                                />

                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(event.target.value)
                                    }
                                    className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[11px] text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                                className="h-9 rounded-lg bg-blue-700 px-5 text-[11px] font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
                            >
                                Search
                            </button>

                            {(searchTerm || statusFilter) && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="h-9 rounded-lg border border-slate-200 px-4 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50"
                                >
                                    Clear
                                </button>
                            )}
                        </form>
                    </section>

                    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                            <div>
                                <h2 className="text-[13px] font-semibold text-slate-800">
                                    Project List
                                </h2>

                                <p className="mt-1 text-[10px] text-slate-500">
                                    {projects.length}{' '}
                                    {projects.length === 1
                                        ? 'project'
                                        : 'projects'}{' '}
                                    found
                                </p>
                            </div>

                            <span className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-[9px] text-blue-700">
                                Updated project records
                            </span>
                        </div>

                        {projects.length === 0 ? (
                            <div className="px-4 py-12 text-center">
                                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                                    <Icon
                                        name="folder"
                                        className="h-5 w-5"
                                    />
                                </div>

                                <h3 className="mt-3 text-[12px] font-semibold text-slate-800">
                                    No projects found
                                </h3>

                                {(searchTerm || statusFilter) && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="mt-3 text-[10px] font-medium text-blue-700 hover:text-blue-900 hover:underline"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[760px] text-left">
                                    <thead className="bg-slate-50">
                                        <tr className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                                            <th className="px-4 py-3">
                                                Project
                                            </th>
                                            <th className="px-4 py-3">
                                                Implementing Office
                                            </th>
                                            <th className="px-4 py-3">
                                                Contractor
                                            </th>
                                            <th className="px-4 py-3">
                                                Cost
                                            </th>
                                            <th className="px-4 py-3">
                                                Completion Date
                                            </th>
                                            <th className="px-4 py-3">
                                                Status
                                            </th>
                                            <th className="px-4 py-3">
                                                Accomplishment
                                            </th>
                                            <th className="px-4 py-3">
                                                Report
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {projects.map((project) => {
                                            const numericProgress = Number(
                                                project.progress || 0
                                            );

                                            const progress = Number.isFinite(
                                                numericProgress
                                            )
                                                ? Math.min(
                                                      100,
                                                      Math.max(
                                                          0,
                                                          numericProgress
                                                      )
                                                  )
                                                : 0;

                                            return (
                                                <tr
                                                    key={project.id}
                                                    className="transition hover:bg-blue-50/40"
                                                >
                                                    <td className="px-4 py-3.5">
                                                        <p className="max-w-[230px] truncate text-[11px] font-medium text-slate-700">
                                                            {project.project_name ||
                                                                'Untitled Project'}
                                                        </p>

                                                        <p className="mt-1 text-[10px] text-slate-500">
                                                            {project.location ||
                                                                'Location not specified'}
                                                        </p>
                                                    </td>

                                                    <td className="max-w-[180px] px-4 py-3.5 text-[10px] text-slate-600">
                                                        {project.implementing_office ||
                                                            'Not specified'}
                                                    </td>

                                                    <td className="max-w-[180px] px-4 py-3.5 text-[10px] text-slate-600">
                                                        {project.contractor ||
                                                            'Not specified'}
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-3.5 text-[10px] text-slate-600">
                                                        {formatBudget(
                                                            project.budget
                                                        )}
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-3.5 text-[10px] text-slate-600">
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
                                                            <div className="mb-1.5 flex items-center justify-between text-[9px] text-slate-500">
                                                                <span>
                                                                    Progress
                                                                </span>

                                                                <span className="font-medium text-slate-700">
                                                                    {progress}%
                                                                </span>
                                                            </div>

                                                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                                                <div
                                                                    className="h-full rounded-full bg-blue-600 transition-all"
                                                                    style={{
                                                                        width: `${progress}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3.5">
                                                        <Link
                                                            href={`/citizen/projects/${project.id}#project-feedback`}
                                                            className="inline-flex items-center gap-1 whitespace-nowrap text-[10px] font-medium text-blue-700 hover:text-blue-900 hover:underline"
                                                        >
                                                            View &amp; report
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-[9px] text-slate-500">
                            Project progress reflects the latest recorded
                            information provided by the responsible office.
                        </div>
                    </section>
                </main>
            </div>
        </DashboardLayout>
    );
}
