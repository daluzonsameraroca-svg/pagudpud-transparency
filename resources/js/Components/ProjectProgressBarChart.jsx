import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
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

export default function ProjectProgressBarChart({ projects = [] }) {
    const data = projects.map((project, index) => ({
        id: project.id,
        name: project.project_name || 'Untitled Project',
        progress: Math.min(100, Math.max(0, Number(project.progress || 0))),
        color: PROJECT_COLORS[index % PROJECT_COLORS.length],
    }));

    const chartWidth = Math.max(360, data.length * 100 + 80);

    return data.length > 0 ? (
        <div
            className="overflow-x-auto"
            role="img"
            aria-label="Vertical bar graph showing current progress percentage for each project"
        >
            <div className="h-80" style={{ minWidth: chartWidth }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 8, right: 12, bottom: 8, left: 0 }}
                    >
                        <CartesianGrid
                            stroke="#e2e8f0"
                            strokeDasharray="3 3"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={90}
                            tickMargin={12}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                        />
                        <YAxis
                            type="number"
                            domain={[0, 100]}
                            ticks={[0, 25, 50, 75, 100]}
                            tickFormatter={(value) => `${value}%`}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            formatter={(value) => [`${value}%`, 'Progress']}
                            contentStyle={{
                                fontSize: 11,
                                borderRadius: 8,
                                borderColor: '#e2e8f0',
                            }}
                        />
                        <Bar
                            dataKey="progress"
                            name="Progress"
                            radius={[5, 5, 0, 0]}
                            minPointSize={3}
                        >
                            {data.map((project) => (
                                <Cell
                                    key={project.id}
                                    fill={project.color}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    ) : (
        <div className="flex h-60 items-center justify-center text-sm text-slate-500">
            No project data available.
        </div>
    );
}
