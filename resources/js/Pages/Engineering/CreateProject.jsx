import { Link, useForm } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';

const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100';

const labelClass =
    'mb-1.5 block text-xs font-medium text-slate-700';

function FieldError({ message }) {
    if (!message) return null;

    return (
        <p className="mt-1.5 text-xs text-red-600">
            {message}
        </p>
    );
}

export default function CreateProject() {
    const { data, setData, post, processing, errors } = useForm({
        project_name: '',
        description: '',
        location: '',
        budget: '',
        start_date: '',
        target_completion_date: '',
        status: 'Planned',
        progress: 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/engineering/projects');
    };

    return (
        <DashboardLayout role="engineering">
            <div className="min-h-screen bg-[#f4f6f9] text-slate-800">
                {/* Header */}
                <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
                    <div className="mx-auto flex max-w-[1200px] items-start gap-3">
                        <Link
                            href="/engineering/projects"
                            aria-label="Back to projects"
                            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg text-slate-600 transition hover:bg-slate-50 hover:text-[#20334b]"
                        >
                            ←
                        </Link>

                        <div>
                            <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <Link
                                    href="/engineering/dashboard"
                                    className="hover:text-blue-700"
                                >
                                    Engineering Office
                                </Link>
                                <span>/</span>
                                <Link
                                    href="/engineering/projects"
                                    className="hover:text-blue-700"
                                >
                                    Projects
                                </Link>
                                <span>/</span>
                                <span className="font-medium text-slate-700">
                                    Add Project
                                </span>
                            </div>

                            <h1 className="text-xl font-bold tracking-tight text-[#20334b] sm:text-2xl">
                                Add New Project
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Create an official record for a local
                                government project.
                            </p>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1200px] px-5 py-6 sm:px-8">
                    {/* Intro notice */}
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-semibold text-blue-700">
                            i
                        </span>

                        <div>
                            <p className="text-xs font-semibold text-blue-900">
                                Before creating the record
                            </p>
                            <p className="mt-1 text-xs leading-5 text-blue-800">
                                Enter accurate project details, budget,
                                location, and implementation dates. These
                                details will be used for project monitoring
                                and public transparency.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Project information */}
                        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-base text-slate-700">
                                        ▤
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-semibold text-[#20334b]">
                                            Project Information
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Basic details and project scope.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-x-5 gap-y-5 p-4 sm:p-5 md:grid-cols-2">
                                {/* Project name */}
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="project_name"
                                        className={labelClass}
                                    >
                                        Project Name
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="project_name"
                                        type="text"
                                        value={data.project_name}
                                        onChange={(e) =>
                                            setData(
                                                'project_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter the official project name"
                                        required
                                        aria-invalid={
                                            Boolean(errors.project_name)
                                        }
                                        className={inputClass}
                                    />

                                    <FieldError
                                        message={errors.project_name}
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <label
                                        htmlFor="location"
                                        className={labelClass}
                                    >
                                        Project Location
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={(e) =>
                                            setData(
                                                'location',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g. Barangay Balaoi"
                                        required
                                        aria-invalid={Boolean(errors.location)}
                                        className={inputClass}
                                    />

                                    <FieldError message={errors.location} />
                                </div>

                                {/* Budget */}
                                <div>
                                    <label
                                        htmlFor="budget"
                                        className={labelClass}
                                    >
                                        Project Budget (PHP)
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500">
                                            ₱
                                        </span>

                                        <input
                                            id="budget"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.budget}
                                            onChange={(e) =>
                                                setData(
                                                    'budget',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="0.00"
                                            required
                                            aria-invalid={Boolean(
                                                errors.budget,
                                            )}
                                            className={`${inputClass} pl-8`}
                                        />
                                    </div>

                                    <FieldError message={errors.budget} />
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="description"
                                        className={labelClass}
                                    >
                                        Project Description
                                    </label>

                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        rows={4}
                                        placeholder="Describe the project's purpose, planned work, and expected outcome..."
                                        aria-invalid={Boolean(
                                            errors.description,
                                        )}
                                        className={`${inputClass} resize-y leading-5`}
                                    />

                                    <FieldError
                                        message={errors.description}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Schedule */}
                        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-base text-indigo-700">
                                        ▦
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-semibold text-[#20334b]">
                                            Project Schedule
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Set the expected project dates.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 p-4 sm:p-5 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="start_date"
                                        className={labelClass}
                                    >
                                        Start Date
                                    </label>

                                    <input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) =>
                                            setData(
                                                'start_date',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={Boolean(
                                            errors.start_date,
                                        )}
                                        className={inputClass}
                                    />

                                    <FieldError
                                        message={errors.start_date}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="target_completion_date"
                                        className={labelClass}
                                    >
                                        Target Completion Date
                                    </label>

                                    <input
                                        id="target_completion_date"
                                        type="date"
                                        min={data.start_date || undefined}
                                        value={data.target_completion_date}
                                        onChange={(e) =>
                                            setData(
                                                'target_completion_date',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={Boolean(
                                            errors.target_completion_date,
                                        )}
                                        className={inputClass}
                                    />

                                    <FieldError
                                        message={
                                            errors.target_completion_date
                                        }
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Initial status */}
                        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-base text-emerald-700">
                                        ◷
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-semibold text-[#20334b]">
                                            Initial Project Status
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Define the starting status and
                                            completion percentage.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5 p-4 sm:p-5">
                                <div>
                                    <label
                                        htmlFor="status"
                                        className={labelClass}
                                    >
                                        Project Status
                                    </label>

                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData('status', e.target.value)
                                        }
                                        aria-invalid={Boolean(errors.status)}
                                        className={inputClass}
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

                                    <FieldError message={errors.status} />
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <div>
                                            <label
                                                htmlFor="progress"
                                                className="text-xs font-semibold text-slate-700"
                                            >
                                                Initial Progress
                                            </label>
                                            <p className="mt-1 text-[11px] leading-5 text-slate-500">
                                                Set the project's current
                                                completion percentage.
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
                                            {data.progress}%
                                        </span>
                                    </div>

                                    <input
                                        id="progress"
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={data.progress}
                                        onChange={(e) =>
                                            setData(
                                                'progress',
                                                Number(e.target.value),
                                            )
                                        }
                                        aria-valuetext={`${data.progress}% complete`}
                                        className="w-full cursor-pointer accent-blue-600"
                                    />

                                    <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                                        <span>0%</span>
                                        <span>25%</span>
                                        <span>50%</span>
                                        <span>75%</span>
                                        <span>100%</span>
                                    </div>

                                    <FieldError message={errors.progress} />
                                </div>
                            </div>
                        </section>

                        {/* Form actions */}
                        <div className="flex flex-col-reverse gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
                            <p className="text-[11px] leading-5 text-slate-500">
                                Fields marked with{' '}
                                <span className="font-semibold text-red-500">
                                    *
                                </span>{' '}
                                are required.
                            </p>

                            <div className="flex flex-col-reverse gap-2 sm:flex-row">
                                <Link
                                    href="/engineering/projects"
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-center text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-[#20334b] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2c4664] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing
                                        ? 'Creating Project...'
                                        : 'Create Project'}
                                </button>
                            </div>
                        </div>
                    </form>

                    <footer className="mt-8 border-t border-slate-200 py-4 text-center text-[10px] text-slate-400">
                        Pagudpud Transparency · Engineering Office
                    </footer>
                </main>
            </div>
        </DashboardLayout>
    );
}
