'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';

export default function AddTripPage() {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    length: '',
    start: '',
    resort: '',
    perPerson: '',
    image: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include token for protected route
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add trip. ' + (data.errors ? Object.values(data.errors).map(err => err.message).join(', ') : ''));
      }

      setSuccess('Trip added successfully!');
      setFormData({ // Reset form
        code: '', name: '', length: '', start: '', resort: '', perPerson: '', image: '', description: '',
      });
      // Optionally redirect or update list
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
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1')} {/* Add space before caps for better label */}
            </label>
            <input
              type={key === 'start' ? 'date' : key === 'perPerson' ? 'number' : 'text'}
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={key === 'perPerson' ? 'e.g., 1299.99' : `Enter ${key}`}
              step={key === 'perPerson' ? '0.01' : undefined}
            />
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