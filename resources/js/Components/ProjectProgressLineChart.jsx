import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const PROJECT_COLORS = [
    '#2563eb',
    '#f97316',
    '#16a34a',
    '#9333ea',
    '#e11d48',
    '#0891b2',
    '#ca8a04',
    '#4f46e5',
];

function projectColor(index) {
    return PROJECT_COLORS[index % PROJECT_COLORS.length];
}

function formatDate(timestamp, options) {
    return new Date(timestamp).toLocaleDateString(undefined, options);
}

export default function ProjectProgressLineChart({
    projects = [],
    showLegend = true,
}) {
    const lines = projects
        .map((project, index) => ({
            id: project.id,
            name: project.project_name || 'Untitled Project',
            dataKey: `project_${project.id}`,
            color: projectColor(index),
            updates: project.progress_updates || [],
        }))
        .filter((project) => project.updates.length > 0);

    const chartDataByDate = new Map();

    for (const project of lines) {
        for (const update of project.updates) {
            const timestamp = new Date(
                `${update.update_date.slice(0, 10)}T00:00:00`,
            ).getTime();
            const entry = chartDataByDate.get(timestamp) || { date: timestamp };

            entry[project.dataKey] = Number(update.progress);
            chartDataByDate.set(timestamp, entry);
        }
    }

    const data = [...chartDataByDate.values()].sort(
        (first, second) => first.date - second.date,
    );

    return (
        <div className="flex h-full min-h-0 flex-col">
            {data.length > 0 ? (
                <>
                    <div className="min-h-0 flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{ top: 8, right: 8, bottom: 8, left: -12 }}
                            >
                                <CartesianGrid
                                    stroke="#e2e8f0"
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="date"
                                    type="number"
                                    scale="time"
                                    domain={['dataMin', 'dataMax']}
                                    tickFormatter={(value) =>
                                        formatDate(value, {
                                            month: 'short',
                                            year: '2-digit',
                                        })
                                    }
                                    tick={{ fontSize: 10, fill: '#64748b' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    ticks={[0, 25, 50, 75, 100]}
                                    tickFormatter={(value) => `${value}%`}
                                    tick={{ fontSize: 10, fill: '#64748b' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    labelFormatter={(value) =>
                                        formatDate(value, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })
                                    }
                                    formatter={(value, name) => [
                                        `${value}%`,
                                        name,
                                    ]}
                                    contentStyle={{
                                        fontSize: 11,
                                        borderRadius: 8,
                                        borderColor: '#e2e8f0',
                                    }}
                                />
                                {lines.map((project) => (
                                    <Line
                                        key={project.id}
                                        type="linear"
                                        dataKey={project.dataKey}
                                        name={project.name}
                                        stroke={project.color}
                                        strokeWidth={2}
                                        connectNulls
                                        activeDot={{
                                            r: 5,
                                            fill: project.color,
                                            stroke: 'white',
                                            strokeWidth: 2,
                                        }}
                                        dot={{
                                            r: 4,
                                            fill: project.color,
                                            stroke: 'white',
                                            strokeWidth: 1.5,
                                        }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    {showLegend && (
                        <div className="mt-2 flex max-h-12 shrink-0 flex-wrap gap-x-3 gap-y-1 overflow-y-auto">
                            {lines.map((project) => (
                                <span
                                    key={project.id}
                                    className="inline-flex max-w-[48%] items-center gap-1.5 truncate text-[10px] text-slate-600"
                                    title={project.name}
                                >
                                    <span
                                        className="h-2 w-2 shrink-0 rounded-full"
                                        style={{
                                            backgroundColor: project.color,
                                        }}
                                    />
                                    <span className="truncate">
                                        {project.name}
                                    </span>
                                </span>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    No progress history available.
                </div>
            )}
        </div>
    );
}
