
import { useState } from 'react';
import Sidebar from '../Components/Sidebar';

export default function DashboardLayout({ children, role }) {
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Sidebar
                role={role}
                isDesktopCollapsed={isDesktopCollapsed}
                setIsDesktopCollapsed={setIsDesktopCollapsed}
            />

            <main
                className={`min-h-screen w-full transition-[padding] duration-300 ease-in-out ${
                    isDesktopCollapsed ? 'lg:pl-20' : 'lg:pl-64'
                }`}
            >
                <div className="mx-auto min-h-screen w-full max-w-[1800px]">
                    {children}
                </div>
            </main>
        </div>
    );
}
