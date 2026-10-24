import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import ProjectProgressLineChart from '../../Components/ProjectProgressLineChart';
import DashboardLayout from '../../Layouts/DashboardLayout';

const STATUS_OPTIONS = [
    'Planned',
    'Ongoing',
    'Completed',
    'Suspended',
];

const STATUS_STYLES = {
    Completed: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    Ongoing: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    Planned: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    Suspended: 'bg-red-50 text-red-700 ring-red-600/20',
};

export default function Projects({ projects = [] }) {
    const { props } = usePage();
    const errors = props.errors ?? {};
    const [updatingProject, setUpdatingProject] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    const [form, setForm] = useState({
        status: '',
        progress: 0,
        update_description: '',
        update_date: '',
        image: null,
        remove_image: false,
    });

    useEffect(
        () => () => {
            if (imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        },
        [imagePreview],
    );

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
        setImagePreview(project.image_url || '');

        setForm({
            status: project.status || 'Planned',
            progress: Math.min(
                100,
                Math.max(0, Number(project.progress ?? 0)),
            ),
            update_description: '',
            update_date: new Date().toLocaleDateString('en-CA'),
            image: null,
            remove_image: false,
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
            image: null,
            remove_image: false,
        });
        setImagePreview('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: name === 'progress' ? Number(value) : value,
        }));
    };

    const handleImageChange = (e) => {
        const image = e.target.files?.[0] || null;
        const currentProject = projects.find(
            (project) => project.id === updatingProject,
        );

        setForm((previous) => ({
            ...previous,
            image,
            remove_image: false,
        }));
        setImagePreview(
            image
                ? URL.createObjectURL(image)
                : currentProject?.image_url || '',
        );
    };

    const handleRemoveImageChange = (e) => {
        const removeImage = e.target.checked;
        const currentProject = projects.find(
            (project) => project.id === updatingProject,
        );

        setForm((previous) => ({
            ...previous,
            image: null,
            remove_image: removeImage,
        }));
        setImagePreview(removeImage ? '' : currentProject?.image_url || '');
    };

    const submitUpdate = (e, projectId) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        router.post(
            `/engineering/projects/${projectId}`,
            {
                _method: 'put',
                status: form.status,
                progress: Number(form.progress),
                update_description: form.update_description,
                update_date: form.update_date,
                image: form.image,
                remove_image: form.remove_image ? '1' : '0',
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
            color: 'bg-blue-50 text-blue-700',
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
            <div className="min-h-screen bg-slate-50 text-slate-800">
                <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
                    <div className="mx-auto flex max-w-[1500px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Projects
                            </h1>

                        </div>

                        <Link
                            href="/engineering/projects/create"
                            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:self-center"
                        >
                            <span className="text-lg">+</span>
                            Add Project
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

                        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
                            {summaryCards.map((card) => (
                                <div
                                    key={card.label}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-medium text-slate-500">
                                            {card.label}
                                        </p>

                                        <span
                                            className={`flex h-10 w-10 items-center justify-center rounded-xl text-base font-semibold ${card.color}`}
                                        >
                                            {card.icon}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                                        {card.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {suspendedCount > 0 && (
                        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-sm font-bold text-red-700">
                                !
                            </span>

                            <div>
                                <p className="text-sm font-bold text-red-800">
                                    Suspended Projects
                                </p>
                                <p className="mt-1 text-sm leading-6 text-red-700">
                                    {suspendedCount}{' '}
                                    {suspendedCount === 1
                                        ? 'project is'
                                        : 'projects are'}{' '}
                                    currently marked as suspended.
                                </p>
                            </div>
                        </div>
                    )}

                    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">
                                    Project Records
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(220px,1fr)_190px] lg:w-[560px]">
                                <div>
                                    <label
                                        htmlFor="project-search"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Search projects
                                    </label>

                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate-400">
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
                                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="status-filter"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Filter by status
                                    </label>

                                    <select
                                        id="status-filter"
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="All">All statuses</option>

                                        {STATUS_OPTIONS.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {(search || statusFilter !== 'All') && (
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                                <p className="text-sm text-slate-500">
                                    Showing{' '}
                                    <span className="font-semibold text-slate-800">
                                        {filteredProjects.length}
                                    </span>{' '}
                                    of {totalProjects} projects
                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setStatusFilter('All');
                                    }}
                                    className="text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </section>

                    <section className="mt-5 space-y-5">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => {
                                const progress = getProgress(project.progress);
                                const isEditing =
                                    updatingProject === project.id;

                                return (
                                    <article
                                        key={project.id}
                                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                                    >
                                        {project.image_url && (
                                            <img
                                                src={project.image_url}
                                                alt={`${project.project_name || 'Project'} photo`}
                                                className="h-56 w-full object-cover sm:h-72"
                                            />
                                        )}

                                        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:px-6 md:flex-row md:items-start md:justify-between">
                                            <div className="flex min-w-0 items-start gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                                                    ▤
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="break-words text-base font-bold text-slate-900">
                                                        {project.project_name ||
                                                            'Untitled Project'}
                                                    </h3>

                                                    <p className="mt-2 break-words text-sm text-slate-500">
                                                        <span className="mr-1">
                                                            📍
                                                        </span>
                                                        {project.location ||
                                                            'Location not specified'}
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${
                                                    STATUS_STYLES[
                                                        project.status
                                                    ] ||
                                                    'bg-slate-100 text-slate-600 ring-slate-500/20'
                                                }`}
                                            >
                                                {project.status || 'Unknown'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 gap-x-5 gap-y-6 px-5 py-6 min-[480px]:grid-cols-2 xl:grid-cols-3 sm:px-6">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                    Budget
                                                </p>
                                                <p className="mt-2 break-words text-sm font-bold text-slate-800">
                                                    {formatBudget(project.budget)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                    Start Date
                                                </p>
                                                <p className="mt-2 text-sm font-medium text-slate-700">
                                                    {formatDate(project.start_date)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                    Target Completion
                                                </p>
                                                <p className="mt-2 text-sm font-medium text-slate-700">
                                                    {formatDate(
                                                        project.target_completion_date,
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                    Current Progress
                                                </p>
                                                <p className="mt-2 text-sm font-bold text-blue-700">
                                                    {progress}%
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                    Implementing Office
                                                </p>
                                                <p className="mt-2 break-words text-sm font-medium text-slate-700">
                                                    {project.implementing_office ||
                                                        'Not specified'}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                    Contractor
                                                </p>
                                                <p className="mt-2 break-words text-sm font-medium text-slate-700">
                                                    {project.contractor ||
                                                        'Not specified'}
                                                </p>
                                            </div>
                                        </div>

                                        {project.description && (
                                            <div className="border-t border-slate-100 px-5 py-5 sm:px-6">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                    Description
                                                </p>
                                                <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                                                    {project.description}
                                                </p>
                                            </div>
                                        )}

                                        <div className="border-t border-slate-100 px-5 py-5 sm:px-6">
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-700">
                                                        Project Progress
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        Progress over time
                                                    </p>
                                                </div>
                                                <p className="text-sm font-bold text-blue-700">
                                                    {progress}%
                                                </p>
                                            </div>

                                            {project.progress_updates?.length >
                                            0 ? (
                                                <div
                                                    className="h-56 w-full"
                                                    role="img"
                                                    aria-label={`${project.project_name || 'Project'} progress history line graph`}
                                                >
                                                    <ProjectProgressLineChart
                                                        projects={[project]}
                                                        showLegend={false}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex h-56 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
                                                    No progress history
                                                    available.
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                            <p className="text-sm leading-6 text-slate-500">
                                                Keep the official project status
                                                and progress current.
                                            </p>

                                            {!isEditing && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openUpdateForm(project)
                                                    }
                                                    className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                >
                                                    Update Progress
                                                </button>
                                            )}
                                        </div>

                                        {isEditing && (
                                            <div className="border-t border-slate-200 bg-slate-50 p-5 sm:p-6">
                                                <div className="mb-5">
                                                    <h4 className="text-base font-bold text-slate-900">
                                                        Update Project Progress
                                                    </h4>
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
                                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                        <div>
                                                            <label
                                                                htmlFor={`status-${project.id}`}
                                                                className="mb-2 block text-sm font-medium text-slate-700"
                                                            >
                                                                Project Status
                                                            </label>

                                                            <select
                                                                id={`status-${project.id}`}
                                                                name="status"
                                                                value={form.status}
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                required
                                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

                                                        <div>
                                                            <label
                                                                htmlFor={`date-${project.id}`}
                                                                className="mb-2 block text-sm font-medium text-slate-700"
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
                                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                                        <div className="mb-4 flex items-center justify-between gap-3">
                                                            <label
                                                                htmlFor={`progress-${project.id}`}
                                                                className="text-sm font-semibold text-slate-700"
                                                            >
                                                                Completion
                                                                Progress
                                                            </label>

                                                            <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
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
                                                            value={form.progress}
                                                            onChange={
                                                                handleChange
                                                            }
                                                            className="w-full cursor-pointer accent-blue-600"
                                                        />

                                                        <div className="mt-3 flex justify-between text-xs text-slate-400">
                                                            <span>0%</span>
                                                            <span>25%</span>
                                                            <span>50%</span>
                                                            <span>75%</span>
                                                            <span>100%</span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label
                                                            htmlFor={`description-${project.id}`}
                                                            className="mb-2 block text-sm font-medium text-slate-700"
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
                                                            rows={4}
                                                            placeholder="Describe completed work, recent developments, or issues encountered..."
                                                            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                        />
                                                    </div>

                                                    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
                                                        <div>
                                                            <label
                                                                htmlFor={`project-image-${project.id}`}
                                                                className="block text-sm font-semibold text-slate-700"
                                                            >
                                                                Project Photo
                                                            </label>
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                Upload a new JPG, PNG, or WebP image (up to 5 MB), or remove the current one.
                                                            </p>
                                                        </div>

                                                        {imagePreview && (
                                                            <img
                                                                src={imagePreview}
                                                                alt={`${project.project_name || 'Project'} preview`}
                                                                className="h-40 w-full rounded-xl border border-slate-200 object-cover sm:w-64"
                                                            />
                                                        )}

                                                        <input
                                                            id={`project-image-${project.id}`}
                                                            type="file"
                                                            accept="image/jpeg,image/png,image/webp"
                                                            onChange={handleImageChange}
                                                            disabled={isSubmitting}
                                                            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                                                        />

                                                        {errors.image && (
                                                            <p className="text-sm text-red-600" role="alert">
                                                                {errors.image}
                                                            </p>
                                                        )}

                                                        {project.image_url && (
                                                            <label className="flex items-center gap-2 text-sm text-slate-700">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={form.remove_image}
                                                                    onChange={handleRemoveImageChange}
                                                                    disabled={isSubmitting}
                                                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                                />
                                                                Remove current photo
                                                            </label>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                closeUpdateForm
                                                            }
                                                            disabled={
                                                                isSubmitting
                                                            }
                                                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            Cancel
                                                        </button>

                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                isSubmitting
                                                            }
                                                            className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-700">
                                    ▤
                                </div>

                                <h3 className="mt-4 text-base font-bold text-slate-900">
                                    {projects.length === 0
                                        ? 'No projects available'
                                        : 'No matching projects'}
                                </h3>


                                {projects.length === 0 ? (
                                    <Link
                                        href="/engineering/projects/create"
                                        className="mt-5 inline-flex rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
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
                                        className="mt-5 text-sm font-semibold text-blue-700 hover:text-blue-900"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        )}
                    </section>

                    <footer className="mt-10 border-t border-slate-200 py-5 text-center text-xs text-slate-400">
                        Pagudpud Transparency · Engineering Office
                    </footer>
                </main>
            </div>
        </DashboardLayout>
    );
}
