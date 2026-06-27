import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import CattleForm from '../components/CattleForm';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { formatAge, formatDate, getGenderSymbol } from '../utils/formatters';
import type { Cattle } from '@shared/type';

export default function CattleList() {
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [allBreeds, setAllBreeds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCattle, setEditingCattle] = useState<Cattle | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const status = searchParams.get('status') || 'active';
  const breed = searchParams.get('breed') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    fetchCattle();
  }, [searchParams]);

  // Extract unique breeds from loaded cattle
  useEffect(() => {
    if (cattle.length > 0) {
      const breeds = Array.from(new Set(cattle.map((c) => c.breed))).sort();
      setAllBreeds(breeds);
    }
  }, [cattle]);

  const fetchCattle = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCattle({
        status,
        breed: breed || undefined,
        search: search || undefined,
      });
      setCattle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cattle');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setSearchParams({ status: newStatus, breed, search });
  };

  const handleBreedChange = (newBreed: string) => {
    setSearchParams({ status, breed: newBreed, search });
  };

  const handleSearch = (query: string) => {
    setSearchParams({ status, breed, search: query });
  };

  const handleOpenModal = (cattleToEdit?: Cattle) => {
    setEditingCattle(cattleToEdit || null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCattle(null);
    setFormError(null);
  };

  const handleFormSuccess = () => {
    handleCloseModal();
    fetchCattle(); // Refresh list
  };

  const handleFormError = (err: string) => {
    setFormError(err);
  };

  const handleDeleteCattle = async (cattleId: string, cattleTag: string) => {
    if (!confirm(`Are you sure you want to delete ${cattleTag}?`)) return;

    try {
      await api.deleteCattle(cattleId);
      fetchCattle(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete cattle');
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cattle Inventory</h1>
          <p className="text-gray-600 text-sm mt-1">{cattle.length} cattle found</p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon="➕"
          onClick={() => handleOpenModal()}
        >
          Add Cattle
        </Button>
      </div>

      <SearchBar onSearch={handleSearch} />
      <FilterBar
        status={status}
        breed={breed}
        breeds={allBreeds}
        onStatusChange={handleStatusChange}
        onBreedChange={handleBreedChange}
      />

      {loading && <div className="text-center py-12 text-gray-500">Loading cattle...</div>}

      {!loading && cattle.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No cattle found</p>
        </div>
      )}

      {!loading && cattle.length > 0 && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tag</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Breed</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Gender</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Age</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cattle.map((cow) => (
                  <tr key={cow.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <Link to={`/cattle/${cow.id}`} className="text-blue-600 hover:text-blue-800">
                        {cow.tag}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{cow.breed}</td>
                    <td className="px-6 py-4 text-gray-600">{getGenderSymbol(cow.gender)}</td>
                    <td className="px-6 py-4 text-gray-600">{formatAge(cow.birth_date)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={cow.status as 'active' | 'sold' | 'deceased' | 'removed'} />
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="📝"
                        onClick={() => handleOpenModal(cow)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon="🗑️"
                        onClick={() => handleDeleteCattle(cow.id, cow.tag)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cattle.map((cow) => (
              <Link
                key={cow.id}
                to={`/cattle/${cow.id}`}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-blue-600">{cow.tag}</h3>
                <p className="text-gray-600 text-sm">{cow.breed}</p>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>{getGenderSymbol(cow.gender)} • {formatAge(cow.birth_date)}</p>
                  <p>Born {formatDate(cow.birth_date)}</p>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="inline-block">
                    <StatusBadge status={cow.status as 'active' | 'sold' | 'deceased' | 'removed'} />
                  </div>
                  <div className="flex gap-2 pt-2" onClick={(e) => e.preventDefault()}>
                    <Button
                      variant="primary"
                      size="sm"
                      icon="📝"
                      className="flex-1"
                      onClick={() => handleOpenModal(cow)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon="🗑️"
                      className="flex-1"
                      onClick={() => handleDeleteCattle(cow.id, cow.tag)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingCattle ? `Edit ${editingCattle.tag}` : 'Add New Cattle'}
        onClose={handleCloseModal}
      >
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {formError}
          </div>
        )}
        <CattleForm
          cattle={editingCattle}
          onSuccess={handleFormSuccess}
          onError={handleFormError}
        />
      </Modal>
    </div>
  );
}
