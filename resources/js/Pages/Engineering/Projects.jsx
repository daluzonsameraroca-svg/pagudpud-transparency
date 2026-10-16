import { Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';

const STATUS_OPTIONS = [
    'Planned',
    'Ongoing',
    'Completed',
    'Suspended',
];

const STATUS_STYLES = {
    Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    Ongoing: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    Planned: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    Suspended: 'bg-red-50 text-red-700 ring-red-600/20',
};

export default function Projects({ projects = [] }) {
    const [updatingProject, setUpdatingProject] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        status: '',
        progress: 0,
        update_description: '',
        update_date: '',
    });

    const totalProjects = projects.length;
    const ongoingCount = projects.filter(
        (project) => project.status === 'Ongoing',
    ).length;
    const completedCount = projects.filter(
        (project) => project.status === 'Completed',
    ).length;
    const plannedCount = projects.filter(
        (project) => project.status === 'Planned',
    ).length;
    const suspendedCount = projects.filter(
        (project) => project.status === 'Suspended',
    ).length;

    const filteredProjects = useMemo(() => {
        const query = search.trim().toLowerCase();

        return projects.filter((project) => {
            const matchesSearch =
                !query ||
                (project.project_name || '').toLowerCase().includes(query) ||
                (project.location || '').toLowerCase().includes(query) ||
                (project.description || '').toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === 'All' ||
                project.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [projects, search, statusFilter]);

    const openUpdateForm = (project) => {
        setUpdatingProject(project.id);

        setForm({
            status: project.status || 'Planned',
            progress: Math.min(
                100,
                Math.max(0, Number(project.progress ?? 0)),
            ),
            update_description: '',
            update_date: new Date().toLocaleDateString('en-CA'),
        });
    };

    const closeUpdateForm = () => {
        setUpdatingProject(null);
        setIsSubmitting(false);

        setForm({
            status: '',
            progress: 0,
            update_description: '',
            update_date: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: name === 'progress' ? Number(value) : value,
        }));
    };

    const submitUpdate = (e, projectId) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        router.put(
            `/engineering/projects/${projectId}`,
            {
                status: form.status,
                progress: Number(form.progress),
                update_description: form.update_description,
                update_date: form.update_date,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    closeUpdateForm();
                },

                onError: () => {
                    setIsSubmitting(false);
                },

                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const formatBudget = (budget) =>
        `₱${Number(budget || 0).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    const formatDate = (date) => {
        if (!date) return 'Not set';

        const parsed = new Date(`${date}T00:00:00`);

        if (Number.isNaN(parsed.getTime())) return date;

        return parsed.toLocaleDateString('en-PH', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getProgress = (progress) =>
        Math.min(100, Math.max(0, Number(progress || 0)));

    const summaryCards = [
        {
            label: 'Total Projects',
            value: totalProjects,
            color: 'bg-slate-100 text-slate-700',
            icon: '▤',
        },
        {
            label: 'Ongoing',
            value: ongoingCount,
            color: 'bg-blue-50 text-blue-700',
            icon: '◷',
        },
        {
            label: 'Completed',
            value: completedCount,
            color: 'bg-emerald-50 text-emerald-700',
            icon: '✓',
        },
        {
            label: 'Planned',
            value: plannedCount,
            color: 'bg-amber-50 text-amber-700',
            icon: '▦',
        },
    ];

    return (
        <DashboardLayout role="engineering">
            <div className="min-h-screen bg-[#f4f6f9] text-slate-800">
                {/* Page header */}
                <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
                    <div className="mx-auto flex max-w-[1500px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
                                <span>Engineering Office</span>
                                <span>/</span>
                                <span className="font-medium text-slate-700">
                                    Projects
                                </span>
                            </div>

                            <h1 className="text-xl font-bold tracking-tight text-[#20334b] sm:text-2xl">
                                Projects
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage project records and update official
                                status and progress.
                            </p>
                        </div>

                        <Link
                            href="/engineering/projects/create"
                            className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-[#20334b] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2c4664] sm:self-center"
                        >
                            <span className="text-base">+</span>
                            Add Project
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-[1500px] px-5 py-6 sm:px-8">
                    {/* Summary cards */}
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {summaryCards.map((card) => (
                            <div
                                key={card.label}
                                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-medium text-slate-500">
                                        {card.label}
                                    </p>

                                    <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold ${card.color}`}
                                    >
                                        {card.icon}
                                    </span>
                                </div>

                                <p className="mt-2 text-2xl font-bold text-[#20334b]">
                                    {card.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Suspended project notice */}
                    {suspendedCount > 0 && (
                        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-sm font-bold text-red-700">
                                !
                            </span>

                            <div>
                                <p className="text-xs font-semibold text-red-800">
                                    Suspended Projects
                                </p>
                                <p className="mt-1 text-xs leading-5 text-red-700">
                                    {suspendedCount}{' '}
                                    {suspendedCount === 1
                                        ? 'project is'
                                        : 'projects are'}{' '}
                                    currently marked as suspended.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Search and filters */}
                    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-[#20334b]">
                                    Project Records
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Search projects and filter them by status.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(220px,1fr)_180px] lg:w-[520px]">
                                <div>
                                    <label
                                        htmlFor="project-search"
                                        className="mb-1.5 block text-xs font-medium text-slate-600"
                                    >
                                        Search projects
                                    </label>

                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                            ⌕
                                        </span>

                                        <input
                                            id="project-search"
                                            type="search"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            placeholder="Name, location, description..."
                                            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="status-filter"
                                        className="mb-1.5 block text-xs font-medium text-slate-600"
                                    >
                                        Filter by status
                                    </label>

                                    <select
                                        id="status-filter"
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="All">
                                            All statuses
                                        </option>

                                        {STATUS_OPTIONS.map((status) => (
                                            <option
                                                key={status}
                                                value={status}
                                            >
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {(search || statusFilter !== 'All') && (
                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                                <p className="text-xs text-slate-500">
                                    Showing {filteredProjects.length} of{' '}
                                    {totalProjects} projects
                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setStatusFilter('All');
                                    }}
                                    className="text-xs font-semibold text-blue-700 hover:text-blue-900"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Project list */}
                    <section className="mt-4 space-y-4">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => {
                                const progress = getProgress(project.progress);
                                const isEditing =
                                    updatingProject === project.id;

                                return (
                                    <article
                                        key={project.id}
                                        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                                    >
                                        {/* Project heading */}
                                        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:px-5 md:flex-row md:items-start md:justify-between">
                                            <div className="flex min-w-0 items-start gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg text-slate-600">
                                                    ▤
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="break-words text-sm font-semibold text-[#20334b]">
                                                        {project.project_name ||
                                                            'Untitled Project'}
                                                    </h3>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        <span className="mr-1">
                                                            📍
                                                        </span>
                                                        {project.location ||
                                                            'Location not specified'}
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${
                                                    STATUS_STYLES[
                                                        project.status
                                                    ] ||
                                                    'bg-slate-100 text-slate-600 ring-slate-500/20'
                                                }`}
                                            >
                                                {project.status || 'Unknown'}
                                            </span>
                                        </div>

                                        {/* Project information */}
                                        <div className="grid grid-cols-2 gap-x-5 gap-y-5 px-4 py-5 sm:grid-cols-4 sm:px-5">
                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                    Budget
                                                </p>
                                                <p className="mt-1.5 break-words text-sm font-semibold text-slate-800">
                                                    {formatBudget(
                                                        project.budget,
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                    Start Date
                                                </p>
                                                <p className="mt-1.5 text-xs font-medium text-slate-700">
                                                    {formatDate(
                                                        project.start_date,
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                    Target Completion
                                                </p>
                                                <p className="mt-1.5 text-xs font-medium text-slate-700">
                                                    {formatDate(
                                                        project.target_completion_date,
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                    Current Progress
                                                </p>
                                                <p className="mt-1.5 text-sm font-semibold text-[#20334b]">
                                                    {progress}%
                                                </p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {project.description && (
                                            <div className="border-t border-slate-100 px-4 py-4 sm:px-5">
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                    Description
                                                </p>
                                                <p className="mt-2 whitespace-pre-line break-words text-xs leading-5 text-slate-600">
                                                    {project.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Progress bar */}
                                        <div className="border-t border-slate-100 px-4 py-4 sm:px-5">
                                            <div className="mb-2 flex items-center justify-between">
                                                <p className="text-xs font-medium text-slate-600">
                                                    Project Progress
                                                </p>
                                                <p className="text-xs font-semibold text-[#20334b]">
                                                    {progress}%
                                                </p>
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
                                                            ? 'bg-emerald-500'
                                                            : project.status ===
                                                                'Suspended'
                                                              ? 'bg-red-400'
                                                              : 'bg-blue-500'
                                                    }`}
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Update action */}
                                        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                            <p className="text-[11px] leading-5 text-slate-500">
                                                Keep the official project status
                                                and progress current.
                                            </p>

                                            {!isEditing && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openUpdateForm(project)
                                                    }
                                                    className="inline-flex items-center justify-center rounded-lg bg-[#20334b] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2c4664]"
                                                >
                                                    Update Progress
                                                </button>
                                            )}
                                        </div>

                                        {/* Update form */}
                                        {isEditing && (
                                            <div className="border-t border-slate-200 bg-slate-50/70 px-4 py-5 sm:px-5">
                                                <div className="mb-5">
                                                    <h4 className="text-sm font-semibold text-[#20334b]">
                                                        Update Project Progress
                                                    </h4>
                                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                                        Record the latest official
                                                        status and implementation
                                                        progress.
                                                    </p>
                                                </div>

                                                <form
                                                    onSubmit={(e) =>
                                                        submitUpdate(
                                                            e,
                                                            project.id,
                                                        )
                                                    }
                                                    className="space-y-5"
                                                >
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        {/* Status */}
                                                        <div>
                                                            <label
                                                                htmlFor={`status-${project.id}`}
                                                                className="mb-1.5 block text-xs font-medium text-slate-700"
                                                            >
                                                                Project Status
                                                            </label>

                                                            <select
                                                                id={`status-${project.id}`}
                                                                name="status"
                                                                value={
                                                                    form.status
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                required
                                                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                            >
                                                                {STATUS_OPTIONS.map(
                                                                    (status) => (
                                                                        <option
                                                                            key={
                                                                                status
                                                                            }
                                                                            value={
                                                                                status
                                                                            }
                                                                        >
                                                                            {
                                                                                status
                                                                            }
                                                                        </option>
                                                                    ),
                                                                )}
                                                            </select>
                                                        </div>

                                                        {/* Date */}
                                                        <div>
                                                            <label
                                                                htmlFor={`date-${project.id}`}
                                                                className="mb-1.5 block text-xs font-medium text-slate-700"
                                                            >
                                                                Update Date
                                                            </label>

                                                            <input
                                                                id={`date-${project.id}`}
                                                                type="date"
                                                                name="update_date"
                                                                value={
                                                                    form.update_date
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                required
                                                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Progress slider */}
                                                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                                                        <div className="mb-3 flex items-center justify-between gap-3">
                                                            <label
                                                                htmlFor={`progress-${project.id}`}
                                                                className="text-xs font-medium text-slate-700"
                                                            >
                                                                Completion Progress
                                                            </label>

                                                            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-sm font-bold text-blue-700">
                                                                {form.progress}%
                                                            </span>
                                                        </div>

                                                        <input
                                                            id={`progress-${project.id}`}
                                                            type="range"
                                                            name="progress"
                                                            min="0"
                                                            max="100"
                                                            step="1"
                                                            value={
                                                                form.progress
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            className="w-full cursor-pointer accent-blue-600"
                                                        />

                                                        <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                                                            <span>0%</span>
                                                            <span>25%</span>
                                                            <span>50%</span>
                                                            <span>75%</span>
                                                            <span>100%</span>
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    <div>
                                                        <label
                                                            htmlFor={`description-${project.id}`}
                                                            className="mb-1.5 block text-xs font-medium text-slate-700"
                                                        >
                                                            Update Description
                                                        </label>

                                                        <textarea
                                                            id={`description-${project.id}`}
                                                            name="update_description"
                                                            value={
                                                                form.update_description
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            rows={3}
                                                            placeholder="Describe completed work, recent developments, or issues encountered..."
                                                            className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs leading-5 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                        />
                                                    </div>

                                                    {/* Buttons */}
                                                    <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                closeUpdateForm
                                                            }
                                                            disabled={
                                                                isSubmitting
                                                            }
                                                            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            Cancel
                                                        </button>

                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                isSubmitting
                                                            }
                                                            className="rounded-lg bg-[#20334b] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2c4664] disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {isSubmitting
                                                                ? 'Saving Update...'
                                                                : 'Save Update'}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}
                                    </article>
                                );
                            })
                        ) : (
                            <div className="rounded-xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl text-slate-500">
                                    ▤
                                </div>

                                <h3 className="mt-4 text-sm font-semibold text-[#20334b]">
                                    {projects.length === 0
                                        ? 'No projects available'
                                        : 'No matching projects'}
                                </h3>

                                <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                                    {projects.length === 0
                                        ? 'There are currently no project records. Add a project to get started.'
                                        : 'Try another search term or change the status filter.'}
                                </p>

                                {projects.length === 0 ? (
                                    <Link
                                        href="/engineering/projects/create"
                                        className="mt-4 inline-flex rounded-lg bg-[#20334b] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2c4664]"
                                    >
                                        Add First Project
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch('');
                                            setStatusFilter('All');
                                        }}
                                        className="mt-4 text-xs font-semibold text-blue-700 hover:text-blue-900"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        )}
                    </section>

                    <footer className="mt-8 border-t border-slate-200 py-4 text-center text-[10px] text-slate-400">
                        Pagudpud Transparency · Engineering Office
                    </footer>
                </main>
            </div>
        </DashboardLayout>
    );
}
