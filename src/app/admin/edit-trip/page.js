'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // useParams to get tripCode
import { parseCookies } from 'nookies';

export default function EditTripPage() {
  const router = useRouter();
  const params = useParams(); // { tripCode: '...' }
  const tripCode = params?.tripCode;

  const [formData, setFormData] = useState({
    code: '', name: '', length: '', start: '', resort: '', perPerson: '', image: '', description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);


  useEffect(() => {
    // Client-side auth check
    const cookies = parseCookies();
    if (!cookies['travlr-token']) {
      router.push('/login');
      return;
    }

    if (tripCode) {
      const fetchTripData = async () => {
        setInitialLoading(true);
        setError('');
        try {
          const res = await fetch(`/api/trips/${tripCode}`);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch trip data');
          }
          const tripData = await res.json();
          // Format date for input type="date"
          if (tripData.start) {
            tripData.start = new Date(tripData.start).toISOString().split('T')[0];
          }
          setFormData(tripData);
        } catch (err) {
          setError(err.message);
        } finally {
          setInitialLoading(false);
        }
      };
      fetchTripData();
    } else {
        setError('No trip code provided.');
        setInitialLoading(false);
    }
  }, [tripCode, router]);

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
        setError('You must be logged in to edit a trip.');
        setLoading(false);
        router.push('/login');
        return;
    }

    try {
      const res = await fetch(`/api/trips/${tripCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update trip. ' + (data.errors ? Object.values(data.errors).map(err => err.message).join(', ') : ''));
      }

      setSuccess('Trip updated successfully!');
      setTimeout(() => router.push('/admin/list-trips'), 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <p className="text-center text-gray-500 mt-10">Loading trip data...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Trip: {formData.name || tripCode}</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4 text-sm">{error}</p>}
      {success && <p className="text-green-500 bg-green-100 p-3 rounded mb-4 text-sm">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).filter(key => key !== '_id' && key !== '__v').map((key) => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type={key === 'start' ? 'date' : key === 'perPerson' ? 'number' : 'text'}
              id={key}
              name={key}
              value={formData[key] || ''}
              onChange={handleChange}
              required
              disabled={key === 'code'} // Make code field read-only if it's the identifier
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${key === 'code' ? 'bg-gray-100' : ''}`}
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
          {loading ? 'Updating Trip...' : 'Update Trip'}
        </button>
      </form>
    </div>
  );
}