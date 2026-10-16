import { Link, router, usePage } from '@inertiajs/react';

function BuildingIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d="M3 21h18" />
            <path d="M5 21V9h14v12" />
            <path d="M3 9h18L12 3 3 9Z" />
            <path d="M9 12v6M12 12v6M15 12v6" />
        </svg>
    );
}

function NavigationIcon({ type }) {
    const paths = {
        dashboard: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </>
        ),
        projects: (
            <>
                <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
                <path d="M3 9h18" />
            </>
        ),
        posts: (
            <>
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 8h8M8 12h8M8 16h5" />
            </>
        ),
        feedback: (
            <>
                <path d="M21 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 2v-6a7.5 7.5 0 1 1 18-3.5Z" />
            </>
        ),
        users: (
            <>
                <circle cx="9" cy="8" r="3" />
                <path d="M3 20v-1a6 6 0 0 1 12 0v1H3Z" />
                <path d="M16 5.5a3 3 0 0 1 0 5.8M18 14a5 5 0 0 1 3 4.5" />
            </>
        ),
        add: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v8M8 12h8" />
            </>
        ),
    };

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 shrink-0"
            aria-hidden="true"
        >
            {paths[type] || paths.dashboard}
        </svg>
    );
}

export default function Sidebar({ role }) {
    const { url, props } = usePage();
    const user = props.auth?.user;

    const logout = () => {
        router.post('/logout');
    };

    const navigation = {
        citizen: [
            {
                name: 'Home',
                href: '/citizen/dashboard',
                icon: 'dashboard',
            },
            {
                name: 'Projects',
                href: '/citizen/projects',
                icon: 'projects',
            },
            {
                name: 'Administrative Posts',
                href: '/citizen/posts',
                icon: 'posts',
            },
            {
                name: 'My Feedback',
                href: '/citizen/feedback',
                icon: 'feedback',
            },
        ],
        engineering: [
            {
                name: 'Dashboard',
                href: '/engineering/dashboard',
                icon: 'dashboard',
            },
            {
                name: 'Projects',
                href: '/engineering/projects',
                icon: 'projects',
            },
            {
                name: 'Add Project',
                href: '/engineering/projects/create',
                icon: 'add',
            },
        ],
        admin: [
            {
                name: 'Dashboard',
                href: '/admin/dashboard',
                icon: 'dashboard',
            },
            {
                name: 'Users',
                href: '/admin/users',
                icon: 'users',
            },
            {
                name: 'Projects',
                href: '/admin/projects',
                icon: 'projects',
            },
            {
                name: 'Posts',
                href: '/admin/posts',
                icon: 'posts',
            },
            {
                name: 'Feedback',
                href: '/admin/feedback',
                icon: 'feedback',
            },
        ],
    };

    const roleNames = {
        citizen: 'Citizen',
        engineering: 'Municipal Engineering Office',
        admin: 'Administrator',
    };

    const isActive = (href) => {
        if (url === href) {
            return true;
        }

        if (role === 'citizen' && href === '/citizen/projects') {
            return url.startsWith('/citizen/projects/');
        }

        if (role === 'engineering' && href === '/engineering/projects') {
            return (
                url === '/engineering/projects' ||
                /^\/engineering\/projects\/\d+$/.test(url)
            );
        }

        return false;
    };

    return (
        <aside className="fixed inset-y-0 left-0 z-40 flex h-screen w-60 flex-col border-r border-[#e2e8f0] bg-white text-[#33465e]">
            {/* Branding */}
            <div className="px-4 pb-4 pt-4">
                <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center text-[#193b63]">
                        <BuildingIcon />
                    </div>

                    <div className="min-w-0">
                        <h1 className="text-[12px] font-bold leading-4 text-[#20334b]">
                            Pagudpud
                            <br />
                            Transparency
                        </h1>

                        <p className="mt-2 text-[9px] leading-3 text-[#7b8ba0]">
                            Municipality of Pagudpud
                            <br />
                            Ilocos Norte, Philippines
                        </p>
                    </div>
                </div>

                <div className="mt-3">
                    <span className="inline-flex rounded-full bg-[#edf3fa] px-2 py-1 text-[9px] font-medium text-[#294c74]">
                        {roleNames[role] === 'Municipal Engineering Office'
                            ? 'Engineering'
                            : roleNames[role] || 'User'}
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav
                className="flex-1 overflow-y-auto px-2 py-2"
                aria-label="Main navigation"
            >
                <div className="space-y-1">
                    {navigation[role]?.map((item) => {
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex min-h-8 items-center gap-2 rounded-md px-2.5 py-2 text-[11px] font-medium transition-colors ${
                                    active
                                        ? 'bg-[#eaf1f9] text-[#183d65]'
                                        : 'text-[#64748b] hover:bg-[#f4f6f9] hover:text-[#20334b]'
                                }`}
                                aria-current={active ? 'page' : undefined}
                            >
                                <NavigationIcon type={item.icon} />
                                <span className="min-w-0">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* User Information */}
            <div className="border-t border-[#edf0f4] px-3 pb-1 pt-3">
                <p
                    className="truncate text-[10px] font-medium text-[#20334b]"
                    title={user?.name || ''}
                >
                    {user?.name || 'Signed-in User'}
                </p>

                <p className="mt-1 text-[9px] text-[#8391a4]">
                    {roleNames[role] || 'User'}
                </p>

                <button
                    type="button"
                    onClick={logout}
                    className="mt-2 flex w-full items-center gap-1.5 rounded-md py-2 text-left text-[10px] text-[#64748b] transition hover:text-[#183d65]"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                    >
                        <path d="M10 17l5-5-5-5" />
                        <path d="M15 12H3" />
                        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
                    </svg>

                    Log out
                </button>
            </div>
        </aside>
    );
}
