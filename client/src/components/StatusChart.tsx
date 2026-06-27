import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface StatusChartProps {
  data: Array<{ status: string; count: number }>;
}

/**
 * Pie chart showing cattle status breakdown
 * Displays distribution across active, sold, deceased, and removed statuses
 *
 * Usage:
 * <StatusChart data={byStatus} />
 */
export default function StatusChart({ data }: StatusChartProps) {
  // Color mapping for different statuses
  const statusColors: Record<string, string> = {
    active: '#10b981', // green
    sold: '#f59e0b', // amber
    deceased: '#ef4444', // red
    removed: '#6b7280', // gray
  };

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(entry: any) => `${entry.status}: ${entry.count}`}
          animationDuration={prefersReducedMotion ? 0 : 800}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={statusColors[entry.status] || '#2563eb'}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
          formatter={(value: any) => [`${value} cattle`, 'Count']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
