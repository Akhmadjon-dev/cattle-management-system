import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { colors } from '@/styles/colors';

interface AgeChartProps {
  data: Array<{ range: string; count: number }>;
}

/**
 * Bar chart showing cattle age distribution
 * Displays count of cattle across different age ranges
 *
 * Usage:
 * <AgeChart data={ageDistribution} />
 */
export default function AgeChart({ data }: AgeChartProps) {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="range"
          angle={-45}
          textAnchor="end"
          height={100}
        />
        <YAxis />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
          }}
          cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
        />
        <Legend />
        <Bar
          dataKey="count"
          fill={colors.secondary}
          name="Count"
          animationDuration={prefersReducedMotion ? 0 : 800}
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
