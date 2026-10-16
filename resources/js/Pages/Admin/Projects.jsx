import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default function Projects({ projects = [] }) {
    const [editingProject, setEditingProject] = useState(null);
    const [deletingProject, setDeletingProject] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const emptyForm = {
        project_name: '',
        description: '',
        location: '',
        budget: '',
        start_date: '',
        target_completion_date: '',
        status: 'Planned',
        progress: 0,
    };

    const [form, setForm] = useState(emptyForm);

    const projectStatuses = [
        { label: 'Total Projects', status: null, color: 'text-slate-900', icon: '▦' },
        { label: 'Ongoing', status: 'Ongoing', color: 'text-blue-600', icon: '◷' },
        { label: 'Completed', status: 'Completed', color: 'text-emerald-600', icon: '✓' },
        { label: 'Planned', status: 'Planned', color: 'text-amber-600', icon: '◌' },
        { label: 'Suspended', status: 'Suspended', color: 'text-red-600', icon: '!' },
    ];

    const getStatusClass = (status) => {
        const classes = {
            Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
            Ongoing: 'bg-blue-50 text-blue-700 ring-blue-600/20',
            Planned: 'bg-amber-50 text-amber-700 ring-amber-600/20',
            Suspended: 'bg-red-50 text-red-700 ring-red-600/20',
        };

        return classes[status] || 'bg-slate-100 text-slate-600 ring-slate-500/20';
    };

    const formatDate = (date) => {
        if (!date) return 'Not specified';

        const normalizedDate = String(date).slice(0, 10);
        const parsedDate = new Date(`${normalizedDate}T00:00:00`);

        if (Number.isNaN(parsedDate.getTime())) return 'Not specified';

        return parsedDate.toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatBudget = (budget) =>
        `₱${Number(budget || 0).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    const filteredProjects = useMemo(() => {
        const query = search.trim().toLowerCase();

        return projects.filter((project) => {
            const matchesSearch =
                !query ||
                [
                    project.project_name,
                    project.location,
                    project.description,
                    project.status,
                ].some((value) =>
                    String(value || '').toLowerCase().includes(query),
                );

            const matchesStatus =
                statusFilter === 'All' || project.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [projects, search, statusFilter]);

    const openEditForm = (project) => {
        setEditingProject(project.id);
        setForm({
            project_name: project.project_name || '',
            description: project.description || '',
            location: project.location || '',
            budget: project.budget ?? '',
            start_date: project.start_date
                ? String(project.start_date).slice(0, 10)
                : '',
            target_completion_date: project.target_completion_date
                ? String(project.target_completion_date).slice(0, 10)
                : '',
            status: project.status || 'Planned',
            progress: project.progress ?? 0,
        });
    };

    const closeEditForm = () => {
        setEditingProject(null);
        setForm(emptyForm);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const saveProject = (e, projectId) => {
        e.preventDefault();

        router.put(
            `/admin/projects/${projectId}`,
            {
                ...form,
                budget: Number(form.budget),
                start_date: form.start_date || null,
                target_completion_date: form.target_completion_date || null,
                progress: Number(form.progress),
            },
            {
                preserveScroll: true,
                onSuccess: closeEditForm,
            },
        );
    };

    const deleteProject = (project) => {
        setDeletingProject(project);
    };

    const confirmDelete = () => {
        if (!deletingProject || isDeleting) return;

        setIsDeleting(true);

        router.delete(`/admin/projects/${deletingProject.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingProject(null);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-[#f4f6f9] text-slate-800">
                {/* Page header */}
                <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
                    <div className="mx-auto flex max-w-[1500px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
                                <span>Administrator</span>
                                <span>/</span>
                                <span className="font-medium text-slate-700">
                                    Project Management
                                </span>
                            </div>

                            <h1 className="text-xl font-bold tracking-tight text-[#20334b] sm:text-2xl">
                                Project Management
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage project records, budgets, schedules, and
                                official project information.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 sm:self-center">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            {projects.length} project records
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1500px] space-y-6 px-5 py-6 sm:px-8">
                    {/* Summary cards */}
                    <section>
                        <div className="mb-3">
                            <h2 className="text-sm font-semibold text-slate-800">
                                Project Overview
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Current count of projects by status.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                            {projectStatuses.map((item) => {
                                const count = item.status
                                    ? projects.filter(
                                          (project) =>
                                              project.status === item.status,
                                      ).length
                                    : projects.length;

                                return (
                                    <div
                                        key={item.label}
                                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-medium text-slate-500">
                                                {item.label}
                                            </p>
                                            <span
                                                className={`flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-lg ${item.color}`}
                                            >
                                                {item.icon}
                                            </span>
                                        </div>

                                        <p
                                            className={`mt-3 text-2xl font-bold ${item.color}`}
                                        >
                                            {count}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Project list */}
                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-800">
                                        All Projects
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Search and manage registered LGU
                                        projects.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            ⌕
                                        </span>
                                        <input
                                            type="search"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            placeholder="Search projects..."
                                            aria-label="Search projects"
                                            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-60"
                                        />
                                    </div>

                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                        aria-label="Filter projects by status"
                                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="All">
                                            All statuses
                                        </option>
                                        <option value="Planned">Planned</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">
                                            Completed
                                        </option>
                                        <option value="Suspended">
                                            Suspended
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {filteredProjects.length === 0 ? (
                            <div className="px-5 py-14 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl text-slate-400">
                                    ▦
                                </div>
                                <h3 className="mt-3 text-sm font-semibold text-slate-800">
                                    {projects.length === 0
                                        ? 'No projects found'
                                        : 'No matching projects'}
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    {projects.length === 0
                                        ? 'There are currently no project records.'
                                        : 'Try changing your search or status filter.'}
                                </p>
                                {(search || statusFilter !== 'All') && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch('');
                                            setStatusFilter('All');
                                        }}
                                        className="mt-3 text-xs font-semibold text-blue-700 hover:text-blue-900"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-200">
                                {filteredProjects.map((project) => {
                                    const progress = Math.min(
                                        100,
                                        Math.max(
                                            0,
                                            Number(project.progress || 0),
                                        ),
                                    );

                                    const isEditing =
                                        editingProject === project.id;

                                    return (
                                        <article
                                            key={project.id}
                                            className="transition hover:bg-slate-50/50"
                                        >
                                            {/* Project information */}
                                            <div className="p-4 sm:p-5">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="text-sm font-semibold text-[#20334b]">
                                                                {project.project_name}
                                                            </h3>
                                                            <span
                                                                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${getStatusClass(project.status)}`}
                                                            >
                                                                {project.status}
                                                            </span>
                                                        </div>

                                                        <p className="mt-1.5 text-xs text-slate-500">
                                                            <span className="mr-1 text-slate-400">
                                                                📍
                                                            </span>
                                                            {project.location ||
                                                                'Location not specified'}
                                                        </p>

                                                        {project.description && (
                                                            <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-500">
                                                                {project.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex shrink-0 gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                isEditing
                                                                    ? closeEditForm()
                                                                    : openEditForm(
                                                                          project,
                                                                      )
                                                            }
                                                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                                                        >
                                                            {isEditing
                                                                ? 'Close Editor'
                                                                : 'Edit Project'}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteProject(
                                                                    project,
                                                                )
                                                            }
                                                            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                                    <div>
                                                        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                                            Budget
                                                        </p>
                                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                                            {formatBudget(
                                                                project.budget,
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                                            Start Date
                                                        </p>
                                                        <p className="mt-1 text-xs font-medium text-slate-700">
                                                            {formatDate(
                                                                project.start_date,
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                                            Target Completion
                                                        </p>
                                                        <p className="mt-1 text-xs font-medium text-slate-700">
                                                            {formatDate(
                                                                project.target_completion_date,
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                                                Progress
                                                            </p>
                                                            <span className="text-xs font-bold text-slate-800">
                                                                {progress}%
                                                            </span>
                                                        </div>

                                                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${
                                                                    project.status ===
                                                                    'Completed'
                                                                        ? 'bg-emerald-500'
                                                                        : project.status ===
                                                                            'Suspended'
                                                                          ? 'bg-red-400'
                                                                          : 'bg-blue-600'
                                                                }`}
                                                                style={{
                                                                    width: `${progress}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Inline edit form */}
                                            {isEditing && (
                                                <div className="border-t border-slate-200 bg-slate-50 px-4 py-5 sm:px-5">
                                                    <div className="mb-4">
                                                        <h4 className="text-sm font-semibold text-[#20334b]">
                                                            Edit Project
                                                            Information
                                                        </h4>
                                                        <p className="mt-1 text-xs text-slate-500">
                                                            Update the project
                                                            record below.
                                                        </p>
                                                    </div>

                                                    <form
                                                        onSubmit={(e) =>
                                                            saveProject(
                                                                e,
                                                                project.id,
                                                            )
                                                        }
                                                        className="space-y-4"
                                                    >
                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                            <div className="sm:col-span-2">
                                                                <label
                                                                    htmlFor={`project_name-${project.id}`}
                                                                    className="mb-1.5 block text-xs font-medium text-slate-700"
                                                                >
                                                                    Project Name
                                                                </label>
                                                                <input
                                                                    id={`project_name-${project.id}`}
                                                                    type="text"
                                                                    name="project_name"
                                                                    value={
                                                                        form.project_name
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    required
                                                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                                />
                                                            </div>

                                                            <div className="sm:col-span-2">
                                                                <label
                                                                    htmlFor={`description-${project.id}`}
                                                                    className="mb-1.5 block text-xs font-medium text-slate-700"
                                                                >
                                                                    Description
                                                                </label>
                                                                <textarea
                                                                    id={`description-${project.id}`}
                                                                    name="description"
                                                                    value={
                                                                        form.description
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    rows={3}
                                                                    className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label
                                                                    htmlFor={`location-${project.id}`}
                                                                    className="mb-1.5 block text-xs font-medium text-slate-700"
                                                                >
                                                                    Location
                                                                </label>
                                                                <input
                                                                    id={`location-${project.id}`}
                                                                    type="text"
                                                                    name="location"
                                                                    value={
                                                                        form.location
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    required
                                                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label
                                                                    htmlFor={`budget-${project.id}`}
                                                                    className="mb-1.5 block text-xs font-medium text-slate-700"
                                                                >
                                                                    Budget (₱)
                                                                </label>
                                                                <input
                                                                    id={`budget-${project.id}`}
                                                                    type="number"
                                                                    name="budget"
                                                                    value={
                                                                        form.budget
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    min="0"
                                                                    step="0.01"
                                                                    required
                                                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label
                                                                    htmlFor={`start_date-${project.id}`}
                                                                    className="mb-1.5 block text-xs font-medium text-slate-700"
                                                                >
                                                                    Start Date
                                                                </label>
                                                                <input
                                                                    id={`start_date-${project.id}`}
                                                                    type="date"
                                                                    name="start_date"
                                                                    value={
                                                                        form.start_date
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label
                                                                    htmlFor={`target_completion_date-${project.id}`}
                                                                    className="mb-1.5 block text-xs font-medium text-slate-700"
                                                                >
                                                                    Target
                                                                    Completion
                                                                </label>
                                                                <input
                                                                    id={`target_completion_date-${project.id}`}
                                                                    type="date"
                                                                    name="target_completion_date"
                                                                    value={
                                                                        form.target_completion_date
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                                />
                                                            </div>

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
                                                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                                >
                                                                    <option value="Planned">
                                                                        Planned
                                                                    </option>
                                                                    <option value="Ongoing">
                                                                        Ongoing
                                                                    </option>
                                                                    <option value="Completed">
                                                                        Completed
                                                                    </option>
                                                                    <option value="Suspended">
                                                                        Suspended
                                                                    </option>
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <div className="mb-2 flex items-center justify-between">
                                                                    <label
                                                                        htmlFor={`progress-${project.id}`}
                                                                        className="text-xs font-medium text-slate-700"
                                                                    >
                                                                        Project
                                                                        Progress
                                                                    </label>
                                                                    <span className="text-xs font-bold text-blue-700">
                                                                        {form.progress}
                                                                        %
                                                                    </span>
                                                                </div>
                                                                <input
                                                                    id={`progress-${project.id}`}
                                                                    type="range"
                                                                    name="progress"
                                                                    min="0"
                                                                    max="100"
                                                                    value={
                                                                        form.progress
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    className="w-full accent-blue-600"
                                                                />
                                                                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                                                                    <span>
                                                                        0%
                                                                    </span>
                                                                    <span>
                                                                        100%
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    closeEditForm
                                                                }
                                                                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                                                            >
                                                                Cancel
                                                            </button>

                                                            <button
                                                                type="submit"
                                                                className="rounded-lg bg-[#20334b] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2c4664]"
                                                            >
                                                                Save Changes
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        )}

                        <div className="flex flex-col gap-1 border-t border-slate-200 bg-slate-50 px-4 py-3 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing {filteredProjects.length} of{' '}
                                {projects.length} projects
                            </span>
                            <span>
                                Project information management · Pagudpud
                                Transparency
                            </span>
                        </div>
                    </section>
                </main>
            </div>

            {/* Delete confirmation modal */}
            {deletingProject && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
                    onMouseDown={(e) => {
                        if (
                            e.target === e.currentTarget &&
                            !isDeleting
                        ) {
                            setDeletingProject(null);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-modal-title"
                        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-2xl"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600">
                            !
                        </div>

                        <h2
                            id="delete-modal-title"
                            className="mt-4 text-base font-bold text-slate-900"
                        >
                            Delete Project?
                        </h2>

                        <p className="mt-2 break-words text-sm leading-6 text-slate-500">
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-slate-800">
                                {deletingProject.project_name}
                            </span>
                            ?
                        </p>

                        <p className="mt-2 text-xs text-red-600">
                            This action cannot be undone.
                        </p>

                        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setDeletingProject(null)}
                                disabled={isDeleting}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="rounded-lg bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isDeleting
                                    ? 'Deleting...'
                                    : 'Delete Project'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
