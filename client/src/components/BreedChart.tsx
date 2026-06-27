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

interface BreedChartProps {
  data: Array<{ breed: string; count: number }>;
}

/**
 * Bar chart showing cattle breed distribution
 * Displays count of cattle for each breed
 *
 * Usage:
 * <BreedChart data={byBreed} />
 */
export default function BreedChart({ data }: BreedChartProps) {
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
          dataKey="breed"
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
          fill={colors.primary}
          name="Count"
          animationDuration={prefersReducedMotion ? 0 : 800}
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
