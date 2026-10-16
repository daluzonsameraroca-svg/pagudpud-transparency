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
            <div className="min-h-screen bg-[#f4f6f9] text-slate-800">
                {/* Page header */}
                <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
                    <div className="mx-auto flex max-w-[1500px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
                                <span>Administrator</span>
                                <span>/</span>
                                <span className="font-medium text-slate-700">
                                    Administrative Posts
                                </span>
                            </div>

                            <h1 className="text-xl font-bold tracking-tight text-[#20334b] sm:text-2xl">
                                Administrative Posts
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Publish and manage official municipal
                                announcements and information.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 sm:self-center">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            {posts.length} published{' '}
                            {posts.length === 1 ? 'post' : 'posts'}
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1500px] px-5 py-6 sm:px-8">
                    <div className="grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                        {/* Create post panel */}
                        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#20334b] text-lg text-white">
                                        +
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-semibold text-[#20334b]">
                                            Create New Post
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Write an official announcement.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form
                                onSubmit={createPost}
                                className="space-y-5 p-5"
                            >
                                <div>
                                    <label
                                        htmlFor="new-post-title"
                                        className="mb-1.5 block text-xs font-semibold text-slate-700"
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
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <div className="mb-1.5 flex items-center justify-between">
                                        <label
                                            htmlFor="new-post-content"
                                            className="text-xs font-semibold text-slate-700"
                                        >
                                            Announcement Content
                                        </label>
                                        <span className="text-[10px] text-slate-400">
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
                                        className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    />

                                    <p className="mt-1.5 text-[11px] text-slate-400">
                                        Provide clear information for citizens.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isPublishing}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#20334b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2c4664] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <span>{isPublishing ? 'Publishing...' : 'Publish Announcement'}</span>
                                    {!isPublishing && <span>→</span>}
                                </button>
                            </form>

                            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
                                <p className="text-[11px] leading-5 text-slate-500">
                                    <span className="font-semibold text-slate-700">
                                        Note:
                                    </span>{' '}
                                    Published posts provide citizens with
                                    official municipal information.
                                </p>
                            </div>
                        </section>

                        {/* Published posts */}
                        <section className="min-w-0">
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-sm font-semibold text-[#20334b]">
                                        Published Posts
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        View and manage existing announcements.
                                    </p>
                                </div>

                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        ⌕
                                    </span>
                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search posts..."
                                        aria-label="Search published posts"
                                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-64"
                                    />
                                </div>
                            </div>

                            {filteredPosts.length === 0 ? (
                                <div className="rounded-xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl text-slate-500">
                                        ▤
                                    </div>

                                    <h3 className="mt-3 text-sm font-semibold text-slate-800">
                                        {posts.length === 0
                                            ? 'No posts yet'
                                            : 'No matching posts'}
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {posts.length === 0
                                            ? 'Create your first administrative announcement using the form.'
                                            : 'Try searching with a different title, content, or author.'}
                                    </p>

                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => setSearch('')}
                                            className="mt-3 text-xs font-semibold text-blue-700 hover:text-blue-900"
                                        >
                                            Clear search
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredPosts.map((post) => (
                                        <article
                                            key={post.id}
                                            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300"
                                        >
                                            <div className="p-4 sm:p-5">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex min-w-0 gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg text-blue-700">
                                                            ▤
                                                        </div>

                                                        <div className="min-w-0">
                                                            <h3 className="break-words text-sm font-semibold leading-5 text-[#20334b]">
                                                                {post.title}
                                                            </h3>

                                                            <p className="mt-1.5 text-[11px] text-slate-400">
                                                                Published{' '}
                                                                {formatDate(
                                                                    post.created_at,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span className="w-fit shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                        Official Post
                                                    </span>
                                                </div>

                                                <div className="mt-4 border-t border-slate-100 pt-4">
                                                    <p className="whitespace-pre-line break-words text-xs leading-6 text-slate-600">
                                                        {post.content}
                                                    </p>
                                                </div>

                                                {post.user && (
                                                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                                            {post.user.name
                                                                ?.trim()
                                                                ?.charAt(0)
                                                                ?.toUpperCase() ||
                                                                'A'}
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-slate-400">
                                                                Published by
                                                            </p>
                                                            <p className="mt-0.5 text-xs font-medium text-slate-700">
                                                                {post.user.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        editingPost === post.id
                                                            ? closeEditForm()
                                                            : openEditForm(post)
                                                    }
                                                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                                                >
                                                    {editingPost === post.id
                                                        ? 'Close Editor'
                                                        : 'Edit Post'}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDeletingPost(post)
                                                    }
                                                    className="rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                                >
                                                    Delete Post
                                                </button>
                                            </div>

                                            {editingPost === post.id && (
                                                <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5">
                                                    <div className="mb-4">
                                                        <h4 className="text-sm font-semibold text-[#20334b]">
                                                            Edit Announcement
                                                        </h4>
                                                        <p className="mt-1 text-xs text-slate-500">
                                                            Make changes to the
                                                            selected post.
                                                        </p>
                                                    </div>

                                                    <form
                                                        onSubmit={(e) =>
                                                            updatePost(
                                                                e,
                                                                post.id,
                                                            )
                                                        }
                                                        className="space-y-4"
                                                    >
                                                        <div>
                                                            <label
                                                                htmlFor={`edit-title-${post.id}`}
                                                                className="mb-1.5 block text-xs font-semibold text-slate-700"
                                                            >
                                                                Post Title
                                                            </label>
                                                            <input
                                                                id={`edit-title-${post.id}`}
                                                                type="text"
                                                                name="title"
                                                                value={
                                                                    form.title
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                required
                                                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label
                                                                htmlFor={`edit-content-${post.id}`}
                                                                className="mb-1.5 block text-xs font-semibold text-slate-700"
                                                            >
                                                                Content
                                                            </label>
                                                            <textarea
                                                                id={`edit-content-${post.id}`}
                                                                name="content"
                                                                value={
                                                                    form.content
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                rows={6}
                                                                required
                                                                className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                            />
                                                        </div>

                                                        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    closeEditForm
                                                                }
                                                                disabled={
                                                                    isSaving
                                                                }
                                                                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
                                                            >
                                                                Cancel
                                                            </button>

                                                            <button
                                                                type="submit"
                                                                disabled={
                                                                    isSaving
                                                                }
                                                                className="rounded-lg bg-[#20334b] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2c4664] disabled:cursor-not-allowed disabled:opacity-60"
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

                            <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-[11px] text-slate-500">
                                <span>
                                    Showing {filteredPosts.length} of{' '}
                                    {posts.length} posts
                                </span>
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="font-semibold text-blue-700 hover:text-blue-900"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        </section>
                    </div>
                </main>

                {/* Delete confirmation modal */}
                {deletingPost && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
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
                            className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-2xl"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600">
                                !
                            </div>

                            <h2
                                id="delete-post-title"
                                className="mt-4 text-base font-bold text-slate-900"
                            >
                                Delete Post?
                            </h2>

                            <p className="mt-2 break-words text-sm leading-6 text-slate-500">
                                Are you sure you want to delete{' '}
                                <span className="font-semibold text-slate-800">
                                    {deletingPost.title}
                                </span>
                                ?
                            </p>

                            <p className="mt-2 text-xs text-red-600">
                                This action cannot be undone.
                            </p>

                            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setDeletingPost(null)}
                                    disabled={isDeleting}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="rounded-lg bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
