import { router, useForm, Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default function Feedback({ feedback = [] }) {
    const [statusFilter, setStatusFilter] = useState('All');
    const [editingFeedbackId, setEditingFeedbackId] = useState(null);
    const {
        data,
        setData,
        post,
        processing,
        errors,
        clearErrors,
        reset,
    } = useForm({
        message: '',
        image: null,
        remove_image: false,
        _method: 'put',
    });

    const startEditing = (item) => {
        clearErrors();
        setData({
            message: item.message,
            image: null,
            remove_image: false,
            _method: 'put',
        });
        setEditingFeedbackId(item.id);
    };

    const cancelEditing = () => {
        reset();
        clearErrors();
        setEditingFeedbackId(null);
    };

    const submitEdit = (event, feedbackId) => {
        event.preventDefault();

        post(`/citizen/feedback/${feedbackId}`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setEditingFeedbackId(null);
            },
        });
    };

    const deleteFeedback = (feedbackId) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) {
            return;
        }

        router.delete(`/citizen/feedback/${feedbackId}`, {
            preserveScroll: true,
        });
    };

    const filteredFeedback = useMemo(() => {
        return feedback.filter((item) => {
            const status = item.status ?? 'Pending';
            const matchesStatus =
                statusFilter === 'All' ||
                status.toLowerCase() === statusFilter.toLowerCase();

            return matchesStatus;
        });
    }, [feedback, statusFilter]);

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
                return 'bg-blue-50 text-blue-700 ring-blue-200';
            case 'reviewed':
                return 'bg-blue-50 text-blue-700 ring-blue-200';
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
            icon: 'total',
            color: 'text-blue-800',
            iconBg: 'bg-blue-50 text-blue-700',
        },
        {
            label: 'Pending',
            count: pendingCount,
            icon: 'pending',
            color: 'text-amber-600',
            iconBg: 'bg-amber-50 text-amber-700',
        },
        {
            label: 'Reviewed',
            count: reviewedCount,
            icon: 'reviewed',
            color: 'text-blue-700',
            iconBg: 'bg-blue-50 text-blue-700',
        },
        {
            label: 'Resolved',
            count: resolvedCount,
            icon: 'resolved',
            color: 'text-blue-700',
            iconBg: 'bg-blue-50 text-blue-700',
        },
    ];

    return (
        <DashboardLayout role="citizen">
            <Head title="My Feedback" />

            <div className="min-h-screen space-y-6 bg-slate-50 p-5 sm:p-6 md:p-8">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                        Citizen Participation
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                        My Feedback
                    </h1>

                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((card) => (
                        <div
                            key={card.label}
                            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
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

                        </div>
                    ))}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold text-slate-800">
                            Filter Feedback
                        </h2>
                    </div>

                    <div className="max-w-xs">
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
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="All">All statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>

                    {statusFilter !== 'All' && (
                        <button
                            type="button"
                            onClick={() => setStatusFilter('All')}
                            className="mt-4 text-xs font-semibold text-blue-700 transition hover:text-blue-900"
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
                        </div>

                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
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
                                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md md:p-6"
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
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

                                        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/40 p-4">
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-800">
                                                Your message
                                            </p>

                                            {editingFeedbackId === item.id ? (
                                                <form
                                                    onSubmit={(event) =>
                                                        submitEdit(
                                                            event,
                                                            item.id,
                                                        )
                                                    }
                                                    className="space-y-4"
                                                >
                                                    <div>
                                                        <label
                                                            htmlFor={`feedback-message-${item.id}`}
                                                            className="sr-only"
                                                        >
                                                            Edit your feedback
                                                        </label>
                                                        <textarea
                                                            id={`feedback-message-${item.id}`}
                                                            value={data.message}
                                                            onChange={(event) =>
                                                                setData(
                                                                    'message',
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            rows={4}
                                                            maxLength={2000}
                                                            required
                                                            className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm leading-5 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                        />
                                                        {errors.message && (
                                                            <p
                                                                className="mt-2 text-xs text-red-600"
                                                                role="alert"
                                                            >
                                                                {errors.message}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label
                                                            htmlFor={`feedback-image-${item.id}`}
                                                            className="mb-2 block text-xs font-semibold text-slate-700"
                                                        >
                                                            Replace photo
                                                            (optional)
                                                        </label>
                                                        <input
                                                            id={`feedback-image-${item.id}`}
                                                            type="file"
                                                            accept="image/jpeg,image/png,image/webp"
                                                            onChange={(event) =>
                                                                setData({
                                                                    ...data,
                                                                    image:
                                                                        event
                                                                            .target
                                                                            .files?.[0] ??
                                                                        null,
                                                                    remove_image: false,
                                                                })
                                                            }
                                                            disabled={processing}
                                                            className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                                                        />
                                                        {errors.image && (
                                                            <p
                                                                className="mt-2 text-xs text-red-600"
                                                                role="alert"
                                                            >
                                                                {errors.image}
                                                            </p>
                                                        )}
                                                        {item.image_path && (
                                                            <label className="mt-3 flex items-center gap-2 text-xs text-slate-700">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        data.remove_image
                                                                    }
                                                                    onChange={(
                                                                        event,
                                                                    ) =>
                                                                        setData(
                                                                            'remove_image',
                                                                            event
                                                                                .target
                                                                                .checked,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                                />
                                                                Remove current
                                                                photo
                                                            </label>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                processing ||
                                                                !data.message.trim()
                                                            }
                                                            className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {processing
                                                                ? 'Saving...'
                                                                : 'Save changes'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                cancelEditing
                                                            }
                                                            disabled={
                                                                processing
                                                            }
                                                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <p className="whitespace-pre-line break-words text-sm leading-6 text-slate-700">
                                                    {item.message}
                                                </p>
                                            )}
                                        </div>

                                        {item.image_url &&
                                            editingFeedbackId !== item.id && (
                                            <img
                                                src={item.image_url}
                                                alt={`Photo attached to feedback for ${item.project?.project_name || 'project'}`}
                                                loading="lazy"
                                                className="mt-4 max-h-80 w-full rounded-lg border border-slate-200 object-contain sm:w-auto"
                                            />
                                        )}

                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                            <p className="text-xs text-slate-500">
                                                Last updated:{' '}
                                                {formatDate(item.updated_at)}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-2">
                                                {editingFeedbackId !==
                                                    item.id && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                startEditing(
                                                                    item,
                                                                )
                                                            }
                                                            className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteFeedback(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                                    Feedback record
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-blue-200 bg-white px-6 py-12 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-700">
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
                                {statusFilter !== 'All'
                                    ? 'No matching feedback'
                                    : 'No feedback submitted yet'}
                            </h3>

                            {statusFilter !== 'All' && (
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter('All')}
                                    className="mt-4 rounded-lg bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-800"
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
