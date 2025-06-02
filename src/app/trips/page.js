import TripCard from '@/components/TripCard';

// This function will run on the server to fetch data
async function getTrips() {
  // Use the NEXT_PUBLIC_API_BASE_URL from .env.local
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'}/trips`;
  try {
    const res = await fetch(apiUrl, {
      cache: 'no-store', // Or 'force-cache', or revalidate options for ISR
    });

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error(`Failed to fetch trips: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error in getTrips:", error);
    return []; 
  }
}

export default async function TripsPage() {
  const trips = await getTrips();

  if (!trips || trips.length === 0) {
    return <p className="text-center text-gray-500 mt-10">No trips available at the moment. Please check back later!</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8 text-gray-800">Our Amazing Trips</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <TripCard key={trip.code || trip._id} trip={trip} isAdmin={false} /> // Assuming public view, no edit
        ))}
      </div>
    </div>
  );
}