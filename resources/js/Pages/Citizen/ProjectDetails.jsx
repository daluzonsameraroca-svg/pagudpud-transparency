import { Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';

function Icon({ name, className = 'h-4 w-4' }) {
    const icons = {
        arrow: <path d="M19 12H5m7 7-7-7 7-7" />,
        location: (
            <>
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
            </>
        ),
        budget: (
            <>
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </>
        ),
        calendar: (
            <>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18" />
            </>
        ),
        activity: (
            <>
                <path d="M3 12h4l3-8 4 16 3-8h4" />
            </>
        ),
        message: (
            <>
                <path d="M21 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 2v-6a7.5 7.5 0 1 1 18-3.5Z" />
            </>
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
        Ongoing: 'bg-[#edf3fb] text-[#426da9]',
        Completed: 'bg-[#eaf5ef] text-[#428764]',
        Planned: 'bg-[#fbf4e6] text-[#a77b29]',
        Suspended: 'bg-[#faeded] text-[#b65050]',
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-medium ${
                styles[status] || 'bg-gray-100 text-gray-600'
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
        <div className="rounded-md border border-[#e7ecf2] bg-[#fbfcfd] p-3">
            <div className="flex items-center gap-2 text-[#7e8da0]">
                <Icon name={icon} className="h-3.5 w-3.5" />
                <span className="text-[9px] font-medium uppercase tracking-wide">
                    {label}
                </span>
            </div>
            <p className="mt-2 break-words text-[12px] font-semibold text-[#344860]">
                {value || 'Not specified'}
            </p>
        </div>
    );
}

function SectionHeading({ title, description, right }) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#e8edf2] px-4 py-3.5">
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

    // Keep the existing Laravel Reverb real-time project updates.
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

        channel.listen(
            '.project.progress.updated',
            handleProjectUpdate
        );

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
            <div className="min-h-screen bg-[#f5f7fa]">
                {/* Top navigation */}
                <header className="flex h-12 items-center justify-between border-b border-[#e3e8ef] bg-white px-5 sm:px-7">
                    <div className="flex items-center gap-2 text-[10px] text-[#8793a3]">
                        <Link
                            href="/citizen/dashboard"
                            className="hover:text-[#416b9f]"
                        >
                            Dashboard
                        </Link>
                        <span>/</span>
                        <Link
                            href="/citizen/projects"
                            className="hover:text-[#416b9f]"
                        >
                            Projects
                        </Link>
                        <span>/</span>
                        <span className="font-medium text-[#344860]">
                            Details
                        </span>
                    </div>

                    <span className="text-[10px] text-[#7b899a]">
                        Public Project Record
                    </span>
                </header>

                <main className="space-y-5 px-5 py-5 sm:px-7">
                    {/* Project heading */}
                    <section>
                        <Link
                            href="/citizen/projects"
                            className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#61748b] transition hover:text-[#315b8b]"
                        >
                            <Icon
                                name="arrow"
                                className="h-3.5 w-3.5"
                            />
                            Back to Projects
                        </Link>

                        <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                            <div className="min-w-0">
                                <h1 className="break-words text-[19px] font-semibold tracking-tight text-[#253951]">
                                    {currentProject.project_name ||
                                        'Untitled Project'}
                                </h1>

                                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#7b899a]">
                                    <Icon
                                        name="location"
                                        className="h-3.5 w-3.5"
                                    />
                                    {currentProject.location ||
                                        'Location not specified'}
                                </p>
                            </div>

                            <StatusBadge status={currentProject.status} />
                        </div>
                    </section>

                    {/* Live updates notice */}
                    <section className="flex items-start gap-2.5 rounded-md border border-[#d9e8df] bg-[#f0f7f2] px-3.5 py-3">
                        <span className="relative mt-1 flex h-2 w-2 shrink-0">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#62a783] opacity-40" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4c9878]" />
                        </span>

                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-[#3e785a]">
                                {lastUpdatedLive
                                    ? 'Project information updated live'
                                    : 'Live Project Updates'}
                            </p>
                            <p className="mt-1 text-[10px] leading-4 text-[#61816e]">
                                This page listens for project progress updates
                                from the Municipal Engineering Office. When a
                                new update is received, the displayed project
                                information refreshes automatically.
                            </p>
                        </div>
                    </section>

                    {/* Main content layout */}
                    <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(270px,0.85fr)]">
                        <div className="space-y-4">
                            {/* Project overview */}
                            <section className="overflow-hidden rounded-md border border-[#e3e8ef] bg-white">
                                <SectionHeading
                                    title="Project Overview"
                                    description="General information about this government project"
                                />

                                <div className="p-4">
                                    <p className="whitespace-pre-line text-[11px] leading-6 text-[#64758a]">
                                        {currentProject.description ||
                                            'No project description available.'}
                                    </p>

                                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
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

                            {/* Project progress */}
                            <section className="overflow-hidden rounded-md border border-[#e3e8ef] bg-white">
                                <SectionHeading
                                    title="Current Progress"
                                    description="Latest recorded implementation progress"
                                    right={
                                        <span className="text-[20px] font-semibold tracking-tight text-[#304b6b]">
                                            {progress}%
                                        </span>
                                    }
                                />

                                <div className="p-4">
                                    <div className="flex items-center justify-between text-[10px] text-[#8793a3]">
                                        <span>Overall completion</span>
                                        <span>{progress} of 100%</span>
                                    </div>

                                    <div
                                        className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-[#e9edf2]"
                                        role="progressbar"
                                        aria-valuenow={progress}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label="Project progress"
                                    >
                                        <div
                                            className="h-full rounded-full bg-[#5278ae] transition-all duration-500"
                                            style={{
                                                width: `${progress}%`,
                                            }}
                                        />
                                    </div>

                                    <div className="mt-2 flex justify-between text-[9px] text-[#9aa5b2]">
                                        <span>0%</span>
                                        <span>25%</span>
                                        <span>50%</span>
                                        <span>75%</span>
                                        <span>100%</span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        <div className="rounded-md bg-[#f7f9fb] p-3">
                                            <p className="text-[9px] text-[#8793a3]">
                                                Current Status
                                            </p>
                                            <div className="mt-1.5">
                                                <StatusBadge
                                                    status={
                                                        currentProject.status
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="rounded-md bg-[#f7f9fb] p-3">
                                            <p className="text-[9px] text-[#8793a3]">
                                                Latest Recorded Update
                                            </p>
                                            <p className="mt-1.5 text-[10px] font-medium text-[#52647a]">
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

                            {/* Progress timeline */}
                            <section className="overflow-hidden rounded-md border border-[#e3e8ef] bg-white">
                                <SectionHeading
                                    title="Project Progress Timeline"
                                    description="Recorded status and progress updates"
                                    right={
                                        <span className="rounded-full bg-[#f0f3f7] px-2 py-1 text-[9px] text-[#718096]">
                                            {updates.length} updates
                                        </span>
                                    }
                                />

                                <div className="p-4">
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
                                                        <div className="absolute bottom-0 left-[7px] top-4 w-px bg-[#dfe6ee]" />
                                                    )}

                                                    <div
                                                        className={`relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white ring-1 ring-[#d7e0ea] ${
                                                            index === 0
                                                                ? 'bg-[#5278ae]'
                                                                : 'bg-[#a8b6c6]'
                                                        }`}
                                                    />

                                                    <div className="min-w-0 flex-1 rounded-md border border-[#edf0f4] bg-[#fbfcfd] p-3">
                                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <StatusBadge
                                                                    status={
                                                                        update.status
                                                                    }
                                                                />
                                                                <span className="text-[11px] font-semibold text-[#344860]">
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

                                                            <span className="text-[9px] text-[#8793a3]">
                                                                {formatDate(
                                                                    update.update_date ||
                                                                        update.created_at
                                                                )}
                                                            </span>
                                                        </div>

                                                        {update.update_description && (
                                                            <p className="mt-2 whitespace-pre-line text-[10px] leading-5 text-[#64758a]">
                                                                {
                                                                    update.update_description
                                                                }
                                                            </p>
                                                        )}

                                                        {index === 0 && (
                                                            <p className="mt-2 flex items-center gap-1 text-[9px] font-medium text-[#4c8a69]">
                                                                <Icon
                                                                    name="check"
                                                                    className="h-3 w-3"
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
                                        <div className="rounded-md border border-dashed border-[#dfe6ee] px-4 py-8 text-center">
                                            <Icon
                                                name="activity"
                                                className="mx-auto h-5 w-5 text-[#9aa8b8]"
                                            />
                                            <p className="mt-2 text-[11px] font-medium text-[#52647a]">
                                                No progress updates yet
                                            </p>
                                            <p className="mt-1 text-[10px] text-[#8793a3]">
                                                Recorded updates will appear
                                                here when they are provided by
                                                the Engineering Office.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right column */}
                        <aside className="space-y-4">
                            {/* Summary */}
                            <section className="overflow-hidden rounded-md border border-[#e3e8ef] bg-white">
                                <SectionHeading
                                    title="Project Summary"
                                    description="Current project information"
                                />

                                <div className="space-y-3 p-4">
                                    <div>
                                        <p className="text-[10px] text-[#8793a3]">
                                            Project Name
                                        </p>
                                        <p className="mt-1 text-[11px] font-medium leading-5 text-[#344860]">
                                            {currentProject.project_name ||
                                                'Untitled Project'}
                                        </p>
                                    </div>

                                    <div className="border-t border-[#edf0f4] pt-3">
                                        <p className="text-[10px] text-[#8793a3]">
                                            Status
                                        </p>
                                        <div className="mt-1.5">
                                            <StatusBadge
                                                status={currentProject.status}
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-[#edf0f4] pt-3">
                                        <p className="text-[10px] text-[#8793a3]">
                                            Project Budget
                                        </p>
                                        <p className="mt-1 text-[13px] font-semibold text-[#344860]">
                                            {formatBudget(
                                                currentProject.budget
                                            )}
                                        </p>
                                    </div>

                                    <div className="border-t border-[#edf0f4] pt-3">
                                        <p className="text-[10px] text-[#8793a3]">
                                            Progress
                                        </p>
                                        <p className="mt-1 text-[13px] font-semibold text-[#344860]">
                                            {progress}%
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Citizen feedback */}
                            <section className="overflow-hidden rounded-md border border-[#e3e8ef] bg-white">
                                <SectionHeading
                                    title="Submit Public Feedback"
                                    description="Share an observation or concern about this project"
                                />

                                <form
                                    onSubmit={submitFeedback}
                                    className="p-4"
                                >
                                    <label
                                        htmlFor="feedback-message"
                                        className="mb-2 block text-[10px] font-medium text-[#52647a]"
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
                                        className="w-full resize-y rounded-md border border-[#dfe5ec] bg-white px-3 py-2.5 text-[11px] leading-5 text-[#344860] outline-none transition placeholder:text-[#a0aab7] focus:border-[#7898bd] focus:ring-2 focus:ring-[#e7eef7]"
                                    />

                                    {errors.message && (
                                        <p className="mt-1.5 text-[10px] text-red-600">
                                            {errors.message}
                                        </p>
                                    )}

                                    <p className="mt-1 text-right text-[9px] text-[#9aa5b2]">
                                        {data.message.length}/3000
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            !data.message.trim()
                                        }
                                        className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#304b6b] px-4 text-[11px] font-medium text-white transition hover:bg-[#243c58] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Icon
                                            name="message"
                                            className="h-3.5 w-3.5"
                                        />
                                        {processing
                                            ? 'Submitting...'
                                            : 'Submit Feedback'}
                                    </button>

                                    <p className="mt-2 text-[9px] leading-4 text-[#929eac]">
                                        Please keep your feedback relevant
                                        to the project. Submissions are
                                        subject to administrative review.
                                    </p>
                                </form>
                            </section>

                            {/* Notice */}
                            <section className="rounded-md border border-[#e3e8ef] bg-white p-3.5">
                                <h3 className="text-[11px] font-semibold text-[#344860]">
                                    About Project Information
                                </h3>
                                <p className="mt-1.5 text-[10px] leading-5 text-[#7b899a]">
                                    The Municipal Engineering Office maintains
                                    official project progress and status.
                                    Citizen feedback does not directly change
                                    official project records.
                                </p>
                            </section>
                        </aside>
                    </div>

                    {/* Footer */}
                    <footer className="border-t border-[#e3e8ef] pt-3 text-[9px] leading-4 text-[#929eac]">
                        Pagudpud Transparency · Municipality of Pagudpud,
                        Ilocos Norte
                    </footer>
                </main>
            </div>
        </DashboardLayout>
    );
}
