import { Link, useForm } from '@inertiajs/react';
import PagudpudProjectLocationFields from '../../Components/PagudpudProjectLocationFields';
import usePagudpudBarangays from '../../Hooks/usePagudpudBarangays';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { formatPagudpudProjectLocation } from '../../Utils/pagudpudProjectLocation';

const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';

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
    const {
        barangays,
        loading: barangaysLoading,
        error: barangaysError,
        retry: retryBarangays,
    } = usePagudpudBarangays();
    const { data, setData, post, processing, errors } = useForm({
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
    });

    const submit = (e) => {
        e.preventDefault();
        post('/engineering/projects');
    };

    const updateLocation = (field, value) => {
        const nextData = { ...data, [field]: value };

        setData({
            ...nextData,
            location: formatPagudpudProjectLocation(
                nextData.sitio,
                nextData.barangay,
            ),
        });
    };

    return (
        <DashboardLayout role="engineering">
            <div className="min-h-screen bg-slate-50 text-slate-800">
                <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
                    <div className="mx-auto flex max-w-[1200px] items-start gap-3">
                        <Link
                            href="/engineering/projects"
                            className="mt-1 shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                            Back
                        </Link>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                Add New Project
                            </h1>

                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1200px] px-5 py-6 sm:px-8">
                    <form onSubmit={submit} className="space-y-5">
                        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-base text-emerald-700">
                                        ▤
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-semibold text-slate-900">
                                            Project Information
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-x-5 gap-y-5 p-4 sm:p-5 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label htmlFor="project_name" className={labelClass}>
                                        Project Name
                                        <span className="ml-1 text-red-500">*</span>
                                    </label>

                                    <input
                                        id="project_name"
                                        type="text"
                                        value={data.project_name}
                                        onChange={(e) => setData('project_name', e.target.value)}
                                        placeholder="Enter the official project name"
                                        required
                                        aria-invalid={Boolean(errors.project_name)}
                                        className={inputClass}
                                    />

                                    <FieldError message={errors.project_name} />
                                </div>

                                <div className="md:col-span-2">
                                    <h3 className={labelClass}>
                                        Project Location
                                    </h3>
                                    <PagudpudProjectLocationFields
                                        idPrefix="new-project-location"
                                        barangay={data.barangay}
                                        sitio={data.sitio}
                                        onChange={updateLocation}
                                        error={errors.location}
                                        barangays={barangays}
                                        loading={barangaysLoading}
                                        barangaysError={barangaysError}
                                        retry={retryBarangays}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="budget" className={labelClass}>
                                        Project Budget (PHP)
                                        <span className="ml-1 text-red-500">*</span>
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
                                            onChange={(e) => setData('budget', e.target.value)}
                                            placeholder="0.00"
                                            required
                                            aria-invalid={Boolean(errors.budget)}
                                            className={`${inputClass} pl-8`}
                                        />
                                    </div>

                                    <FieldError message={errors.budget} />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="description" className={labelClass}>
                                        Project Description
                                    </label>

                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                        placeholder="Describe the project's purpose, planned work, and expected outcome..."
                                        aria-invalid={Boolean(errors.description)}
                                        className={`${inputClass} resize-y leading-5`}
                                    />

                                    <FieldError message={errors.description} />
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-base text-emerald-700">
                                        ▦
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-semibold text-slate-900">
                                            Project Schedule
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 p-4 sm:p-5 md:grid-cols-2">
                                <div>
                                    <label htmlFor="start_date" className={labelClass}>
                                        Start Date
                                    </label>

                                    <input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        aria-invalid={Boolean(errors.start_date)}
                                        className={inputClass}
                                    />

                                    <FieldError message={errors.start_date} />
                                </div>

                                <div>
                                    <label htmlFor="target_completion_date" className={labelClass}>
                                        Target Completion Date
                                    </label>

                                    <input
                                        id="target_completion_date"
                                        type="date"
                                        min={data.start_date || undefined}
                                        value={data.target_completion_date}
                                        onChange={(e) =>
                                            setData('target_completion_date', e.target.value)
                                        }
                                        aria-invalid={Boolean(errors.target_completion_date)}
                                        className={inputClass}
                                    />

                                    <FieldError message={errors.target_completion_date} />
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-base text-emerald-700">
                                        ◷
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-semibold text-slate-900">
                                            Initial Project Status
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5 p-4 sm:p-5">
                                <div>
                                    <label htmlFor="status" className={labelClass}>
                                        Project Status
                                    </label>

                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        aria-invalid={Boolean(errors.status)}
                                        className={inputClass}
                                    >
                                        <option value="Planned">Planned</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>

                                    <FieldError message={errors.status} />
                                </div>

                                <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <div>
                                            <label
                                                htmlFor="progress"
                                                className="text-xs font-semibold text-slate-700"
                                            >
                                                Initial Progress
                                            </label>
                                        </div>

                                        <span className="shrink-0 rounded-lg bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-800">
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
                                            setData('progress', Number(e.target.value))
                                        }
                                        aria-valuetext={`${data.progress}% complete`}
                                        className="w-full cursor-pointer accent-emerald-600"
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

                        <div className="flex flex-col-reverse gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">

                            <div className="flex flex-col-reverse gap-2 sm:flex-row">
                                <Link
                                    href="/engineering/projects"
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-center text-xs font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        barangaysLoading ||
                                        Boolean(barangaysError) ||
                                        !data.barangay
                                    }
                                    className="rounded-lg bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? 'Creating Project...' : 'Create Project'}
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