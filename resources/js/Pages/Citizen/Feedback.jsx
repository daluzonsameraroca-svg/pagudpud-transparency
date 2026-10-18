import { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default function Feedback({ feedback = [] }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredFeedback = useMemo(() => {
        const term = search.toLowerCase().trim();

        return feedback.filter((item) => {
            const projectName = item.project?.project_name ?? '';
            const message = item.message ?? '';
            const status = item.status ?? 'Pending';

            const matchesSearch =
                !term ||
                `${projectName} ${message}`.toLowerCase().includes(term);

            const matchesStatus =
                statusFilter === 'All' ||
                status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [feedback, search, statusFilter]);

    const formatDate = (date) => {
        if (!date) return 'Date unavailable';

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Date unavailable';
        }

        return parsedDate.toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusStyle = (status) => {
        switch ((status ?? 'Pending').toLowerCase()) {
            case 'resolved':
                return 'bg-green-50 text-green-700 ring-green-200';
            case 'reviewed':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
            case 'pending':
                return 'bg-amber-50 text-amber-700 ring-amber-200';
            default:
                return 'bg-slate-100 text-slate-600 ring-slate-200';
        }
    };

    const pendingCount = feedback.filter(
        (item) => (item.status ?? 'Pending').toLowerCase() === 'pending'
    ).length;

    const reviewedCount = feedback.filter(
        (item) => (item.status ?? 'Pending').toLowerCase() === 'reviewed'
    ).length;

    const resolvedCount = feedback.filter(
        (item) => (item.status ?? 'Pending').toLowerCase() === 'resolved'
    ).length;

    const summaryCards = [
        {
            label: 'Total Feedback',
            count: feedback.length,
            description: 'All submitted feedback',
            icon: 'total',
            color: 'text-emerald-800',
            iconBg: 'bg-emerald-50 text-emerald-700',
        },
        {
            label: 'Pending',
            count: pendingCount,
            description: 'Awaiting review',
            icon: 'pending',
            color: 'text-amber-600',
            iconBg: 'bg-amber-50 text-amber-700',
        },
        {
            label: 'Reviewed',
            count: reviewedCount,
            description: 'Already reviewed',
            icon: 'reviewed',
            color: 'text-emerald-700',
            iconBg: 'bg-emerald-50 text-emerald-700',
        },
        {
            label: 'Resolved',
            count: resolvedCount,
            description: 'Marked as resolved',
            icon: 'resolved',
            color: 'text-green-700',
            iconBg: 'bg-green-50 text-green-700',
        },
    ];

    return (
        <DashboardLayout role="citizen">
            <Head title="My Feedback" />

            <div className="min-h-screen space-y-6 bg-slate-50 p-5 sm:p-6 md:p-8">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        Citizen Participation
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                        My Feedback
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        View the feedback you have submitted about municipal
                        projects and check its status.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((card) => (
                        <div
                            key={card.label}
                            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-slate-500">
                                    {card.label}
                                </p>

                                <span
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconBg}`}
                                >
                                    {card.icon === 'total' && (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        >
                                            <path d="M8 6h13M8 12h13M8 18h13" />
                                            <path d="M3 6h.01M3 12h.01M3 18h.01" />
                                        </svg>
                                    )}

                                    {card.icon === 'pending' && (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        >
                                            <circle cx="12" cy="12" r="9" />
                                            <path d="M12 7v5l3 2" />
                                        </svg>
                                    )}

                                    {card.icon === 'reviewed' && (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        >
                                            <path d="m5 12 4 4L19 6" />
                                        </svg>
                                    )}

                                    {card.icon === 'resolved' && (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        >
                                            <circle cx="12" cy="12" r="9" />
                                            <path d="m8 12 3 3 5-6" />
                                        </svg>
                                    )}
                                </span>
                            </div>

                            <p className={`mt-3 text-3xl font-bold ${card.color}`}>
                                {card.count}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold text-slate-800">
                            Find Your Feedback
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Search by project or message, or filter by status.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                        <div>
                            <label
                                htmlFor="feedback-search"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Search feedback
                            </label>

                            <div className="relative">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                    aria-hidden="true"
                                >
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="m16 16 4 4" />
                                </svg>

                                <input
                                    id="feedback-search"
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search project or message..."
                                    className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="feedback-status"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Filter by status
                            </label>

                            <select
                                id="feedback-status"
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            >
                                <option value="All">All statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                    </div>

                    {(search || statusFilter !== 'All') && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setStatusFilter('All');
                            }}
                            className="mt-4 text-xs font-semibold text-emerald-700 transition hover:text-emerald-900"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>

                <section>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Feedback History
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Track the status of your submitted feedback.
                            </p>
                        </div>

                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            {filteredFeedback.length}{' '}
                            {filteredFeedback.length === 1
                                ? 'result'
                                : 'results'}
                        </span>
                    </div>

                    {filteredFeedback.length > 0 ? (
                        <div className="space-y-4">
                            {filteredFeedback.map((item) => {
                                const status = item.status ?? 'Pending';

                                return (
                                    <article
                                        key={item.id}
                                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md md:p-6"
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                                    Related Project
                                                </p>

                                                <h3 className="mt-1 break-words font-bold text-slate-900">
                                                    {item.project?.project_name ??
                                                        'Project information unavailable'}
                                                </h3>

                                                <p className="mt-2 text-xs text-slate-500">
                                                    Submitted on{' '}
                                                    {formatDate(item.created_at)}
                                                </p>
                                            </div>

                                            <span
                                                className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(status)}`}
                                            >
                                                {status}
                                            </span>
                                        </div>

                                        <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50/40 p-4">
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-800">
                                                Your message
                                            </p>

                                            <p className="whitespace-pre-line break-words text-sm leading-6 text-slate-700">
                                                {item.message}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                            <p className="text-xs text-slate-500">
                                                Last updated:{' '}
                                                {formatDate(item.updated_at)}
                                            </p>

                                            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                Feedback record
                                            </span>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-emerald-200 bg-white px-6 py-12 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                >
                                    <path d="M21 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 2v-6a7.5 7.5 0 1 1 18-3.5Z" />
                                </svg>
                            </div>

                            <h3 className="mt-4 font-semibold text-slate-800">
                                {search || statusFilter !== 'All'
                                    ? 'No matching feedback'
                                    : 'No feedback submitted yet'}
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                {search || statusFilter !== 'All'
                                    ? 'Try changing your search or status filter.'
                                    : 'You can submit feedback from a project details page. Your submissions will appear here.'}
                            </p>

                            {(search || statusFilter !== 'All') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setStatusFilter('All');
                                    }}
                                    className="mt-4 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}
