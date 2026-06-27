import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import Modal from '../components/Modal';
import HealthEventForm from '../components/HealthEventForm';
import HealthEventList from '../components/HealthEventList';
import { formatAge, formatDate, getStatusColor, getGenderSymbol } from '../utils/formatters';
import type { Cattle, HealthEvent } from '@shared/type';

export default function CattleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [cattle, setCattle] = useState<Cattle | null>(null);
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchCattle();
    fetchEvents();
  }, [id]);

  const fetchCattle = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!id) throw new Error('Cattle ID not found');
      const data = await api.getCattleById(id);
      setCattle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cattle');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      if (!id) throw new Error('Cattle ID not found');
      const data = await api.getHealthEvents(id);
      setEvents(data);
    } catch (err) {
      console.error('Failed to load health events:', err);
    }
  };

  const handleAddEventSuccess = () => {
    setIsModalOpen(false);
    fetchEvents();
  };

  if (error) {
    return (
      <div>
        <button onClick={() => navigate('/')} className="mb-4 text-blue-600 hover:text-blue-800">
          ← Back to Cattle
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (loading || !cattle) {
    return (
      <div>
        <button onClick={() => navigate('/')} className="mb-4 text-blue-600 hover:text-blue-800">
          ← Back to Cattle
        </button>
        <div className="text-center py-12 text-gray-500">Loading cattle details...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <button onClick={() => navigate('/')} className="mb-6 text-blue-600 hover:text-blue-800 font-medium">
        ← Back to Cattle
      </button>

      {/* Cattle Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{cattle.tag}</h1>
            <p className="text-gray-600 text-lg">{cattle.breed}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-lg font-medium ${getStatusColor(cattle.status)}`}>
            {cattle.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p className="text-lg font-medium text-gray-900">{getGenderSymbol(cattle.gender)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Age</p>
            <p className="text-lg font-medium text-gray-900">{formatAge(cattle.birth_date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Birth Date</p>
            <p className="text-lg font-medium text-gray-900">{formatDate(cattle.birth_date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Created</p>
            <p className="text-lg font-medium text-gray-900">{formatDate(cattle.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Health Events */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Health Events ({events.length})</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Event
          </button>
        </div>

        <HealthEventList events={events} />
      </div>

      {/* Add Event Modal */}
      <Modal
        isOpen={isModalOpen}
        title={`Add Health Event for ${cattle.tag}`}
        onClose={() => setIsModalOpen(false)}
      >
        <HealthEventForm cattleId={cattle.id} onSuccess={handleAddEventSuccess} />
      </Modal>
    </div>
  );
}
