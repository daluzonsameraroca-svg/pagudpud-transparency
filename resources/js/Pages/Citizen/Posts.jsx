import { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default function Posts({ posts = [] }) {
    const [search, setSearch] = useState('');

    const filteredPosts = useMemo(() => {
        const term = search.toLowerCase().trim();

        if (!term) return posts;

        return posts.filter((post) =>
            `${post.title ?? ''} ${post.content ?? ''} ${post.user?.name ?? ''}`
                .toLowerCase()
                .includes(term)
        );
    }, [posts, search]);

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

    return (
        <DashboardLayout role="citizen">
            <Head title="Administrative Posts" />

            <div className="min-h-screen space-y-6 bg-slate-50 p-5 sm:p-6 md:p-8">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        Community Updates
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                        Administrative Posts
                    </h1>

                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-slate-500">
                                Published Posts
                            </p>

                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
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
                            </span>
                        </div>

                        <p className="mt-3 text-3xl font-bold text-emerald-800">
                            {posts.length}
                        </p>

                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-slate-500">
                                Latest Update
                            </p>

                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    <rect
                                        x="3"
                                        y="5"
                                        width="18"
                                        height="16"
                                        rx="2"
                                    />
                                    <path d="M16 3v4M8 3v4M3 10h18" />
                                </svg>
                            </span>
                        </div>

                        <p className="mt-3 text-xl font-bold text-slate-800">
                            {posts.length > 0
                                ? formatDate(posts[0].created_at)
                                : 'No posts yet'}
                        </p>

                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label
                        htmlFor="post-search"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Search announcements
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
                            id="post-search"
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by title, content, or author..."
                            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                    </div>

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="mt-3 text-xs font-semibold text-emerald-700 transition hover:text-emerald-900"
                        >
                            Clear search
                        </button>
                    )}
                </div>

                <section>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Announcements
                            </h2>
                        </div>

                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            {filteredPosts.length}{' '}
                            {filteredPosts.length === 1 ? 'result' : 'results'}
                        </span>
                    </div>

                    {filteredPosts.length > 0 ? (
                        <div className="space-y-4">
                            {filteredPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md md:p-6"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0">
                                            <h3 className="break-words text-lg font-bold leading-7 text-slate-900">
                                                {post.title}
                                            </h3>

                                            <p className="mt-2 text-xs leading-5 text-slate-500">
                                                Published by{' '}
                                                <span className="font-semibold text-slate-700">
                                                    {post.user?.name ??
                                                        'Municipal Administrator'}
                                                </span>
                                                {' · '}
                                                {formatDate(post.created_at)}
                                            </p>
                                        </div>

                                        <span className="w-fit shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
                                            Announcement
                                        </span>
                                    </div>

                                    <div className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-slate-600">
                                        {post.content}
                                    </div>

                                    <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            className="h-4 w-4 text-emerald-600"
                                            aria-hidden="true"
                                        >
                                            <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                                            <path d="m9 12 2 2 4-4" />
                                        </svg>
                                        Municipal Announcement
                                    </div>
                                </article>
                            ))}
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
                                    <path d="M8 6h13M8 12h13M8 18h13" />
                                    <path d="M3 6h.01M3 12h.01M3 18h.01" />
                                </svg>
                            </div>

                            <h3 className="mt-4 font-semibold text-slate-800">
                                {search
                                    ? 'No matching announcements'
                                    : 'No announcements yet'}
                            </h3>


                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}
