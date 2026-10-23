import { router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import PagudpudProjectLocationFields from '../../Components/PagudpudProjectLocationFields';
import usePagudpudBarangays from '../../Hooks/usePagudpudBarangays';
import DashboardLayout from '../../Layouts/DashboardLayout';
import {
    formatPagudpudProjectLocation,
    parsePagudpudProjectLocation,
} from '../../Utils/pagudpudProjectLocation';

export default function Projects({ projects = [] }) {
    const {
        barangays,
        loading: barangaysLoading,
        error: barangaysError,
        retry: retryBarangays,
    } = usePagudpudBarangays();
    const [editingProject, setEditingProject] = useState(null);
    const [deletingProject, setDeletingProject] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const emptyForm = {
        project_name: '',
        description: '',
        location: '',
        barangay: '',
        sitio: '',
        budget: '',
        start_date: '',
        target_completion_date: '',
        status: 'Planned',
        progress: 0,
    };

    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (!editingProject || barangays.length === 0) return;

        const project = projects.find(
            (item) => item.id === editingProject,
        );

        if (!project) return;

        const location = parsePagudpudProjectLocation(
            project.location,
            barangays,
        );

        setForm((current) => ({
            ...current,
            location: formatPagudpudProjectLocation(
                location.sitio,
                location.barangay,
            ) || current.location,
            barangay: location.barangay,
            sitio: location.sitio,
        }));
    }, [barangays, editingProject, projects]);

    const projectStatuses = [
        {
            label: 'Total Projects',
            status: null,
            color: 'text-slate-900',
            icon: '▦',
            iconClass: 'bg-emerald-50 text-emerald-700',
        },
        {
            label: 'Ongoing',
            status: 'Ongoing',
            color: 'text-blue-700',
            icon: '◷',
            iconClass: 'bg-blue-50 text-blue-700',
        },
        {
            label: 'Completed',
            status: 'Completed',
            color: 'text-emerald-700',
            icon: '✓',
            iconClass: 'bg-emerald-50 text-emerald-700',
        },
        {
            label: 'Planned',
            status: 'Planned',
            color: 'text-amber-700',
            icon: '◌',
            iconClass: 'bg-amber-50 text-amber-700',
        },
        {
            label: 'Suspended',
            status: 'Suspended',
            color: 'text-red-700',
            icon: '!',
            iconClass: 'bg-red-50 text-red-700',
        },
    ];

    const getStatusClass = (status) => {
        const classes = {
            Completed: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
            Ongoing: 'bg-blue-50 text-blue-800 ring-blue-600/20',
            Planned: 'bg-amber-50 text-amber-800 ring-amber-600/20',
            Suspended: 'bg-red-50 text-red-800 ring-red-600/20',
        };

        return classes[status] || 'bg-slate-100 text-slate-700 ring-slate-500/20';
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
            barangay: '',
            sitio: '',
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

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleLocationChange = (field, value) => {
        const nextForm = { ...form, [field]: value };

        setForm({
            ...nextForm,
            location: formatPagudpudProjectLocation(
                nextForm.sitio,
                nextForm.barangay,
            ),
        });
    };

    const saveProject = (e, projectId) => {
        e.preventDefault();
        if (isSaving) return;

        setIsSaving(true);

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
                onFinish: () => setIsSaving(false),
            },
        );
    };

    const confirmDelete = () => {
        if (!deletingProject || isDeleting) return;

        setIsDeleting(true);

        router.delete(`/admin/projects/${deletingProject.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeletingProject(null),
            onFinish: () => setIsDeleting(false),
        });
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('All');
    };

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-slate-50 text-slate-800">
                <header className="border-b border-slate-200 bg-white px-5 py-6 sm:px-8">
                    <div className="mx-auto flex max-w-[1500px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="sm:col-span-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Project Management
                            </h1>

                        </div>

                        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            {projects.length} project records
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1500px] space-y-7 px-5 py-7 sm:px-8">
                    <section>
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-slate-900">
                                Project Overview
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
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
                                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-sm font-medium leading-5 text-slate-600">
                                                {item.label}
                                            </p>

                                            <span
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${item.iconClass}`}
                                            >
                                                {item.icon}
                                            </span>
                                        </div>

                                        <p
                                            className={`mt-4 text-3xl font-bold tracking-tight ${item.color}`}
                                        >
                                            {count}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        All Projects
                                    </h2>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400">
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
                                            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:w-64"
                                        />
                                    </div>

                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                        aria-label="Filter projects by status"
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                    >
                                        <option value="All">All statuses</option>
                                        <option value="Planned">Planned</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {filteredProjects.length === 0 ? (
                            <div className="px-5 py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-700">
                                    ▦
                                </div>

                                <h3 className="mt-4 text-lg font-bold text-slate-900">
                                    {projects.length === 0
                                        ? 'No projects found'
                                        : 'No matching projects'}
                                </h3>


                                {(search || statusFilter !== 'All') && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="mt-5 rounded-lg px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
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
                                        Math.max(0, Number(project.progress || 0)),
                                    );

                                    const isEditing =
                                        editingProject === project.id;

                                    return (
                                        <article
                                            key={project.id}
                                            className="transition hover:bg-slate-50/70"
                                        >
                                            <div className="p-5 sm:p-6">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <h3 className="break-words text-base font-bold leading-6 text-slate-900 sm:text-lg">
                                                                {project.project_name}
                                                            </h3>

                                                            <span
                                                                className={`inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${getStatusClass(project.status)}`}
                                                            >
                                                                {project.status || 'Unknown'}
                                                            </span>
                                                        </div>

                                                        <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-slate-600">
                                                            <span aria-hidden="true">📍</span>
                                                            <span>
                                                                {project.location ||
                                                                    'Location not specified'}
                                                            </span>
                                                        </p>

                                                        {project.description && (
                                                            <p className="mt-3 max-w-3xl whitespace-pre-line break-words text-sm leading-7 text-slate-600">
                                                                {project.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex shrink-0 flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                isEditing
                                                                    ? closeEditForm()
                                                                    : openEditForm(project)
                                                            }
                                                            className="rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                                                        >
                                                            {isEditing
                                                                ? 'Close Editor'
                                                                : 'Edit Project'}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setDeletingProject(project)
                                                            }
                                                            className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                                    <div className="rounded-xl bg-slate-50 p-4">
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                            Budget
                                                        </p>
                                                        <p className="mt-2 break-words text-base font-bold text-slate-900">
                                                            {formatBudget(project.budget)}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-slate-50 p-4">
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                            Start Date
                                                        </p>
                                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                                            {formatDate(project.start_date)}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-slate-50 p-4">
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                            Target Completion
                                                        </p>
                                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                                            {formatDate(
                                                                project.target_completion_date,
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-slate-50 p-4">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                                Progress
                                                            </p>
                                                            <span className="text-sm font-bold text-slate-900">
                                                                {progress}%
                                                            </span>
                                                        </div>

                                                        <div
                                                            className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200"
                                                            role="progressbar"
                                                            aria-label={`${project.project_name} progress`}
                                                            aria-valuenow={progress}
                                                            aria-valuemin={0}
                                                            aria-valuemax={100}
                                                        >
                                                            <div
                                                                className={`h-full rounded-full transition-all ${
                                                                    project.status === 'Completed'
                                                                        ? 'bg-emerald-500'
                                                                        : project.status === 'Suspended'
                                                                          ? 'bg-red-400'
                                                                          : project.status === 'Planned'
                                                                            ? 'bg-amber-500'
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

                                            {isEditing && (
                                                <div className="border-t border-emerald-100 bg-emerald-50/40 px-5 py-6 sm:px-6">
                                                    <div className="mb-5">
                                                        <h4 className="text-lg font-bold text-slate-900">
                                                            Edit Project Information
                                                        </h4>
                                                    </div>

                                                    <form
                                                        onSubmit={(e) =>
                                                            saveProject(e, project.id)
                                                        }
                                                        className="space-y-5"
                                                    >
                                                        <div className="grid gap-5 sm:grid-cols-2">
                                                            <div className="sm:col-span-2">
                                                                <label
                                                                    htmlFor={`project_name-${project.id}`}
                                                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                                                >
                                                                    Project Name
                                                                </label>
                                                                <input
                                                                    id={`project_name-${project.id}`}
                                                                    type="text"
                                                                    name="project_name"
                                                                    value={form.project_name}
                                                                    onChange={handleChange}
                                                                    required
                                                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                                                />
                                                            </div>

                                                            <div className="sm:col-span-2">
                                                                <label
                                                                    htmlFor={`description-${project.id}`}
                                                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                                                >
                                                                    Description
                                                                </label>
                                                                <textarea
                                                                    id={`description-${project.id}`}
                                                                    name="description"
                                                                    value={form.description}
                                                                    onChange={handleChange}
                                                                    rows={4}
                                                                    className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                                                />
                                                            </div>

                                                            <div className="sm:col-span-2">
                                                                <h5 className="mb-2 text-sm font-semibold text-slate-700">
                                                                    Location
                                                                </h5>
                                                                <PagudpudProjectLocationFields
                                                                    idPrefix={`project-${project.id}-location`}
                                                                    barangay={form.barangay}
                                                                    sitio={form.sitio}
                                                                    onChange={handleLocationChange}
                                                                    barangays={barangays}
                                                                    loading={barangaysLoading}
                                                                    barangaysError={barangaysError}
                                                                    retry={retryBarangays}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label
                                                                    htmlFor={`budget-${project.id}`}
                                                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                                                >
                                                                    Budget (₱)
                                                                </label>
                                                                <input
                                                                    id={`budget-${project.id}`}
                                                                    type="number"
                                                                    name="budget"
                                                                    value={form.budget}
                                                                    onChange={handleChange}
                                                                    min="0"
                                                                    step="0.01"
                                                                    required
                                                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label
                                                                    htmlFor={`start_date-${project.id}`}
                                                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                                                >
                                                                    Start Date
                                                                </label>
                                                                <input
                                                                    id={`start_date-${project.id}`}
                                                                    type="date"
                                                                    name="start_date"
                                                                    value={form.start_date}
                                                                    onChange={handleChange}
                                                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label
                                                                    htmlFor={`target_completion_date-${project.id}`}
                                                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                                                >
                                                                    Target Completion Date
                                                                </label>
                                                                <input
                                                                    id={`target_completion_date-${project.id}`}
                                                                    type="date"
                                                                    name="target_completion_date"
                                                                    value={form.target_completion_date}
                                                                    onChange={handleChange}
                                                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label
                                                                    htmlFor={`status-${project.id}`}
                                                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                                                >
                                                                    Project Status
                                                                </label>
                                                                <select
                                                                    id={`status-${project.id}`}
                                                                    name="status"
                                                                    value={form.status}
                                                                    onChange={handleChange}
                                                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                                                >
                                                                    <option value="Planned">Planned</option>
                                                                    <option value="Ongoing">Ongoing</option>
                                                                    <option value="Completed">Completed</option>
                                                                    <option value="Suspended">Suspended</option>
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <div className="mb-3 flex items-center justify-between gap-3">
                                                                    <label
                                                                        htmlFor={`progress-${project.id}`}
                                                                        className="text-sm font-semibold text-slate-700"
                                                                    >
                                                                        Project Progress
                                                                    </label>
                                                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
                                                                        {form.progress}%
                                                                    </span>
                                                                </div>
                                                                <input
                                                                    id={`progress-${project.id}`}
                                                                    type="range"
                                                                    name="progress"
                                                                    min="0"
                                                                    max="100"
                                                                    value={form.progress}
                                                                    onChange={handleChange}
                                                                    className="w-full cursor-pointer accent-emerald-600"
                                                                />
                                                                <div className="mt-2 flex justify-between text-xs text-slate-500">
                                                                    <span>0%</span>
                                                                    <span>100%</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col-reverse gap-3 border-t border-emerald-100 pt-5 sm:flex-row sm:justify-end">
                                                            <button
                                                                type="button"
                                                                onClick={closeEditForm}
                                                                disabled={isSaving}
                                                                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                                                            >
                                                                Cancel
                                                            </button>

                                                            <button
                                                                type="submit"
                                                                disabled={
                                                                    isSaving ||
                                                                    barangaysLoading ||
                                                                    Boolean(barangaysError) ||
                                                                    !form.barangay
                                                                }
                                                                className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                {isSaving
                                                                    ? 'Saving Changes...'
                                                                    : 'Save Changes'}
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

                        <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing{' '}
                                <strong className="font-bold text-slate-900">
                                    {filteredProjects.length}
                                </strong>{' '}
                                of{' '}
                                <strong className="font-bold text-slate-900">
                                    {projects.length}
                                </strong>{' '}
                                projects
                            </span>

                            <span className="text-xs text-slate-500">
                                Project information management · Pagudpud Transparency
                            </span>
                        </div>
                    </section>
                </main>
            </div>

            {deletingProject && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
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
                        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl font-bold text-red-600">
                            !
                        </div>

                        <h2
                            id="delete-modal-title"
                            className="mt-5 text-xl font-bold text-slate-900"
                        >
                            Delete Project?
                        </h2>

                        <p className="mt-3 break-words text-sm leading-7 text-slate-600">
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-slate-900">
                                {deletingProject.project_name}
                            </span>
                            ?
                        </p>

                        <p className="mt-2 text-sm text-red-600">
                            This action cannot be undone.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setDeletingProject(null)}
                                disabled={isDeleting}
                                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Project'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
