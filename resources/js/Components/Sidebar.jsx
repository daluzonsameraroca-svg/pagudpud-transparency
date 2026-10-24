
import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

function Icon({ name, size = 20 }) {
    const paths = {
        dashboard: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
            </>
        ),
        projects: (
            <>
                <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" />
                <path d="m3.5 7.5 8.5 4.4 8.5-4.4M12 12v9" />
            </>
        ),
        posts: (
            <>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M8 13h8M8 17h8" />
            </>
        ),
        feedback: (
            <>
                <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
            </>
        ),
        users: (
            <>
                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
                <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </>
        ),
        plus: <path d="M12 5v14M5 12h14" />,
        logout: <path d="M5 21h14M7 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M11 12h.01" />,
        menu: <path d="M4 6h16M4 12h16M4 18h16" />,
        close: <path d="m18 6-12 12M6 6l12 12" />,
        building: (
            <>
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" />
                <path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
            </>
        ),
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {paths[name] || paths.dashboard}
        </svg>
    );
}

const navigationByRole = {
    citizen: [
        {
            section: 'MAIN MENU',
            items: [
                { label: 'Home', href: '/citizen/dashboard', icon: 'dashboard' },
                { label: 'Projects', href: '/citizen/projects', icon: 'projects' },
            ],
        },
        {
            section: 'COMMUNITY',
            items: [
                { label: 'Administrative Posts', href: '/citizen/posts', icon: 'posts' },
                { label: 'My Feedback', href: '/citizen/feedback', icon: 'feedback' },
            ],
        },
    ],
    engineering: [
        {
            section: 'MAIN MENU',
            items: [
                { label: 'Home', href: '/engineering/dashboard', icon: 'dashboard' },
                { label: 'Projects', href: '/engineering/projects', icon: 'projects' },
                { label: 'Add Project', href: '/engineering/projects/create', icon: 'plus' },
            ],
        },
    ],
    admin: [
        {
            section: 'MAIN MENU',
            items: [
                { label: 'Home', href: '/admin/dashboard', icon: 'dashboard' },
            ],
        },
        {
            section: 'MANAGEMENT',
            items: [
                { label: 'Users', href: '/admin/users', icon: 'users' },
                { label: 'Projects', href: '/admin/projects', icon: 'projects' },
                { label: 'Posts', href: '/admin/posts', icon: 'posts' },
                { label: 'Feedback', href: '/admin/feedback', icon: 'feedback' },
            ],
        },
    ],
};

function getInitials(name = 'User') {
    return name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
}

function isActiveRoute(href, pathname) {
    if (pathname === href) {
        return true;
    }

    if (href === '/citizen/projects') {
        return pathname.startsWith('/citizen/projects/');
    }

    if (href === '/engineering/projects') {
        return (
            /^\/engineering\/projects\/\d+$/.test(pathname) ||
            /^\/engineering\/projects\/\d+\/edit$/.test(pathname)
        );
    }

    if (href === '/admin/projects') {
        return /^\/admin\/projects\/\d+(\/edit)?$/.test(pathname);
    }

    return false;
}

export default function Sidebar({
    role = 'citizen',
    isDesktopCollapsed = true,
    setIsDesktopCollapsed = () => {},
}) {
    const { url, props } = usePage();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const pathname = url.split('?')[0];
    const user = props.auth?.user;
    const navigation = navigationByRole[role] || navigationByRole.citizen;
    const feedbackProjects = props.citizenFeedbackProjects || [];
    const displayName = user?.name || 'User';
    const email = user?.email || '';
    const toggleSidebar = () => {
        setIsDesktopCollapsed((current) => !current);
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                type="button"
                onClick={() => setIsMobileOpen(true)}
                aria-label="Open navigation menu"
                className="fixed left-4 top-4 z-[80] flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-800 shadow-sm transition duration-200 hover:scale-105 hover:bg-blue-50 motion-reduce:transition-none motion-reduce:hover:scale-100 lg:hidden"
            >
                <Icon name="menu" size={22} />
            </button>

            {/* Mobile backdrop */}
            <button
                type="button"
                aria-label="Close navigation menu"
                aria-hidden={!isMobileOpen}
                tabIndex={isMobileOpen ? 0 : -1}
                onClick={() => setIsMobileOpen(false)}
                className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none lg:hidden ${
                    isMobileOpen
                        ? 'opacity-100'
                        : 'pointer-events-none opacity-0'
                }`}
            />

            <aside
                className={`fixed inset-y-0 left-0 ${
                    isMobileOpen || !isDesktopCollapsed ? 'z-[100]' : 'z-50'
                } flex max-w-[85vw] flex-col border-r border-blue-100 bg-white shadow-xl transition-[width,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:max-w-none lg:translate-x-0 lg:shadow-sm ${
                    isMobileOpen ? 'w-72 translate-x-0' : '-translate-x-full'
                } ${isDesktopCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
            >
                <div
                    className={`flex min-h-[84px] shrink-0 items-center border-b border-blue-100 ${
                        isDesktopCollapsed
                            ? 'justify-center px-2 lg:flex-col lg:gap-1 lg:py-2'
                            : 'px-4'
                    }`}
                >
                    <div
                        className={`flex min-w-0 items-center p-2 ${
                            isDesktopCollapsed
                                ? 'justify-center'
                                : 'flex-1 gap-3'
                        }`}
                    >
                        <img
                            src="/images/pagudpud-logo.png.png"
                            alt=""
                            className="h-11 w-11 shrink-0 object-contain"
                        />

                        {!isDesktopCollapsed && (
                            <span className="min-w-0 text-left">
                                <span className="block truncate text-sm font-bold tracking-tight text-blue-950">
                                    Pagudpud
                                </span>
                                <span className="block truncate text-xs font-medium text-slate-500">
                                    Transparency
                                </span>
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={toggleSidebar}
                        title={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        aria-label={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 lg:flex"
                    >
                        <Icon name="menu" size={18} />
                    </button>

                    {/* Mobile drawer close button */}
                    <button
                        type="button"
                        onClick={() => setIsMobileOpen(false)}
                        aria-label="Close navigation menu"
                        className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 lg:hidden"
                    >
                        <Icon name="close" size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-5 overflow-y-auto overflow-x-hidden px-3 pb-5">
                    {navigation.map((group) => (
                        <div key={group.section}>
                            <p
                                aria-hidden={isDesktopCollapsed}
                                className={`overflow-hidden whitespace-nowrap px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 transition-[max-height,margin,opacity,transform] duration-300 ease-in-out motion-reduce:transition-none ${
                                    isDesktopCollapsed
                                        ? 'mb-0 max-h-0 -translate-x-2 opacity-0'
                                        : 'mb-2 max-h-6 translate-x-0 opacity-100'
                                }`}
                            >
                                    {group.section}
                            </p>

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const active = isActiveRoute(item.href, pathname);

                                    return (
                                        <div key={item.href}>
                                            <Link
                                                href={item.href}
                                                title={isDesktopCollapsed ? item.label : undefined}
                                                onClick={() => setIsMobileOpen(false)}
                                                aria-current={active ? 'page' : undefined}
                                                className={`group flex min-h-11 items-center rounded-xl text-sm font-medium transition-[background-color,color,transform] duration-200 ease-out motion-reduce:transition-none ${
                                                    isDesktopCollapsed
                                                        ? 'justify-center px-2'
                                                        : 'gap-3 px-3 hover:translate-x-1 motion-reduce:hover:translate-x-0'
                                                } ${
                                                    active
                                                        ? 'bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-100'
                                                        : 'text-slate-600 hover:bg-slate-50 hover:text-blue-800'
                                                }`}
                                            >
                                                <span
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-[background-color,color,transform] duration-200 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
                                                        active
                                                            ? 'bg-blue-700 text-white shadow-sm'
                                                            : 'text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-700'
                                                    }`}
                                                >
                                                    <Icon name={item.icon} size={19} />
                                                </span>

                                                <span
                                                    aria-hidden={isDesktopCollapsed}
                                                    className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-300 ease-in-out motion-reduce:transition-none ${
                                                        isDesktopCollapsed
                                                            ? 'max-w-0 -translate-x-2 opacity-0'
                                                            : 'max-w-40 translate-x-0 opacity-100'
                                                    }`}
                                                >
                                                    {item.label}
                                                </span>
                                            </Link>

                                            {role === 'citizen' &&
                                                item.href === '/citizen/feedback' &&
                                                !isDesktopCollapsed &&
                                                feedbackProjects.length > 0 && (
                                                    <div className="ml-8 mt-1 space-y-1 border-l border-blue-100 pl-4">
                                                        {feedbackProjects.map((project) => {
                                                            const projectHref = `/citizen/projects/${project.id}`;
                                                            const projectIsActive = pathname === projectHref;

                                                            return (
                                                                <Link
                                                                    key={project.id}
                                                                    href={projectHref}
                                                                    onClick={() => setIsMobileOpen(false)}
                                                                    aria-current={projectIsActive ? 'page' : undefined}
                                                                    className={`block truncate rounded-lg px-3 py-2 text-xs transition-colors ${
                                                                        projectIsActive
                                                                            ? 'bg-blue-50 font-semibold text-blue-800'
                                                                            : 'text-slate-500 hover:bg-slate-50 hover:text-blue-800'
                                                                    }`}
                                                                    title={project.project_name}
                                                                >
                                                                    {project.project_name}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User profile and logout */}
                <div className="shrink-0 border-t border-blue-100 p-3">
                    <Link
                        href="/profile"
                        onClick={() => setIsMobileOpen(false)}
                        aria-current={pathname === '/profile' ? 'page' : undefined}
                        className={`mb-2 flex items-center rounded-xl transition-[background-color,transform] duration-200 motion-reduce:transition-none ${
                            isDesktopCollapsed
                                ? 'justify-center p-1'
                                : 'gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        }`}
                        title={isDesktopCollapsed ? 'View profile' : undefined}
                    >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800 ring-1 ring-blue-200">
                            {getInitials(displayName)}
                        </span>

                        <span
                            aria-hidden={isDesktopCollapsed}
                            className={`min-w-0 flex-1 overflow-hidden transition-[max-width,opacity,transform] duration-300 ease-in-out motion-reduce:transition-none ${
                                isDesktopCollapsed
                                    ? 'max-w-0 -translate-x-2 opacity-0'
                                    : 'max-w-40 translate-x-0 opacity-100'
                            }`}
                        >
                                <span className="block truncate text-sm font-semibold text-slate-800">
                                    {displayName}
                                </span>
                                <span className="block truncate text-xs text-slate-500">
                                    {email}
                                </span>
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        title={isDesktopCollapsed ? 'Log out' : undefined}
                        className={`flex min-h-11 w-full items-center rounded-xl text-sm font-medium text-slate-600 transition-[background-color,color,transform] duration-200 hover:bg-red-50 hover:text-red-700 motion-reduce:transition-none ${
                            isDesktopCollapsed
                                ? 'justify-center px-2'
                                : 'gap-3 px-3'
                        }`}
                    >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center">
                            <Icon name="logout" size={19} />
                        </span>

                        <span
                            aria-hidden={isDesktopCollapsed}
                            className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-300 ease-in-out motion-reduce:transition-none ${
                                isDesktopCollapsed
                                    ? 'max-w-0 -translate-x-2 opacity-0'
                                    : 'max-w-20 translate-x-0 opacity-100'
                            }`}
                        >
                            Log out
                        </span>
                    </button>

                    <p
                        aria-hidden={isDesktopCollapsed}
                        className={`overflow-hidden whitespace-nowrap text-center text-[10px] text-slate-400 transition-[max-height,margin,opacity,transform] duration-300 ease-in-out motion-reduce:transition-none ${
                            isDesktopCollapsed
                                ? 'mt-0 max-h-0 -translate-y-1 opacity-0'
                                : 'mt-3 max-h-5 translate-y-0 opacity-100'
                        }`}
                    >
                            Pagudpud Transparency
                    </p>
                </div>
            </aside>
        </>
    );
}
