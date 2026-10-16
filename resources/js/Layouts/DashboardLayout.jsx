import Sidebar from '../Components/Sidebar';

export default function DashboardLayout({ children, role }) {
    return (
        <div className="min-h-screen bg-[#f3f5f8] text-[#20334b]">
            {/* Sidebar */}
            <Sidebar role={role} />

            {/* Main Content */}
            <main className="min-h-screen pl-60">
                <div className="mx-auto min-h-screen w-full max-w-[1800px]">
                    {children}
                </div>
            </main>
        </div>
    );
}
