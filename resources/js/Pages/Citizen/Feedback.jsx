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

        return new Date(date).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusStyle = (status) => {
        switch ((status ?? 'Pending').toLowerCase()) {
            case 'resolved':
                return 'bg-green-50 text-green-700';
            case 'reviewed':
                return 'bg-blue-50 text-blue-700';
            case 'pending':
                return 'bg-amber-50 text-amber-700';
            default:
                return 'bg-slate-100 text-slate-600';
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

    return (
        <DashboardLayout role="citizen">
            <Head title="My Feedback" />

            <div className="min-h-screen space-y-6 p-6 md:p-8">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                        Citizen Participation
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-[#20334b]">
                        My Feedback
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        View the feedback you have submitted about municipal projects and check its status.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Total Feedback</p>
                        <p className="mt-2 text-3xl font-bold text-[#203f68]">
                            {feedback.length}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Pending</p>
                        <p className="mt-2 text-3xl font-bold text-amber-600">
                            {pendingCount}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Reviewed</p>
                        <p className="mt-2 text-3xl font-bold text-blue-700">
                            {reviewedCount}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Resolved</p>
                        <p className="mt-2 text-3xl font-bold text-green-700">
                            {resolvedCount}
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_200px]">
                    <div>
                        <label
                            htmlFor="feedback-search"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Search feedback
                        </label>
                        <input
                            id="feedback-search"
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search project or message..."
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
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
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="All">All statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[#20334b]">
                            Feedback History
                        </h2>
                        <span className="text-sm text-slate-500">
                            {filteredFeedback.length} result(s)
                        </span>
                    </div>

                    {filteredFeedback.length > 0 ? (
                        <div className="space-y-4">
                            {filteredFeedback.map((item) => {
                                const status = item.status ?? 'Pending';

                                return (
                                    <article
                                        key={item.id}
                                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h3 className="font-bold text-[#20334b]">
                                                    {item.project?.project_name ??
                                                        'Project information unavailable'}
                                                </h3>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Submitted on {formatDate(item.created_at)}
                                                </p>
                                            </div>

                                            <span
                                                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(status)}`}
                                            >
                                                {status}
                                            </span>
                                        </div>

                                        <div className="mt-4 rounded-lg bg-slate-50 p-4">
                                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Your message
                                            </p>
                                            <p className="whitespace-pre-line break-words text-sm leading-6 text-slate-700">
                                                {item.message}
                                            </p>
                                        </div>

                                        <p className="mt-3 text-xs text-slate-500">
                                            Last updated: {formatDate(item.updated_at)}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500">
                                i
                            </div>
                            <h3 className="mt-4 font-semibold text-[#20334b]">
                                {search || statusFilter !== 'All'
                                    ? 'No matching feedback'
                                    : 'No feedback submitted yet'}
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                {search || statusFilter !== 'All'
                                    ? 'Try changing your search or status filter.'
                                    : 'You can submit feedback from a project details page. Your submissions will appear here.'}
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}