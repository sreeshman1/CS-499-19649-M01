'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';

export default function AddTripPage() {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    length: '',
    durationNights: '', // Added
    start: '',
    resort: '',
    rating: '', // Added
    perPerson: '',
    image: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const cookies = parseCookies();
    const token = cookies['travlr-token'];

    if (!token) {
      setError('You must be logged in to add a trip.');
      setLoading(false);
      router.push('/login');
      return;
    }

    // Ensure numerical fields are numbers or null/undefined if not set (model will validate)
    const payload = {
      ...formData,
      durationNights: formData.durationNights === '' ? undefined : Number(formData.durationNights),
      rating: formData.rating === '' ? undefined : Number(formData.rating),
      perPerson: formData.perPerson // Assuming perPerson is handled as string, if number convert as well
    };


    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload), // Use payload
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add trip. ' + (data.errors ? Object.values(data.errors).map(err => err.message).join(', ') : ''));
      }

      setSuccess('Trip added successfully!');
      setFormData({ // Reset form
        code: '', name: '', length: '', durationNights: '', start: '', resort: '', rating: '', perPerson: '', image: '', description: '',
      });
      router.push('/admin/list-trips');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Trip</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4 text-sm">{error}</p>}
      {success && <p className="text-green-500 bg-green-100 p-3 rounded mb-4 text-sm">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Iterate over a structured array to control order and types */}
        {[
          { name: 'code', label: 'Trip Code', type: 'text', placeholder: 'e.g., TRP001' },
          { name: 'name', label: 'Trip Name', type: 'text', placeholder: 'e.g., Amazing Reef Adventure' },
          { name: 'length', label: 'Length (Display)', type: 'text', placeholder: 'e.g., 7 nights / 8 days' },
          { name: 'durationNights', label: 'Duration (Nights)', type: 'number', placeholder: 'e.g., 7' },
          { name: 'start', label: 'Start Date', type: 'date' },
          { name: 'resort', label: 'Resort (Display)', type: 'text', placeholder: 'e.g., Ocean Paradise, 5 stars' },
          { name: 'rating', label: 'Rating (1-5)', type: 'number', placeholder: 'e.g., 5', min: 1, max: 5, step: 1 },
          { name: 'perPerson', label: 'Price Per Person', type: 'text', placeholder: 'e.g., 1299.99' }, // Keep as text if schema is string
          { name: 'image', label: 'Image Filename', type: 'text', placeholder: 'e.g., reef_adventure.jpg' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ].map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 capitalize">
              {field.label || field.name.replace(/([A-Z])/g, ' $1')}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={`Enter ${field.label || field.name}`}
              />
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                min={field.min}
                max={field.max}
                step={field.step}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={field.placeholder || `Enter ${field.label || field.name}`}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out disabled:opacity-50"
        >
          {loading ? 'Adding Trip...' : 'Add Trip'}
        </button>
      </form>
    </div>
  );
}