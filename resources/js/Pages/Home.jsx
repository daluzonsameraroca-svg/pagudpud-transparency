import { Link } from '@inertiajs/react';

const highlights = ['Municipal projects', 'Progress updates', 'Community feedback'];

export default function Home() {
    return (
        <div className="min-h-screen overflow-hidden bg-[#fbfcf8] text-slate-800">
            <header className="relative z-10 border-b border-blue-950/10 bg-white/90">
                <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between sm:px-8">
                    <a
                        href="#home"
                        className="flex items-center gap-2 text-sm font-bold tracking-tight text-blue-950 min-[480px]:gap-3 min-[480px]:text-base sm:text-lg"
                    >
                        <img
                            src="/images/pagudpud-logo.png.png"
                            alt="Pagudpud Transparency logo"
                            className="h-10 w-10 shrink-0 object-contain min-[480px]:h-12 min-[480px]:w-12"
                        />
                        <span className="whitespace-nowrap">
                            Pagudpud Transparency
                        </span>
                    </a>

                    <div className="flex w-full items-center justify-end gap-2 min-[480px]:w-auto min-[480px]:gap-4">
                        <Link
                            href="/login"
                            className="whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-900"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/register"
                            className="whitespace-nowrap rounded-full bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
                        >
                            Join now
                        </Link>
                    </div>
                </nav>
            </header>

            <main>
                <section
                    id="home"
                    className="relative isolate border-b border-blue-950/5"
                >
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_42%,rgba(167,243,208,0.35),transparent_38%),linear-gradient(135deg,#f4f8ee_0%,#fbfcf8_52%,#edf6ef_100%)]"
                    />
                    <div className="mx-auto grid min-h-[610px] max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-900/10 bg-white/75 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-900 shadow-sm">
                                <span
                                    aria-hidden="true"
                                    className="h-2 w-2 rounded-full bg-blue-600"
                                />
                                Made for Pagudpud
                            </div>
                            <h1 className="mt-7 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                                Local projects.
                                <span className="block text-blue-800">
                                    Clear progress.
                                </span>
                                A voice for every resident.
                            </h1>
                            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                                Explore municipal projects, follow their progress, and share
                                feedback in one place.
                            </p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <Link
                                    href="/register"
                                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue-800 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/15 transition hover:-translate-y-0.5 hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
                                >
                                    Get started
                                </Link>
                                <span className="text-center text-sm text-slate-500 sm:text-left">
                                    For Pagudpud residents
                                </span>
                            </div>
                        </div>

                        <div className="relative mx-auto w-full max-w-lg">
                            <div
                                aria-hidden="true"
                                className="absolute -inset-5 rounded-[2.5rem] bg-blue-900/[0.04] blur-xl"
                            />
                            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-6 shadow-[0_28px_80px_-32px_rgba(6,78,59,0.35)] sm:p-9">
                                <div
                                    aria-hidden="true"
                                    className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-100/80"
                                />
                                <div
                                    aria-hidden="true"
                                    className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-blue-100/70"
                                />
                                <div className="relative flex min-h-[340px] flex-col items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-[#f3f8ed] via-white to-[#e8f4eb] px-5 py-9 text-center sm:min-h-[390px]">
                                    <img
                                        src="/images/pagudpud-logo.png.png"
                                        alt=""
                                        className="h-36 w-36 object-contain drop-shadow-sm sm:h-44 sm:w-44"
                                    />
                                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                                        Pagudpud, Ilocos Norte
                                    </p>
                                    <p className="mt-2 max-w-xs text-2xl font-bold leading-tight tracking-tight text-blue-950 sm:text-3xl">
                                        Your community, in the know.
                                    </p>
                                </div>
                                <div className="relative mt-5 grid grid-cols-1 gap-2 rounded-2xl bg-blue-950 p-3 text-center text-xs font-semibold leading-5 text-white sm:grid-cols-3 sm:gap-0 sm:px-2 sm:py-4 sm:text-sm">
                                    {highlights.map((highlight) => (
                                        <span
                                            key={highlight}
                                            className="rounded-xl bg-white/10 px-3 py-3 sm:rounded-none sm:bg-transparent sm:px-2 sm:py-0"
                                        >
                                            {highlight}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    aria-label="Pagudpud Transparency"
                    className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-center sm:px-8 md:flex-row md:items-center md:justify-between md:text-left"
                >
                    <p className="text-sm font-semibold text-slate-700">
                        Stay connected to the work happening in your municipality.
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center self-center rounded-full border border-blue-800/20 px-5 py-2.5 text-sm font-bold text-blue-900 transition hover:bg-blue-50 md:self-auto"
                    >
                        Create your account
                    </Link>
                </section>
            </main>

            <footer className="border-t border-blue-950/10 bg-white px-5 py-5 text-center text-sm text-slate-500">
                Pagudpud Transparency
            </footer>
        </div>
    );
}
