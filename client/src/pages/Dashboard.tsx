import { useState, useEffect } from 'react';
import { api } from '../api';
import Card from '../components/Card';
import BreedChart from '../components/BreedChart';
import StatusChart from '../components/StatusChart';
import AgeChart from '../components/AgeChart';
import type { AnalyticsData } from '@shared/type';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="text-center py-8 text-gray-500">No data available</div>;
  }

  const { summary, byStatus, byBreed, ageDistribution, healthCoverage, alerts, removalStats, breedPerformance } = analytics;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return '🔴';
      case 'warning':
        return '🟡';
      case 'info':
        return 'ℹ️';
      default:
        return '•';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card size="lg">
          <p className="text-gray-600 text-sm font-medium">Total Active Cattle</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{summary.totalActive}</p>
        </Card>
        <Card size="lg">
          <p className="text-gray-600 text-sm font-medium">Total All Cattle</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{summary.totalCount}</p>
        </Card>
      </div>

      {/* TIER 1: Alerts Section */}
      {alerts && alerts.length > 0 && (
        <Card size="lg" className="mb-8 border-l-4 border-orange-400">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Action Items</h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.type}
                className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
              >
                <p className="font-medium">
                  {getSeverityIcon(alert.severity)} {alert.message}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TIER 1: Health Coverage */}
      {healthCoverage && (
        <Card size="lg" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Health Record Coverage</h2>
          <div className="flex items-end gap-6">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${healthCoverage.coveragePercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {healthCoverage.withHealthEvents} of {healthCoverage.totalActive} cattle have health records
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-blue-600">{healthCoverage.coveragePercent}%</p>
              {healthCoverage.coveragePercent < 80 && (
                <p className="text-xs text-orange-600 mt-1">⚠️ Coverage low</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Status Breakdown Chart */}
      <Card size="lg" className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Status Breakdown</h2>
        <StatusChart data={byStatus} />
      </Card>

      {/* TIER 1: Removal Statistics */}
      {removalStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <p className="text-gray-600 text-sm font-medium">Total Removed</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{removalStats.totalRemoved}</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm font-medium">Sold</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{removalStats.sold}</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm font-medium">Deceased</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{removalStats.deceased}</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm font-medium">Mortality Rate</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{removalStats.mortalityRate}%</p>
          </Card>
        </div>
      )}

      {/* Breed Distribution Chart */}
      <Card size="lg" className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Breed Distribution</h2>
        <BreedChart data={byBreed} />
      </Card>

      {/* TIER 1: Breed Performance Table */}
      {breedPerformance && breedPerformance.length > 0 && (
        <Card size="lg" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Breed Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Breed</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700">Count</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700">Avg Age (yrs)</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700">Health Events</th>
                </tr>
              </thead>
              <tbody>
                {breedPerformance.map((breed) => (
                  <tr key={breed.breed} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{breed.breed}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{breed.count}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{breed.avgAge}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{breed.healthEventsPerCattle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Age Distribution Chart */}
      <Card size="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Age Distribution</h2>
        <AgeChart data={ageDistribution} />
      </Card>
    </div>
  );
}
