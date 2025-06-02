import Link from 'next/link';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; // Return original if formatting fails
  }
};

const TripCard = ({ trip, isAdmin }) => { // isAdmin prop to show/hide edit button
  if (!trip) {
    return <div className="border rounded-lg p-4 shadow-lg bg-white animate-pulse">Loading trip...</div>;
  }

  return (
    <div className="border rounded-lg p-4 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <img
        src={trip.image?.startsWith('http') ? trip.image : `/images/${trip.image || 'placeholder.jpg'}`}
        alt={trip.name || 'Trip image'}
        className="w-full h-48 object-cover rounded-t-lg mb-4"
        onError={(e) => { e.target.onerror = null; e.target.src = '[https://placehold.co/600x400/E2E8F0/AAAAAA?text=Image+Not+Found](https://placehold.co/600x400/E2E8F0/AAAAAA?text=Image+Not+Found)'; }}
      />
      <div className="flex-grow">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">{trip.name}</h2>
        <p className="text-sm text-gray-600 mb-1"><strong>Code:</strong> {trip.code}</p>
        <p className="text-sm text-gray-600 mb-1"><strong>Resort:</strong> {trip.resort}</p>
        <p className="text-sm text-gray-600 mb-1"><strong>Length:</strong> {trip.length}</p>
        <p className="text-sm text-gray-600 mb-1"><strong>Start Date:</strong> {formatDate(trip.start)}</p>
        <p className="text-lg font-bold text-green-600 my-2">${trip.perPerson} per person</p>
        <p className="text-gray-700 text-sm mb-4">{trip.description}</p>
      </div>
      {isAdmin && (
        <Link href={`/admin/edit-trip/${trip.code}`} legacyBehavior>
          <a className="mt-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center transition-colors duration-300">
            Edit Trip
          </a>
        </Link>
      )}
    </div>
  );
};

export default TripCard;