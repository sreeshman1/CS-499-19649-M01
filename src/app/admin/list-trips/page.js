'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TripCard from '../../components/TripCard';
import { Container, Title, Button, Grid, Loader, Text, Group, Center } from '@mantine/core';
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
      router.push('/login');
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
    return <Center style={{ height: '50vh' }}><Loader /></Center>;
  }

  if (error) {
    return <Text c="red" ta="center" my="xl">Error loading trips: {error}</Text>;
  }

  return (
    <Container size="lg" my="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Manage Trips</Title>
        <Button component={Link} href="/admin/add-trip" color="green">
          Add New Trip
        </Button>
      </Group>

      {trips.length === 0 ? (
        <Text ta="center" my="xl">No trips found. Add one!</Text>
      ) : (
        <Grid>
          {trips.map((trip) => (
            <Grid.Col key={trip.code || trip._id} span={{ base: 12, sm: 6, lg: 4 }}>
              <TripCard trip={trip} isAdmin={true} />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
}