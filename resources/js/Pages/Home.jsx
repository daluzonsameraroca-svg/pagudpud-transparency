
import { Link } from "@inertiajs/react";

const projects = [
    {
        id: 1,
        name: "Road Improvement Project",
        location: "Barangay Balaoi",
        category: "Infrastructure",
        budget: 2500000,
        progress: 75,
        status: "Ongoing",
        updated: "October 8, 2026",
    },
    {
        id: 2,
        name: "Community Water System",
        location: "Barangay Saud",
        category: "Public Utilities",
        budget: 1800000,
        progress: 45,
        status: "Ongoing",
        updated: "October 6, 2026",
    },
    {
        id: 3,
        name: "Barangay Health Center",
        location: "Barangay Poblacion",
        category: "Health",
        budget: 3200000,
        progress: 100,
        status: "Completed",
        updated: "September 28, 2026",
    },
];

const announcements = [
    {
        category: "Project Update",
        title: "Road improvement project progress",
        description:
            "View the latest implementation status and reported accomplishments.",
        date: "October 8, 2026",
    },
    {
        category: "Public Notice",
        title: "Municipal project information update",
        description:
            "Stay informed about available project records and municipal updates.",
        date: "October 5, 2026",
    },
    {
        category: "Community",
        title: "Citizen project monitoring",
        description:
            "Registered citizens can share feedback about project implementation.",
        date: "October 2, 2026",
    },
];

const peso = (amount) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 0,
    }).format(amount);

function SectionTitle({ eyebrow, title, description }) {
    return (
        <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
                {eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {title}
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
                {description}
            </p>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        Ongoing: "bg-amber-100 text-amber-800",
        Completed: "bg-emerald-100 text-emerald-800",
        Planned: "bg-blue-100 text-blue-800",
        Delayed: "bg-rose-100 text-rose-800",
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${
                styles[status] || "bg-slate-100 text-slate-700"
            }`}
        >
            {status}
        </span>
    );
}

function ProgressBar({ progress }) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">
                    Project progress
                </span>
                <span className="font-bold text-slate-900">
                    {progress}%
                </span>
            </div>
            <div
                className="h-3 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div
                    className="h-full rounded-full bg-emerald-600 transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

function DashboardPreview() {
    const ongoing = projects.filter(
        (project) => project.status === "Ongoing"
    ).length;
    const completed = projects.filter(
        (project) => project.status === "Completed"
    ).length;

    return (
        <div className="rounded-3xl border border-white/70 bg-white p-5 shadow-2xl shadow-emerald-950/10 sm:p-7">
            <div className="mb-7 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        Project monitoring
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                        Dashboard Overview
                    </h3>
                </div>
                <span className="rounded-2xl bg-emerald-50 p-3 text-2xl">
                    📊
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-emerald-50 p-5">
                    <p className="text-sm font-medium text-emerald-800">
                        Total projects
                    </p>
                    <p className="mt-2 text-4xl font-bold text-emerald-950">
                        {projects.length}
                    </p>
                </div>

                <div className="rounded-2xl bg-amber-50 p-5">
                    <p className="text-sm font-medium text-amber-800">
                        Ongoing
                    </p>
                    <p className="mt-2 text-4xl font-bold text-amber-950">
                        {ongoing}
                    </p>
                </div>

                <div className="rounded-2xl bg-blue-50 p-5">
                    <p className="text-sm font-medium text-blue-800">
                        Total allocated budget
                    </p>
                    <p className="mt-2 text-2xl font-bold text-blue-950">
                        {peso(
                            projects.reduce(
                                (total, project) => total + project.budget,
                                0
                            )
                        )}
                    </p>
                </div>

                <div className="rounded-2xl bg-violet-50 p-5">
                    <p className="text-sm font-medium text-violet-800">
                        Completed
                    </p>
                    <p className="mt-2 text-4xl font-bold text-violet-950">
                        {completed}
                    </p>
                </div>
            </div>

            <div className="mt-7 rounded-2xl border border-slate-100 p-5">
                <div className="mb-5 flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">
                        Project status
                    </h4>
                    <span className="text-xs text-slate-500">
                        Sample data
                    </span>
                </div>

                {[
                    {
                        label: "Ongoing",
                        count: ongoing,
                        color: "bg-amber-500",
                    },
                    {
                        label: "Completed",
                        count: completed,
                        color: "bg-emerald-600",
                    },
                ].map((item) => (
                    <div key={item.label} className="mb-4 last:mb-0">
                        <div className="mb-2 flex justify-between text-sm">
                            <span className="text-slate-600">
                                {item.label}
                            </span>
                            <span className="font-semibold text-slate-900">
                                {item.count}
                            </span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className={`h-full rounded-full ${item.color}`}
                                style={{
                                    width: `${
                                        (item.count / projects.length) * 100
                                    }%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-5 text-xs leading-5 text-slate-500">
                Illustrative figures for the landing page. Replace these
                values with actual project records before deployment.
            </p>
        </div>
    );
}

export default function Home() {
    const totalBudget = projects.reduce(
        (total, project) => total + project.budget,
        0
    );

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800">
            {/* Navigation */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
                    <a href="#home" className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-2xl text-white">
                            🏛
                        </div>
                        <div>
                            <p className="text-lg font-extrabold tracking-tight text-slate-950">
                                Pagudpud Transparency
                            </p>
                            <p className="text-xs text-slate-500">
                                Local Government Project Monitoring
                            </p>
                        </div>
                    </a>

                    <div className="hidden items-center gap-7 lg:flex">
                        <a href="#home" className="text-sm font-semibold hover:text-emerald-700">
                            Home
                        </a>
                        <a href="#projects" className="text-sm font-semibold hover:text-emerald-700">
                            Projects
                        </a>
                        <a href="#announcements" className="text-sm font-semibold hover:text-emerald-700">
                            Announcements
                        </a>
                        <a href="#about" className="text-sm font-semibold hover:text-emerald-700">
                            About
                        </a>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="hidden rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 sm:inline-flex"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/register"
                            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800"
                        >
                            Get started
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero */}
            <main>
                <section
                    id="home"
                    className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800"
                >
                    <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-teal-300/10 blur-3xl" />

                    <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:px-10 lg:py-28">
                        <div>
                            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-50">
                                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                                Local projects. Clearer information.
                            </div>

                            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                                See the progress of{" "}
                                <span className="text-emerald-300">
                                    local government projects.
                                </span>
                            </h1>

                            <p className="mt-7 max-w-xl text-lg leading-8 text-emerald-50/85 sm:text-xl">
                                Pagudpud Transparency provides a centralized
                                platform where citizens can explore public
                                projects, review available budgets and
                                timelines, and follow implementation updates.
                            </p>

                            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                                <a
                                    href="#projects"
                                    className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 text-base font-bold text-emerald-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-emerald-50"
                                >
                                    Explore projects
                                    <span aria-hidden="true">→</span>
                                </a>

                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-7 py-4 text-base font-bold text-white transition hover:bg-white/10"
                                >
                                    Register as a citizen
                                </Link>
                            </div>

                            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-emerald-50/80">
                                <span>✓ Project information</span>
                                <span>✓ Progress monitoring</span>
                                <span>✓ Citizen feedback</span>
                            </div>
                        </div>

                        <DashboardPreview />
                    </div>
                </section>

                {/* Project analytics */}
                <section className="bg-slate-50 py-20 sm:py-24">
                    <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                        <SectionTitle
                            eyebrow="Project overview"
                            title="Understand where public projects stand."
                            description="Review project status and reported accomplishments in one place. These example figures demonstrate the dashboard layout."
                        />

                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                                <p className="text-sm font-semibold text-slate-500">
                                    Projects listed
                                </p>
                                <p className="mt-3 text-4xl font-extrabold text-slate-950">
                                    {projects.length}
                                </p>
                                <p className="mt-3 text-sm text-slate-500">
                                    Projects in this sample
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                                <p className="text-sm font-semibold text-slate-500">
                                    Total sample budget
                                </p>
                                <p className="mt-3 text-3xl font-extrabold text-slate-950">
                                    {peso(totalBudget)}
                                </p>
                                <p className="mt-3 text-sm text-slate-500">
                                    Combined listed project budgets
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                                <p className="text-sm font-semibold text-slate-500">
                                    Average reported progress
                                </p>
                                <p className="mt-3 text-4xl font-extrabold text-emerald-700">
                                    {Math.round(
                                        projects.reduce(
                                            (sum, project) =>
                                                sum + project.progress,
                                            0
                                        ) / projects.length
                                    )}
                                    %
                                </p>
                                <p className="mt-3 text-sm text-slate-500">
                                    Average of the sample projects
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects */}
                <section id="projects" className="py-20 sm:py-24">
                    <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                            <SectionTitle
                                eyebrow="Explore projects"
                                title="Get to know local development projects."
                                description="Review sample project information, current status, allocated budgets, and reported progress."
                            />

                            <a
                                href="#about"
                                className="mb-10 inline-flex shrink-0 items-center gap-2 font-bold text-emerald-700 hover:text-emerald-900"
                            >
                                Learn about the platform <span>→</span>
                            </a>
                        </div>

                        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                            {projects.map((project) => (
                                <article
                                    key={project.id}
                                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="flex h-44 items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-slate-100">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl shadow-sm">
                                            {project.category === "Infrastructure"
                                                ? "🛣️"
                                                : project.category === "Health"
                                                  ? "🏥"
                                                  : "💧"}
                                        </div>
                                    </div>

                                    <div className="p-7">
                                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                            <span className="text-sm font-semibold text-emerald-700">
                                                {project.category}
                                            </span>
                                            <StatusBadge status={project.status} />
                                        </div>

                                        <h3 className="text-xl font-bold leading-7 text-slate-950">
                                            {project.name}
                                        </h3>

                                        <p className="mt-3 text-base text-slate-500">
                                            📍 {project.location}
                                        </p>

                                        <div className="my-6 border-t border-slate-100 pt-5">
                                            <p className="text-sm text-slate-500">
                                                Allocated budget
                                            </p>
                                            <p className="mt-1 text-2xl font-extrabold text-slate-900">
                                                {peso(project.budget)}
                                            </p>
                                        </div>

                                        <ProgressBar progress={project.progress} />

                                        <p className="mt-5 text-xs text-slate-500">
                                            Sample update date: {project.updated}
                                        </p>

                                        <div className="mt-6 border-t border-slate-100 pt-5">
                                            <Link
                                                href="/login"
                                                className="inline-flex items-center gap-2 font-bold text-emerald-700 hover:text-emerald-900"
                                            >
                                                View project details <span>→</span>
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <p className="mt-8 text-sm leading-6 text-slate-500">
                            Note: The projects above are illustrative examples,
                            not verified official records. Replace them with
                            actual project data before presenting the system
                            as an official source.
                        </p>
                    </div>
                </section>

                {/* How it works */}
                <section id="about" className="bg-emerald-950 py-20 text-white sm:py-24">
                    <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                        <SectionTitle
                            eyebrow="About the platform"
                            title="A clearer way to follow public projects."
                            description="The system is designed to make project information easier to find and to provide a channel for citizen participation."
                        />

                        <div className="grid gap-7 md:grid-cols-3">
                            {[
                                {
                                    number: "01",
                                    icon: "🔎",
                                    title: "Explore information",
                                    description:
                                        "Find project descriptions, budgets, schedules, locations, and available records.",
                                },
                                {
                                    number: "02",
                                    icon: "📈",
                                    title: "Follow progress",
                                    description:
                                        "Review implementation updates and reported accomplishments posted by the responsible office.",
                                },
                                {
                                    number: "03",
                                    icon: "💬",
                                    title: "Share feedback",
                                    description:
                                        "Registered citizens can provide feedback about project status and implementation.",
                                },
                            ].map((item) => (
                                <article
                                    key={item.number}
                                    className="rounded-3xl border border-white/15 bg-white/5 p-8"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-emerald-300">
                                            STEP {item.number}
                                        </span>
                                        <span className="text-3xl">
                                            {item.icon}
                                        </span>
                                    </div>
                                    <h3 className="mt-7 text-xl font-bold">
                                        {item.title}
                                    </h3>
                                    <p className="mt-4 leading-7 text-emerald-50/75">
                                        {item.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Announcements */}
                <section id="announcements" className="py-20 sm:py-24">
                    <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                        <SectionTitle
                            eyebrow="Announcements and updates"
                            title="Stay informed about local projects."
                            description="Keep project-related notices and updates accessible to citizens."
                        />

                        <div className="grid gap-6 md:grid-cols-3">
                            {announcements.map((announcement) => (
                                <article
                                    key={announcement.title}
                                    className="rounded-3xl border border-slate-200 p-7 transition hover:border-emerald-300 hover:shadow-lg"
                                >
                                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-800">
                                        {announcement.category}
                                    </span>
                                    <h3 className="mt-5 text-xl font-bold leading-7 text-slate-950">
                                        {announcement.title}
                                    </h3>
                                    <p className="mt-3 leading-7 text-slate-600">
                                        {announcement.description}
                                    </p>
                                    <p className="mt-6 text-sm text-slate-400">
                                        Sample date: {announcement.date}
                                    </p>
                                </article>
                            ))}
                        </div>

                        <p className="mt-7 text-sm text-slate-500">
                            Sample announcements are for demonstration only.
                        </p>
                    </div>
                </section>

                {/* Citizen participation */}
                <section className="bg-slate-50 py-20 sm:py-24">
                    <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
                        <div>
                            <SectionTitle
                                eyebrow="Citizen participation"
                                title="Your awareness matters."
                                description="Transparency is not only about publishing information. It is also about helping citizens understand public projects and share feedback through an organized platform."
                            />

                            <ul className="space-y-4">
                                {[
                                    "Access project information in one place.",
                                    "Review reported status and progress updates.",
                                    "Submit feedback through a citizen account.",
                                ].map((benefit) => (
                                    <li
                                        key={benefit}
                                        className="flex items-start gap-3 text-base leading-7 text-slate-700"
                                    >
                                        <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                                            ✓
                                        </span>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                                💬
                            </div>
                            <h3 className="text-2xl font-bold text-slate-950">
                                Help build an informed community.
                            </h3>
                            <p className="mt-4 leading-7 text-slate-600">
                                Create a citizen account to access the
                                platform's participation features. Feedback
                                should be reviewed and handled by the
                                responsible administrators.
                            </p>
                            <Link
                                href="/register"
                                className="mt-7 inline-flex items-center justify-center rounded-xl bg-emerald-700 px-6 py-4 font-bold text-white transition hover:bg-emerald-800"
                            >
                                Register as a citizen →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Closing CTA */}
                <section className="px-5 py-20 sm:px-8 sm:py-24">
                    <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-800 to-teal-700 px-7 py-14 text-center text-white sm:px-14 sm:py-16">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">
                            Pagudpud Transparency
                        </p>
                        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
                            Stay informed. Follow progress. Participate.
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-emerald-50/85">
                            Explore available local government project
                            information and stay connected with community
                            development.
                        </p>
                        <a
                            href="#projects"
                            className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-7 py-4 font-bold text-emerald-900 transition hover:bg-emerald-50"
                        >
                            Explore projects →
                        </a>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
                    <div>
                        <p className="text-lg font-extrabold text-slate-950">
                            Pagudpud Transparency
                        </p>
                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Web-Based Local Government Project Monitoring
                            System.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600">
                        <a href="#home" className="hover:text-emerald-700">
                            Home
                        </a>
                        <a href="#projects" className="hover:text-emerald-700">
                            Projects
                        </a>
                        <a
                            href="#announcements"
                            className="hover:text-emerald-700"
                        >
                            Announcements
                        </a>
                        <a href="#about" className="hover:text-emerald-700">
                            About
                        </a>
                    </div>
                </div>

                <div className="border-t border-slate-100 px-5 py-5 text-center text-sm text-slate-500">
                    © {new Date().getFullYear()} Pagudpud Transparency.
                    Academic capstone project.
                </div>
            </footer>
        </div>
    );
}
