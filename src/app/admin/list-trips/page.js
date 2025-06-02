'use client'; // Making this a client component for now for easier state management / interaction

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TripCard from '../components/TripCard'; 
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';

export default function AdminListTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Client-side auth check
    const cookies = parseCookies();
    if (!cookies['travlr-token']) {
      router.push('/login'); // Redirect if not authenticated
      return;
    }

    async function fetchTrips() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/trips'); // Fetches from your Next.js API route
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Failed to fetch trips: ${res.status}`);
        }
        const data = await res.json();
        setTrips(data);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
        setError(err.message);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, [router]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading trips...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">Error loading trips: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Trips</h1>
        <Link href="/admin/add-trip" legacyBehavior>
          <a className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Add New Trip
          </a>
        </Link>
      </div>

      {trips.length === 0 ? (
        <p className="text-center text-gray-500">No trips found. Add one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.code || trip._id} trip={trip} isAdmin={true} />
          ))}
        </div>
      )}
    </div>
  );
}