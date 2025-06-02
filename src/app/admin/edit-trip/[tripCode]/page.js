'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { parseCookies } from 'nookies';

export default function EditTripPage() {
  const router = useRouter();
  const params = useParams();
  const tripCode = params?.tripCode;

  const [formData, setFormData] = useState({
    code: '', name: '', length: '', durationNights: '', start: '',
    resort: '', rating: '', perPerson: '', image: '', description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
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
          let tripData = await res.json();
          if (tripData.start) {
            tripData.start = new Date(tripData.start).toISOString().split('T')[0];
          }
          // Ensure all fields, including new ones, are initialized
          setFormData({
            code: tripData.code || '',
            name: tripData.name || '',
            length: tripData.length || '',
            durationNights: tripData.durationNights === undefined ? '' : tripData.durationNights,
            start: tripData.start || '',
            resort: tripData.resort || '',
            rating: tripData.rating === undefined ? '' : tripData.rating,
            perPerson: tripData.perPerson || '',
            image: tripData.image || '',
            description: tripData.description || '',
            _id: tripData._id, // Keep _id if present for reference, but don't map to a field
            __v: tripData.__v, // Keep __v
          });
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
      setError('You must be logged in to edit a trip.');
      setLoading(false);
      router.push('/login');
      return;
    }

    // Prepare payload, removing internal fields and converting numbers
    const { _id, __v, ...payloadData } = formData;
    const payload = {
      ...payloadData,
      durationNights: payloadData.durationNights === '' ? undefined : Number(payloadData.durationNights),
      rating: payloadData.rating === '' ? undefined : Number(payloadData.rating),
    };


    try {
      const res = await fetch(`/api/trips/${tripCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
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

  // Define form fields structure
  const formFields = [
    { name: 'code', label: 'Trip Code', type: 'text', disabled: true },
    { name: 'name', label: 'Trip Name', type: 'text' },
    { name: 'length', label: 'Length (Display)', type: 'text' },
    { name: 'durationNights', label: 'Duration (Nights)', type: 'number' },
    { name: 'start', label: 'Start Date', type: 'date' },
    { name: 'resort', label: 'Resort (Display)', type: 'text' },
    { name: 'rating', label: 'Rating (1-5)', type: 'number', min: 1, max: 5, step: 1 },
    { name: 'perPerson', label: 'Price Per Person', type: 'text' },
    { name: 'image', label: 'Image Filename', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Trip: {formData.name || tripCode}</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4 text-sm">{error}</p>}
      {success && <p className="text-green-500 bg-green-100 p-3 rounded mb-4 text-sm">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {formFields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 capitalize">
              {field.label || field.name.replace(/([A-Z])/g, ' $1')}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required
                rows="3"
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required
                disabled={field.disabled || field.name === 'code'}
                min={field.min}
                max={field.max}
                step={field.step}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${field.disabled || field.name === 'code' ? 'bg-gray-100' : ''}`}
                placeholder={field.placeholder || `Enter ${field.label || field.name}`}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={loading || initialLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out disabled:opacity-50"
        >
          {loading ? 'Updating Trip...' : 'Update Trip'}
        </button>
      </form>
    </div>
  );
}