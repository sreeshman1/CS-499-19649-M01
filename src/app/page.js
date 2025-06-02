"use client";
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center py-10">
      <div className="mb-8">
        {/* Ensure this image is in your /public/images folder */}
        <img src="/images/sea-sound.jpg" alt="Beach" className="mx-auto rounded-lg shadow-lg max-w-3xl w-full" onError={(e) => { e.target.onerror = null; e.target.src='[https://placehold.co/800x400/E2E8F0/AAAAAA?text=Welcome+Image](https://placehold.co/800x400/E2E8F0/AAAAAA?text=Welcome+Image)'; }} />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Enjoy the Summer with Us!</h1>
      <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
        Welcome to Travlr Getaways, your premier destination for unforgettable beach resort experiences.
        Explore our curated trips, luxurious rooms, and delicious meals.
      </p>
      <div className="space-x-4">
        <Link href="/trips" legacyBehavior>
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
            Explore Trips
          </a>
        </Link>
        <Link href="/about" legacyBehavior>
          <a className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
            Learn More About Us
          </a>
        </Link>
      </div>

      {/* Example of how you might list some featured content, similar to your original #main section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Latest News & Testimonials</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-blue-600 mb-2">2024 Best Beaches Contest Winners</h3>
            <p className="text-sm text-gray-500 mb-2">April 02, 2024</p>
            <p className="text-gray-600">
              Integer magna leo, posuere et dignissim vitae, porttitor at odio. Pellentesque a metus nec magna placerat volutpat...
            </p>
            <Link href="/news/best-beaches-2024" legacyBehavior>
                <a className="text-blue-500 hover:underline mt-2 inline-block">Read more</a>
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Testimonial</h3>
            <p className="text-gray-600 italic">
              “In hac habitasse platea dictumst. Integer purus justo, egestas eu consectetur eu, cursus in tortor. Quisque nec nunc ac mi ultrices iaculis.”
            </p>
            <p className="text-sm text-gray-500 mt-2">- Juan De La Cruz</p>
          </div>
        </div>
      </div>
    </div>
  );
}