import { useState } from 'react';
import { api } from '../api';
import FormInput from './FormInput';
import Button from './Button';
import { formatDateForInput } from '../utils/formatters';
import type { Cattle, CreateCattleInput, Gender, CattleStatus } from '@shared/type';

interface CattleFormProps {
  cattle?: Cattle | null;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const GENDERS: Gender[] = ['male', 'female'];
const STATUSES: CattleStatus[] = ['active', 'sold', 'deceased', 'removed'];

export default function CattleForm({ cattle, onSuccess, onError }: CattleFormProps) {
  const [formData, setFormData] = useState({
    tag: cattle?.tag || '',
    breed: cattle?.breed || '',
    gender: (cattle?.gender || 'male') as Gender,
    birth_date: cattle ? formatDateForInput(cattle.birth_date) : '',
    status: (cattle?.status || 'active') as CattleStatus,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.tag.trim()) newErrors.tag = 'Tag is required';
    if (!formData.breed.trim()) newErrors.breed = 'Breed is required';
    if (!formData.birth_date) newErrors.birth_date = 'Birth date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts editing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (cattle) {
        // Edit mode - PATCH request
        await api.updateCattle(cattle.id, {
          tag: formData.tag,
          breed: formData.breed,
          gender: formData.gender,
          birth_date: formData.birth_date,
        } as any);
      } else {
        // Create mode - POST request (ignore status for new cattle)
        const createData: CreateCattleInput = {
          tag: formData.tag,
          breed: formData.breed,
          gender: formData.gender,
          birth_date: formData.birth_date,
        };
        await api.createCattle(createData);
      }

      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to save cattle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tag */}
      <FormInput
        id="tag"
        label="Tag"
        type="text"
        name="tag"
        value={formData.tag}
        onChange={handleChange}
        placeholder="e.g., TAG-001"
        disabled={loading}
        required
        error={errors.tag}
      />

      {/* Breed */}
      <FormInput
        id="breed"
        label="Breed"
        type="text"
        name="breed"
        value={formData.breed}
        onChange={handleChange}
        placeholder="e.g., Holstein"
        disabled={loading}
        required
        error={errors.breed}
      />

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {GENDERS.map((g) => (
            <option key={g} value={g}>
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Birth Date */}
      <FormInput
        id="birth_date"
        label="Birth Date"
        type="date"
        name="birth_date"
        value={formData.birth_date}
        onChange={handleChange}
        disabled={loading}
        required
        error={errors.birth_date}
      />

      {/* Status (Edit mode only) */}
      {cattle && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={loading}
        loading={loading}
        fullWidth
      >
        {cattle ? 'Update Cattle' : 'Add Cattle'}
      </Button>
    </form>
  );
}
