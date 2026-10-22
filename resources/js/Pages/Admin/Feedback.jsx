import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default function Feedback({ feedback = [] }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [updatingId, setUpdatingId] = useState(null);

    const updateStatus = (item, status) => {
        if (item.status === status || updatingId === item.id) {
            return;
        }

        setUpdatingId(item.id);

        router.put(
            `/admin/feedback/${item.id}`,
            { status },
            {
                preserveScroll: true,
                onFinish: () => setUpdatingId(null),
            },
        );
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-amber-50 text-amber-800 ring-amber-600/20';
            case 'Reviewed':
                return 'bg-blue-50 text-blue-800 ring-blue-600/20';
            case 'Resolved':
                return 'bg-emerald-50 text-emerald-800 ring-emerald-600/20';
            default:
                return 'bg-slate-100 text-slate-700 ring-slate-500/20';
        }
    };

    const formatDate = (date) => {
        if (!date) return 'Unknown date';

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Unknown date';
        }

        return parsedDate.toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const counts = useMemo(
        () => ({
            total: feedback.length,
            pending: feedback.filter((item) => item.status === 'Pending').length,
            reviewed: feedback.filter((item) => item.status === 'Reviewed').length,
            resolved: feedback.filter((item) => item.status === 'Resolved').length,
        }),
        [feedback],
    );

    const filteredFeedback = useMemo(() => {
        const query = search.trim().toLowerCase();

        return feedback.filter((item) => {
            const matchesStatus =
                statusFilter === 'All' || item.status === statusFilter;

            const searchableText = [
                item.project?.project_name,
                item.project?.location,
                item.message,
                item.user?.name,
                item.user?.email,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return matchesStatus && (!query || searchableText.includes(query));
        });
    }, [feedback, search, statusFilter]);

    const summaryCards = [
        {
            label: 'Total Feedback',
            value: counts.total,
            icon: '▤',
            iconClass: 'bg-emerald-50 text-emerald-700',
        },
        {
            label: 'Pending',
            value: counts.pending,
            icon: '◷',
            iconClass: 'bg-amber-50 text-amber-700',
        },
        {
            label: 'Reviewed',
            value: counts.reviewed,
            icon: '◉',
            iconClass: 'bg-blue-50 text-blue-700',
        },
        {
            label: 'Resolved',
            value: counts.resolved,
            icon: '✓',
            iconClass: 'bg-emerald-100 text-emerald-800',
        },
    ];

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('All');
    };

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-slate-50 text-slate-800">
                <header className="border-b border-slate-200 bg-white px-5 py-6 sm:px-8">
                    <div className="mx-auto max-w-[1500px]">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                    Public Feedback
                                </h1>
                            </div>

                            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                Citizen submissions
                            </div>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8">
                    <section
                        aria-label="Feedback summary"
                        className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                    >
                        {summaryCards.map((card) => (
                            <div
                                key={card.label}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">
                                            {card.label}
                                        </p>
                                        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                                            {card.value}
                                        </p>
                                    </div>

                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${card.iconClass}`}
                                    >
                                        {card.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section>
                        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Citizen Submissions
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
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search feedback..."
                                        aria-label="Search citizen feedback"
                                        className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:w-72"
                                    />
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    aria-label="Filter feedback by status"
                                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                >
                                    <option value="All">All statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Reviewed">Reviewed</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </div>
                        </div>

                        {filteredFeedback.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-700">
                                    ▤
                                </div>

                                <h3 className="mt-4 text-lg font-bold text-slate-900">
                                    {feedback.length === 0
                                        ? 'No feedback yet'
                                        : 'No matching feedback'}
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
                            <div className="space-y-5">
                                {filteredFeedback.map((item) => (
                                    <article
                                        key={item.id}
                                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
                                            <div className="flex min-w-0 gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-lg font-bold text-emerald-800">
                                                    P
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                                                        Related Project
                                                    </p>
                                                    <h3 className="mt-1.5 break-words text-base font-bold leading-6 text-slate-900 sm:text-lg">
                                                        {item.project?.project_name ||
                                                            'Project unavailable'}
                                                    </h3>
                                                    <p className="mt-2 flex items-start gap-2 text-sm leading-5 text-slate-600">
                                                        <span aria-hidden="true">⌖</span>
                                                        <span>
                                                            {item.project?.location ||
                                                                'Location unavailable'}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${getStatusClass(item.status)}`}
                                            >
                                                {item.status || 'Unknown'}
                                            </span>
                                        </div>

                                        <div className="px-5 py-5 sm:px-6">
                                            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-5">
                                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                                                    Citizen Feedback
                                                </p>
                                                <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-slate-700">
                                                    {item.message}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid gap-5 border-t border-slate-100 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3 sm:px-6">
                                            <div className="flex min-w-0 items-start gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                                                    {item.user?.name
                                                        ?.trim()
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-slate-500">
                                                        Submitted by
                                                    </p>
                                                    <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                                                        {item.user?.name ||
                                                            'Unknown citizen'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-sm text-slate-500">
                                                    Email Address
                                                </p>
                                                <p className="mt-1 break-all text-sm font-medium text-slate-800">
                                                    {item.user?.email ||
                                                        'Not available'}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    Date Submitted
                                                </p>
                                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                                    {formatDate(item.created_at)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                            <div>
                                                <p className="text-base font-bold text-slate-900">
                                                    Manage Feedback Status
                                                </p>
                                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                                    Update the status after reviewing
                                                    this submission.
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3">
                                                {updatingId === item.id && (
                                                    <span
                                                        className="text-sm font-medium text-emerald-700"
                                                        aria-live="polite"
                                                    >
                                                        Updating...
                                                    </span>
                                                )}

                                                <select
                                                    value={item.status || 'Pending'}
                                                    disabled={updatingId === item.id}
                                                    onChange={(e) =>
                                                        updateStatus(
                                                            item,
                                                            e.target.value,
                                                        )
                                                    }
                                                    aria-label={`Update status for feedback on ${item.project?.project_name || 'project'}`}
                                                    className="min-w-40 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-wait disabled:opacity-60"
                                                >
                                                    <option value="Pending">
                                                        Pending
                                                    </option>
                                                    <option value="Reviewed">
                                                        Reviewed
                                                    </option>
                                                    <option value="Resolved">
                                                        Resolved
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing{' '}
                                <strong className="font-bold text-slate-900">
                                    {filteredFeedback.length}
                                </strong>{' '}
                                of{' '}
                                <strong className="font-bold text-slate-900">
                                    {feedback.length}
                                </strong>{' '}
                                submissions
                            </span>

                            {(search || statusFilter !== 'All') && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="self-start rounded-lg px-3 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-50 sm:self-auto"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </DashboardLayout>
    );
}
