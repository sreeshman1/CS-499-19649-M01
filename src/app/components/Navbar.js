'use client'; // This component uses client-side hooks (useState, useEffect for auth state)

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { parseCookies, destroyCookie } from 'nookies';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies['travlr-token'];
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      destroyCookie(null, 'travlr-token', { path: '/' }); // Ensure cookie is cleared client-side too
      setIsLoggedIn(false);
      router.push('/login'); // Redirect to login page
      router.refresh(); // Force a refresh to update server components if needed
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" legacyBehavior>
          <a className="text-2xl font-bold hover:text-blue-200 transition-colors">
            <img src="/images/logo.png" alt="Travlr Logo" className="h-10 inline mr-2" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='inline'; }} />
            <span style={{display: 'none'}}>Travlr Getaways</span>
          </a>
        </Link>
        <div className="space-x-4">
          <Link href="/" legacyBehavior><a className="hover:text-blue-200">Home</a></Link>
          <Link href="/trips" legacyBehavior><a className="hover:text-blue-200">Travel</a></Link>
          <Link href="/rooms" legacyBehavior><a className="hover:text-blue-200">Rooms</a></Link>
          <Link href="/meals" legacyBehavior><a className="hover:text-blue-200">Meals</a></Link>
          <Link href="/about" legacyBehavior><a className="hover:text-blue-200">About</a></Link>
          <Link href="/contact" legacyBehavior><a className="hover:text-blue-200">Contact</a></Link>

          {/* Admin Links - conditionally render based on auth state */}
          {isLoggedIn && (
            <>
              <Link href="/admin/list-trips" legacyBehavior><a className="hover:text-blue-200">Admin Trips</a></Link>
              <Link href="/admin/add-trip" legacyBehavior><a className="hover:text-blue-200">Add Trip</a></Link>
            </>
          )}
        </div>
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" legacyBehavior>
              <a className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
                Login
              </a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}