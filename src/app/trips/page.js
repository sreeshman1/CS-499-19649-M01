'use client';

import { useState, useEffect, useMemo } from 'react';
import TripCard from '../components/TripCard';

export default function TripsPage() {
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [filters, setFilters] = useState({
    searchTerm: '',
    minPrice: '',
    maxPrice: '',
    minDurationNights: '', // Changed from minDuration
    minRating: '',
  });

  useEffect(() => {
    async function fetchTrips() {
      setLoading(true);
      setError('');
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'}/trips`;
      try {
        const res = await fetch(apiUrl, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`Failed to fetch trips: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setAllTrips(data);
      } catch (err) {
        console.error("Error in getTrips:", err);
        setError(err.message);
        setAllTrips([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredAndSortedTrips = useMemo(() => {
    let processedTrips = [...allTrips];

    // Filtering
    if (filters.searchTerm) {
      processedTrips = processedTrips.filter(trip =>
        (trip.name && trip.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (trip.resort && trip.resort.toLowerCase().includes(filters.searchTerm.toLowerCase())) || // Keep searching resort string
        (trip.description && trip.description.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }
    if (filters.minPrice) {
      processedTrips = processedTrips.filter(trip => parseFloat(trip.perPerson) >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      processedTrips = processedTrips.filter(trip => parseFloat(trip.perPerson) <= parseFloat(filters.maxPrice));
    }
    if (filters.minDurationNights) { // Using new field
      processedTrips = processedTrips.filter(trip => trip.durationNights >= parseInt(filters.minDurationNights, 10));
    }
    if (filters.minRating) { // Using new field
      processedTrips = processedTrips.filter(trip => trip.rating >= parseInt(filters.minRating, 10));
    }

    // Sorting
    if (sortConfig.key) {
      processedTrips.sort((a, b) => {
        let valA, valB;

        switch (sortConfig.key) {
          case 'perPerson':
            valA = parseFloat(a.perPerson);
            valB = parseFloat(b.perPerson);
            break;
          case 'rating': // Changed from resortRating to rating
            valA = a.rating;
            valB = b.rating;
            break;
          case 'durationNights': // Changed from duration to durationNights
            valA = a.durationNights;
            valB = b.durationNights;
            break;
          case 'name':
          default:
            valA = a[sortConfig.key] ? a[sortConfig.key].toLowerCase() : '';
            valB = b[sortConfig.key] ? b[sortConfig.key].toLowerCase() : '';
            break;
        }

        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return processedTrips;
  }, [allTrips, sortConfig, filters]);

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading trips...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8 text-gray-800">Our Amazing Trips</h1>
      <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter & Sort Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="searchTerm"
            placeholder="Search keyword (name, resort...)"
            value={filters.searchTerm}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            name="minPrice"
            placeholder="Min price (e.g., 500)"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max price (e.g., 1500)"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            name="minDurationNights" // Changed from minDuration
            placeholder="Min duration (nights)"
            value={filters.minDurationNights}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            name="minRating"
            value={filters.minRating}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Filter by Min Resort Rating</option>
            <option value="1">1 Star & Up</option>
            <option value="2">2 Stars & Up</option>
            <option value="3">3 Stars & Up</option>
            <option value="4">4 Stars & Up</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-700 mr-2">Sort by:</span>
          <button onClick={() => handleSort('name')} className={`p-2 rounded text-sm ${sortConfig.key === 'name' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}</button>
          <button onClick={() => handleSort('perPerson')} className={`p-2 rounded text-sm ${sortConfig.key === 'perPerson' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>Price {sortConfig.key === 'perPerson' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}</button>
          <button onClick={() => handleSort('durationNights')} className={`p-2 rounded text-sm ${sortConfig.key === 'durationNights' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>Duration {sortConfig.key === 'durationNights' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}</button>
          <button onClick={() => handleSort('rating')} className={`p-2 rounded text-sm ${sortConfig.key === 'rating' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>Rating {sortConfig.key === 'rating' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}</button>
        </div>
      </div>

      {filteredAndSortedTrips.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No trips match your current filters. Please try adjusting them.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTrips.map((trip) => (
            <TripCard key={trip.code || trip._id} trip={trip} isAdmin={false} />
          ))}
        </div>
      )}
    </div>
  );
}