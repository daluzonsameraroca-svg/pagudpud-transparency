import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default function Posts({ posts = [] }) {
    const [editingPost, setEditingPost] = useState(null);
    const [deletingPost, setDeletingPost] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [search, setSearch] = useState('');

    const emptyForm = {
        title: '',
        content: '',
    };

    const [form, setForm] = useState(emptyForm);

    const filteredPosts = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return posts;

        return posts.filter((post) =>
            [post.title, post.content, post.user?.name].some((value) =>
                String(value || '').toLowerCase().includes(query),
            ),
        );
    }, [posts, search]);

    const openEditForm = (post) => {
        setEditingPost(post.id);
        setForm({
            title: post.title || '',
            content: post.content || '',
        });
    };

    const closeEditForm = () => {
        setEditingPost(null);
        setForm(emptyForm);
    };

    const handleChange = (e) => {
        setForm((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }));
    };

    const createPost = (e) => {
        e.preventDefault();
        setIsPublishing(true);

        router.post(
            '/admin/posts',
            {
                title: form.title,
                content: form.content,
            },
            {
                preserveScroll: true,
                onSuccess: () => setForm(emptyForm),
                onFinish: () => setIsPublishing(false),
            },
        );
    };

    const updatePost = (e, postId) => {
        e.preventDefault();
        setIsSaving(true);

        router.put(
            `/admin/posts/${postId}`,
            {
                title: form.title,
                content: form.content,
            },
            {
                preserveScroll: true,
                onSuccess: closeEditForm,
                onFinish: () => setIsSaving(false),
            },
        );
    };

    const confirmDelete = () => {
        if (!deletingPost || isDeleting) return;

        setIsDeleting(true);

        router.delete(`/admin/posts/${deletingPost.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeletingPost(null),
            onFinish: () => setIsDeleting(false),
        });
    };

    const formatDate = (date) => {
        if (!date) return 'Unknown date';

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return 'Unknown date';

        return parsedDate.toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-slate-50 text-slate-800">
                <header className="border-b border-slate-200 bg-white px-5 py-6 sm:px-8">
                    <div className="mx-auto flex max-w-[1500px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Administrative Posts
                            </h1>

                        </div>

                        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            {posts.length} published{' '}
                            {posts.length === 1 ? 'post' : 'posts'}
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8">
                    <div className="grid items-start gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-5 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl font-bold text-emerald-800">
                                        +
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            Create New Post
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={createPost} className="space-y-5 p-5">
                                <div>
                                    <label
                                        htmlFor="new-post-title"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Post Title
                                    </label>

                                    <input
                                        id="new-post-title"
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="Enter announcement title"
                                        required
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                    />
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <label
                                            htmlFor="new-post-content"
                                            className="text-sm font-semibold text-slate-700"
                                        >
                                            Announcement Content
                                        </label>
                                        <span className="text-xs text-slate-500">
                                            Required
                                        </span>
                                    </div>

                                    <textarea
                                        id="new-post-content"
                                        name="content"
                                        value={form.content}
                                        onChange={handleChange}
                                        rows={9}
                                        placeholder="Write the announcement details here..."
                                        required
                                        className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                    />

                                </div>

                                <button
                                    type="submit"
                                    disabled={isPublishing}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <span>
                                        {isPublishing
                                            ? 'Publishing...'
                                            : 'Publish Announcement'}
                                    </span>
                                </button>
                            </form>

                        </section>

                        <section className="min-w-0">
                            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Published Posts
                                    </h2>
                                </div>

                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                                        ⌕
                                    </span>
                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search posts..."
                                        aria-label="Search published posts"
                                        className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:w-72"
                                    />
                                </div>
                            </div>

                            {filteredPosts.length === 0 ? (
                                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-700">
                                        ▤
                                    </div>

                                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                                        {posts.length === 0
                                            ? 'No posts yet'
                                            : 'No matching posts'}
                                    </h3>


                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => setSearch('')}
                                            className="mt-5 rounded-lg px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                                        >
                                            Clear search
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {filteredPosts.map((post) => (
                                        <article
                                            key={post.id}
                                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                                        >
                                            <div className="p-5 sm:p-6">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex min-w-0 gap-4">
                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl text-emerald-800">
                                                            ▤
                                                        </div>

                                                        <div className="min-w-0">
                                                            <h3 className="break-words text-base font-bold leading-6 text-slate-900 sm:text-lg">
                                                                {post.title}
                                                            </h3>

                                                            <p className="mt-2 text-sm text-slate-500">
                                                                Published{' '}
                                                                {formatDate(post.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span className="w-fit shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
                                                        Official Post
                                                    </span>
                                                </div>

                                                <div className="mt-5 border-t border-slate-100 pt-5">
                                                    <p className="whitespace-pre-line break-words text-sm leading-7 text-slate-700">
                                                        {post.content}
                                                    </p>
                                                </div>

                                                {post.user && (
                                                    <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                                                            {post.user.name
                                                                ?.trim()
                                                                ?.charAt(0)
                                                                ?.toUpperCase() || 'A'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm text-slate-500">
                                                                Published by
                                                            </p>
                                                            <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                                                                {post.user.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        editingPost === post.id
                                                            ? closeEditForm()
                                                            : openEditForm(post)
                                                    }
                                                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                                                >
                                                    {editingPost === post.id
                                                        ? 'Close Editor'
                                                        : 'Edit Post'}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setDeletingPost(post)}
                                                    className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                                                >
                                                    Delete Post
                                                </button>
                                            </div>

                                            {editingPost === post.id && (
                                                <div className="border-t border-emerald-200 bg-emerald-50/40 p-5 sm:p-6">
                                                    <div className="mb-5">
                                                        <h4 className="text-lg font-bold text-slate-900">
                                                            Edit Announcement
                                                        </h4>
                                                        <p className="mt-1 text-sm text-slate-600">
                                                            Make changes to the selected post.
                                                        </p>
                                                    </div>

                                                    <form
                                                        onSubmit={(e) =>
                                                            updatePost(e, post.id)
                                                        }
                                                        className="space-y-5"
                                                    >
                                                        <div>
                                                            <label
                                                                htmlFor={`edit-title-${post.id}`}
                                                                className="mb-2 block text-sm font-semibold text-slate-700"
                                                            >
                                                                Post Title
                                                            </label>
                                                            <input
                                                                id={`edit-title-${post.id}`}
                                                                type="text"
                                                                name="title"
                                                                value={form.title}
                                                                onChange={handleChange}
                                                                required
                                                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label
                                                                htmlFor={`edit-content-${post.id}`}
                                                                className="mb-2 block text-sm font-semibold text-slate-700"
                                                            >
                                                                Content
                                                            </label>
                                                            <textarea
                                                                id={`edit-content-${post.id}`}
                                                                name="content"
                                                                value={form.content}
                                                                onChange={handleChange}
                                                                rows={6}
                                                                required
                                                                className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                                            />
                                                        </div>

                                                        <div className="flex flex-col-reverse gap-3 border-t border-emerald-100 pt-5 sm:flex-row sm:justify-end">
                                                            <button
                                                                type="button"
                                                                onClick={closeEditForm}
                                                                disabled={isSaving}
                                                                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                                                            >
                                                                Cancel
                                                            </button>

                                                            <button
                                                                type="submit"
                                                                disabled={isSaving}
                                                                className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                {isSaving
                                                                    ? 'Saving...'
                                                                    : 'Save Changes'}
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            )}

                            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                                <span>
                                    Showing{' '}
                                    <strong className="font-bold text-slate-900">
                                        {filteredPosts.length}
                                    </strong>{' '}
                                    of{' '}
                                    <strong className="font-bold text-slate-900">
                                        {posts.length}
                                    </strong>{' '}
                                    posts
                                </span>

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="self-start rounded-lg px-3 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-50 sm:self-auto"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        </section>
                    </div>
                </main>

                {deletingPost && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                        onMouseDown={(e) => {
                            if (
                                e.target === e.currentTarget &&
                                !isDeleting
                            ) {
                                setDeletingPost(null);
                            }
                        }}
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="delete-post-title"
                            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl font-bold text-red-600">
                                !
                            </div>

                            <h2
                                id="delete-post-title"
                                className="mt-5 text-xl font-bold text-slate-900"
                            >
                                Delete Post?
                            </h2>

                            <p className="mt-3 break-words text-sm leading-7 text-slate-600">
                                Are you sure you want to delete{' '}
                                <span className="font-semibold text-slate-900">
                                    {deletingPost.title}
                                </span>
                                ?
                            </p>

                            <p className="mt-2 text-sm text-red-600">
                                This action cannot be undone.
                            </p>

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setDeletingPost(null)}
                                    disabled={isDeleting}
                                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
