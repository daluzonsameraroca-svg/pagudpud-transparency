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
                return 'bg-amber-50 text-amber-700 ring-amber-600/20';
            case 'Reviewed':
                return 'bg-blue-50 text-blue-700 ring-blue-600/20';
            case 'Resolved':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
            default:
                return 'bg-slate-100 text-slate-600 ring-slate-500/20';
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
            description: 'All citizen submissions',
            icon: '▤',
            iconClass: 'bg-slate-100 text-slate-600',
        },
        {
            label: 'Pending',
            value: counts.pending,
            description: 'Waiting for review',
            icon: '◷',
            iconClass: 'bg-amber-50 text-amber-700',
        },
        {
            label: 'Reviewed',
            value: counts.reviewed,
            description: 'Currently reviewed',
            icon: '◉',
            iconClass: 'bg-blue-50 text-blue-700',
        },
        {
            label: 'Resolved',
            value: counts.resolved,
            description: 'Marked as resolved',
            icon: '✓',
            iconClass: 'bg-emerald-50 text-emerald-700',
        },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-[#f4f6f9] text-slate-800">
                {/* Page header */}
                <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
                    <div className="mx-auto max-w-[1500px]">
                        <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
                            <span>Administrator</span>
                            <span>/</span>
                            <span className="font-medium text-slate-700">
                                Public Feedback
                            </span>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-[#20334b] sm:text-2xl">
                                    Public Feedback
                                </h1>
                                <p className="mt-1 text-sm text-slate-500">
                                    Review citizen concerns and manage feedback
                                    about local government projects.
                                </p>
                            </div>

                            <div className="flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 sm:self-center">
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                Citizen submissions
                            </div>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1500px] px-5 py-6 sm:px-8">
                    {/* Summary cards */}
                    <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {summaryCards.map((card) => (
                            <div
                                key={card.label}
                                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500">
                                            {card.label}
                                        </p>
                                        <p className="mt-2 text-2xl font-bold tracking-tight text-[#20334b]">
                                            {card.value}
                                        </p>
                                        <p className="mt-1 text-[11px] text-slate-400">
                                            {card.description}
                                        </p>
                                    </div>

                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg font-semibold ${card.iconClass}`}
                                    >
                                        {card.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Feedback list header and filters */}
                    <section>
                        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-[#20334b]">
                                    Citizen Submissions
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Review project feedback and update its status.
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
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search feedback..."
                                        aria-label="Search citizen feedback"
                                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-64"
                                    />
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    aria-label="Filter feedback by status"
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="All">All statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Reviewed">Reviewed</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </div>
                        </div>

                        {filteredFeedback.length === 0 ? (
                            <div className="rounded-xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl text-slate-500">
                                    ▤
                                </div>

                                <h3 className="mt-3 text-sm font-semibold text-slate-800">
                                    {feedback.length === 0
                                        ? 'No feedback yet'
                                        : 'No matching feedback'}
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    {feedback.length === 0
                                        ? 'Citizen submissions will appear here when received.'
                                        : 'Try another search term or select a different status.'}
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
                            <div className="space-y-4">
                                {filteredFeedback.map((item) => (
                                    <article
                                        key={item.id}
                                        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                                    >
                                        {/* Project and status */}
                                        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
                                            <div className="flex min-w-0 gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#20334b] text-sm font-semibold text-white">
                                                    P
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                        Related Project
                                                    </p>
                                                    <h3 className="mt-1 break-words text-sm font-semibold text-[#20334b]">
                                                        {item.project?.project_name ||
                                                            'Project unavailable'}
                                                    </h3>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        <span className="mr-1">⌖</span>
                                                        {item.project?.location ||
                                                            'Location unavailable'}
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${getStatusClass(item.status)}`}
                                            >
                                                {item.status || 'Unknown'}
                                            </span>
                                        </div>

                                        {/* Message */}
                                        <div className="px-4 py-4 sm:px-5">
                                            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                    Citizen Feedback
                                                </p>
                                                <p className="mt-2 whitespace-pre-line break-words text-xs leading-6 text-slate-700">
                                                    {item.message}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Citizen details */}
                                        <div className="grid gap-4 border-t border-slate-100 px-4 py-4 sm:grid-cols-3 sm:px-5">
                                            <div className="flex min-w-0 items-start gap-2.5">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                                    {item.user?.name
                                                        ?.trim()
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-slate-400">
                                                        Submitted by
                                                    </p>
                                                    <p className="mt-1 break-words text-xs font-semibold text-slate-700">
                                                        {item.user?.name ||
                                                            'Unknown citizen'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-[10px] text-slate-400">
                                                    Email Address
                                                </p>
                                                <p className="mt-1 break-all text-xs text-slate-700">
                                                    {item.user?.email ||
                                                        'Not available'}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] text-slate-400">
                                                    Date Submitted
                                                </p>
                                                <p className="mt-1 text-xs font-medium text-slate-700">
                                                    {formatDate(item.created_at)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status management */}
                                        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                            <div>
                                                <p className="text-xs font-semibold text-slate-700">
                                                    Manage Feedback Status
                                                </p>
                                                <p className="mt-1 text-[11px] text-slate-500">
                                                    Update the status after reviewing
                                                    this submission.
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {updatingId === item.id && (
                                                    <span
                                                        className="text-[11px] text-slate-500"
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
                                                    className="min-w-36 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-wait disabled:opacity-60"
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

                        <div className="mt-4 flex flex-col gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing {filteredFeedback.length} of{' '}
                                {feedback.length} submissions
                            </span>
                            {(search || statusFilter !== 'All') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setStatusFilter('All');
                                    }}
                                    className="self-start font-semibold text-blue-700 hover:text-blue-900 sm:self-auto"
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
