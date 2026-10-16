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

        return new Date(date).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <DashboardLayout role="citizen">
            <Head title="Administrative Posts" />

            <div className="min-h-screen space-y-6 p-6 md:p-8">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                        Community Updates
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-[#20334b]">
                        Administrative Posts
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Read announcements and updates published by the municipality.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Published Posts</p>
                        <p className="mt-2 text-3xl font-bold text-[#203f68]">
                            {posts.length}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Latest Update</p>
                        <p className="mt-2 text-lg font-semibold text-[#20334b]">
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

                    <input
                        id="post-search"
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by title, content, or author..."
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[#20334b]">
                            Announcements
                        </h2>
                        <span className="text-sm text-slate-500">
                            {filteredPosts.length} result(s)
                        </span>
                    </div>

                    {filteredPosts.length > 0 ? (
                        <div className="space-y-4">
                            {filteredPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:p-6"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-[#20334b]">
                                                {post.title}
                                            </h3>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Published by{' '}
                                                <span className="font-medium text-slate-700">
                                                    {post.user?.name ?? 'Municipal Administrator'}
                                                </span>
                                                {' · '}
                                                {formatDate(post.created_at)}
                                            </p>
                                        </div>

                                        <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                            Announcement
                                        </span>
                                    </div>

                                    <div className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-slate-600">
                                        {post.content}
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500">
                                i
                            </div>
                            <h3 className="mt-4 font-semibold text-[#20334b]">
                                {search ? 'No matching announcements' : 'No announcements yet'}
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                {search
                                    ? 'Try a different search term.'
                                    : 'Municipal announcements will appear here when they are published.'}
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}