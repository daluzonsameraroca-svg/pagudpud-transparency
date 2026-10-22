import { Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';

function Icon({ name, className = 'h-4 w-4' }) {
    const icons = {
        location: (
            <>
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
            </>
        ),
        budget: (
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        ),
        calendar: (
            <>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18" />
            </>
        ),
        activity: <path d="M3 12h4l3-8 4 16 3-8h4" />,
        message: (
            <path d="M21 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 2v-6a7.5 7.5 0 1 1 18-3.5Z" />
        ),
        check: <path d="m5 12 4 4L19 6" />,
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
            {icons[name] || icons.activity}
        </svg>
    );
}

function StatusBadge({ status }) {
    const styles = {
        Ongoing: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        Completed: 'bg-green-50 text-green-700 ring-green-200',
        Planned: 'bg-amber-50 text-amber-700 ring-amber-200',
        Suspended: 'bg-red-50 text-red-700 ring-red-200',
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ring-inset ${
                styles[status] || 'bg-gray-100 text-gray-600 ring-gray-200'
            }`}
        >
            {status || 'Unknown'}
        </span>
    );
}

function formatDate(date) {
    if (!date) return 'Not specified';

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

function formatBudget(budget) {
    if (budget === null || budget === undefined || budget === '') {
        return 'Not specified';
    }

    return Number(budget).toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function InfoCard({ icon, label, value }) {
    return (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-3.5">
            <div className="flex items-center gap-2 text-emerald-700">
                <Icon name={icon} className="h-4 w-4" />
                <span className="text-[10px] font-semibold uppercase tracking-wide">
                    {label}
                </span>
            </div>
            <p className="mt-2 break-words text-sm font-semibold text-slate-800">
                {value || 'Not specified'}
            </p>
        </div>
    );
}

function SectionHeading({ title, right }) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
                <h2 className="text-sm font-semibold text-slate-800">
                    {title}
                </h2>
            </div>
            {right}
        </div>
    );
}

export default function ProjectDetails({ project }) {
    const [currentProject, setCurrentProject] = useState(project);
    const [lastUpdatedLive, setLastUpdatedLive] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        message: '',
    });

    useEffect(() => {
        setCurrentProject(project);
    }, [project]);

    useEffect(() => {
        if (!window.Echo) {
            return;
        }

        const channel = window.Echo.channel('projects');

        const handleProjectUpdate = (event) => {
            if (Number(event.project?.id) === Number(project.id)) {
                setCurrentProject(event.project);
                setLastUpdatedLive(true);
            }
        };

        channel.listen('.project.progress.updated', handleProjectUpdate);

        return () => {
            channel.stopListening(
                '.project.progress.updated',
                handleProjectUpdate
            );
            window.Echo.leaveChannel('projects');
        };
    }, [project.id]);

    const submitFeedback = (event) => {
        event.preventDefault();

        post(`/citizen/projects/${currentProject.id}/feedback`, {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const progress = Math.min(
        100,
        Math.max(0, Number(currentProject.progress || 0))
    );

    const updates = [...(currentProject.progress_updates || [])].sort(
        (a, b) => {
            const dateA = new Date(
                a.update_date || a.created_at || 0
            ).getTime();
            const dateB = new Date(
                b.update_date || b.created_at || 0
            ).getTime();

            return dateB - dateA;
        }
    );

    const latestUpdate = updates[0];

    return (
        <DashboardLayout role="citizen">
            <div className="min-h-screen bg-slate-50">
                <header className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3 sm:px-7">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-medium text-emerald-700">
                        Public Project Record
                    </span>
                </header>

                <main className="space-y-5 px-5 py-6 sm:px-7">
                    <section>
                        <Link
                            href="/citizen/projects"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 transition hover:text-emerald-900"
                        >
                            Back to Projects
                        </Link>

                        <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                                    Project Details
                                </p>
                                <h1 className="mt-1 break-words text-2xl font-bold tracking-tight text-slate-900">
                                    {currentProject.project_name ||
                                        'Untitled Project'}
                                </h1>

                                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                    <Icon
                                        name="location"
                                        className="h-4 w-4 shrink-0 text-emerald-700"
                                    />
                                    {currentProject.location ||
                                        'Location not specified'}
                                </p>
                            </div>

                            <StatusBadge status={currentProject.status} />
                        </div>
                    </section>

                    <section className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <span className="relative mt-1 flex h-2.5 w-2.5 shrink-0">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
                        </span>

                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-emerald-900">
                                {lastUpdatedLive
                                    ? 'Project information updated live'
                                    : 'Live Project Updates'}
                            </p>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)]">
                        <div className="space-y-5">
                            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <SectionHeading
                                    title="Project Overview"
                                />

                                <div className="p-5">
                                    <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                                        {currentProject.description ||
                                            'No project description available.'}
                                    </p>

                                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <InfoCard
                                            icon="location"
                                            label="Project Location"
                                            value={currentProject.location}
                                        />
                                        <InfoCard
                                            icon="budget"
                                            label="Project Budget"
                                            value={formatBudget(
                                                currentProject.budget
                                            )}
                                        />
                                        <InfoCard
                                            icon="calendar"
                                            label="Start Date"
                                            value={formatDate(
                                                currentProject.start_date
                                            )}
                                        />
                                        <InfoCard
                                            icon="calendar"
                                            label="Target Completion"
                                            value={formatDate(
                                                currentProject.target_completion_date
                                            )}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <SectionHeading
                                    title="Current Progress"
                                    right={
                                        <span className="text-2xl font-bold tracking-tight text-emerald-700">
                                            {progress}%
                                        </span>
                                    }
                                />

                                <div className="p-5">
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>Overall completion</span>
                                        <span>{progress} of 100%</span>
                                    </div>

                                    <div
                                        className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"
                                        role="progressbar"
                                        aria-valuenow={progress}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label="Project progress"
                                    >
                                        <div
                                            className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                                            style={{
                                                width: `${progress}%`,
                                            }}
                                        />
                                    </div>

                                    <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                                        <span>0%</span>
                                        <span>25%</span>
                                        <span>50%</span>
                                        <span>75%</span>
                                        <span>100%</span>
                                    </div>

                                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="rounded-lg bg-slate-50 p-4">
                                            <p className="text-xs text-slate-500">
                                                Current Status
                                            </p>
                                            <div className="mt-2">
                                                <StatusBadge
                                                    status={currentProject.status}
                                                />
                                            </div>
                                        </div>

                                        <div className="rounded-lg bg-slate-50 p-4">
                                            <p className="text-xs text-slate-500">
                                                Latest Recorded Update
                                            </p>
                                            <p className="mt-2 text-sm font-semibold text-slate-700">
                                                {latestUpdate
                                                    ? formatDate(
                                                          latestUpdate.update_date ||
                                                              latestUpdate.created_at
                                                      )
                                                    : 'No updates recorded'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <SectionHeading
                                    title="Project Progress Timeline"
                                    right={
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                            {updates.length} updates
                                        </span>
                                    }
                                />

                                <div className="p-5">
                                    {updates.length > 0 ? (
                                        <div className="space-y-0">
                                            {updates.map((update, index) => (
                                                <div
                                                    key={
                                                        update.id ||
                                                        `${update.update_date}-${index}`
                                                    }
                                                    className="relative flex gap-3 pb-5 last:pb-0"
                                                >
                                                    {index <
                                                        updates.length - 1 && (
                                                        <div className="absolute bottom-0 left-[7px] top-4 w-px bg-emerald-100" />
                                                    )}

                                                    <div
                                                        className={`relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white ring-1 ring-emerald-200 ${
                                                            index === 0
                                                                ? 'bg-emerald-600'
                                                                : 'bg-emerald-300'
                                                        }`}
                                                    />

                                                    <div className="min-w-0 flex-1 rounded-lg border border-slate-100 bg-slate-50/70 p-4">
                                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <StatusBadge
                                                                    status={
                                                                        update.status
                                                                    }
                                                                />
                                                                <span className="text-sm font-semibold text-slate-700">
                                                                    {Math.min(
                                                                        100,
                                                                        Math.max(
                                                                            0,
                                                                            Number(
                                                                                update.progress ||
                                                                                    0
                                                                            )
                                                                        )
                                                                    )}
                                                                    %
                                                                </span>
                                                            </div>

                                                            <span className="text-xs text-slate-500">
                                                                {formatDate(
                                                                    update.update_date ||
                                                                        update.created_at
                                                                )}
                                                            </span>
                                                        </div>

                                                        {update.update_description && (
                                                            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                                                                {
                                                                    update.update_description
                                                                }
                                                            </p>
                                                        )}

                                                        {index === 0 && (
                                                            <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                                                                <Icon
                                                                    name="check"
                                                                    className="h-3.5 w-3.5"
                                                                />
                                                                Latest recorded
                                                                update
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-dashed border-emerald-200 bg-emerald-50/30 px-4 py-10 text-center">
                                            <Icon
                                                name="activity"
                                                className="mx-auto h-6 w-6 text-emerald-600"
                                            />
                                            <p className="mt-3 text-sm font-semibold text-slate-700">
                                                No progress updates yet
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        <aside className="space-y-5">
                            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <SectionHeading
                                    title="Project Summary"
                                />

                                <div className="space-y-4 p-5">
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Project Name
                                        </p>
                                        <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">
                                            {currentProject.project_name ||
                                                'Untitled Project'}
                                        </p>
                                    </div>

                                    <div className="border-t border-slate-100 pt-4">
                                        <p className="text-xs text-slate-500">
                                            Status
                                        </p>
                                        <div className="mt-2">
                                            <StatusBadge
                                                status={currentProject.status}
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 pt-4">
                                        <p className="text-xs text-slate-500">
                                            Project Budget
                                        </p>
                                        <p className="mt-1 text-base font-bold text-emerald-800">
                                            {formatBudget(
                                                currentProject.budget
                                            )}
                                        </p>
                                    </div>

                                    <div className="border-t border-slate-100 pt-4">
                                        <p className="text-xs text-slate-500">
                                            Progress
                                        </p>
                                        <p className="mt-1 text-base font-bold text-emerald-700">
                                            {progress}%
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <SectionHeading
                                    title="Submit Public Feedback"
                                />

                                <form
                                    onSubmit={submitFeedback}
                                    className="p-5"
                                >
                                    <label
                                        htmlFor="feedback-message"
                                        className="mb-2 block text-xs font-semibold text-slate-700"
                                    >
                                        Your message
                                    </label>

                                    <textarea
                                        id="feedback-message"
                                        value={data.message}
                                        onChange={(event) =>
                                            setData(
                                                'message',
                                                event.target.value
                                            )
                                        }
                                        rows={5}
                                        maxLength={3000}
                                        required
                                        placeholder="Write your feedback here..."
                                        className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm leading-5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                    />

                                    {errors.message && (
                                        <p className="mt-2 text-xs text-red-600">
                                            {errors.message}
                                        </p>
                                    )}

                                    <p className="mt-1 text-right text-xs text-slate-400">
                                        {data.message.length}/3000
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            !data.message.trim()
                                        }
                                        className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Icon
                                            name="message"
                                            className="h-4 w-4"
                                        />
                                        {processing
                                            ? 'Submitting...'
                                            : 'Submit Feedback'}
                                    </button>

                                </form>
                            </section>

                            <section className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                                <h3 className="text-sm font-semibold text-emerald-900">
                                    About Project Information
                                </h3>
                            </section>
                        </aside>
                    </div>

                    <footer className="border-t border-slate-200 pt-4 text-xs text-slate-500">
                        Pagudpud Transparency · Municipality of Pagudpud,
                        Ilocos Norte
                    </footer>
                </main>
            </div>
        </DashboardLayout>
    );
}
