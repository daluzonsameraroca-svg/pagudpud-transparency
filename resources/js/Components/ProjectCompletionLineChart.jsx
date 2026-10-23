import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export default function ProjectCompletionLineChart({ data = [] }) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-800">
                    Project Accomplishments
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                    Completed projects by two-year period
                </p>
            </div>

            <div
                className="h-64 w-full sm:h-72"
                role="img"
                aria-label="Line graph of completed projects for each two-year period"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 8, right: 12, bottom: 8, left: -12 }}
                    >
                        <CartesianGrid
                            stroke="#e2e8f0"
                            strokeDasharray="3 3"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="period"
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={12}
                        />
                        <YAxis
                            allowDecimals={false}
                            domain={[0, 'auto']}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            formatter={(value) => [
                                `${value} ${value === 1 ? 'project' : 'projects'}`,
                                'Completed',
                            ]}
                            contentStyle={{
                                fontSize: 11,
                                borderRadius: 8,
                                borderColor: '#e2e8f0',
                            }}
                        />
                        <Line
                            type="linear"
                            dataKey="completedProjects"
                            name="Completed projects"
                            stroke="#2563eb"
                            strokeWidth={2.5}
                            activeDot={{ r: 5 }}
                            dot={{ r: 3, fill: '#2563eb' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
