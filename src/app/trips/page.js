'use client';

import { useState, useEffect, useMemo } from 'react';
import TripCard from '../components/TripCard';
import { Container, Title, Grid, TextInput, NumberInput, Select, Button, Group, Text, Paper, Loader, Center } from '@mantine/core';

export default function TripsPage() {
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [filters, setFilters] = useState({
    searchTerm: '',
    minPrice: '',
    maxPrice: '',
    minDurationNights: '',
    minRating: '',
  });

  useEffect(() => {
    async function fetchTrips() {
      setLoading(true);
      setError('');
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || '/api'}/trips`;
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

  const handleFilterChange = (name, value) => {
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
        (trip.resort && trip.resort.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (trip.description && trip.description.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }
    if (filters.minPrice !== '' && filters.minPrice !== null) {
      processedTrips = processedTrips.filter(trip => parseFloat(trip.perPerson) >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice !== '' && filters.maxPrice !== null) {
      processedTrips = processedTrips.filter(trip => parseFloat(trip.perPerson) <= parseFloat(filters.maxPrice));
    }
    if (filters.minDurationNights !== '' && filters.minDurationNights !== null) {
      processedTrips = processedTrips.filter(trip => trip.durationNights >= parseInt(filters.minDurationNights, 10));
    }
    if (filters.minRating) {
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
          case 'rating':
            valA = a.rating;
            valB = b.rating;
            break;
          case 'durationNights':
            valA = a.durationNights;
            valB = b.durationNights;
            break;
          case 'name':
          default:
            valA = a[sortConfig.key] ? a[sortConfig.key].toLowerCase() : '';
            valB = b[sortConfig.key] ? b[sortConfig.key].toLowerCase() : '';
            break;
        }

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return processedTrips;
  }, [allTrips, sortConfig, filters]);

  if (loading) return <Center style={{ height: '50vh' }}><Loader /></Center>;
  if (error) return <Text color="red" ta="center" my="xl">Error: {error}</Text>;

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };

  return (
    <Container size="lg" my="xl">
      <Title order={1} ta="center" mb="xl">Our Amazing Trips</Title>

      <Paper withBorder shadow="md" p="lg" radius="md" mb="xl">
        <Title order={3} mb="lg">Filter & Sort Options</Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput
              label="Search Keyword"
              placeholder="Name, resort, description..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, lg: 2 }}>
            <NumberInput
              label="Min Price"
              placeholder="e.g., 500"
              value={filters.minPrice}
              onChange={(value) => handleFilterChange('minPrice', value)}
              min={0}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, lg: 2 }}>
            <NumberInput
              label="Max Price"
              placeholder="e.g., 1500"
              value={filters.maxPrice}
              onChange={(value) => handleFilterChange('maxPrice', value)}
              min={0}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, lg: 2 }}>
            <NumberInput
              label="Min Duration"
              placeholder="Nights"
              value={filters.minDurationNights}
              onChange={(value) => handleFilterChange('minDurationNights', value)}
              min={1}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, lg: 2 }}>
            <Select
              label="Min Resort Rating"
              placeholder="Any rating"
              value={filters.minRating}
              onChange={(value) => handleFilterChange('minRating', value)}
              data={[
                { value: '', label: 'Any Rating' },
                { value: '1', label: '1 Star & Up' },
                { value: '2', label: '2 Stars & Up' },
                { value: '3', label: '3 Stars & Up' },
                { value: '4', label: '4 Stars & Up' },
                { value: '5', label: '5 Stars' },
              ]}
            />
          </Grid.Col>
        </Grid>
        <Group mt="md">
          <Text fw={500}>Sort by:</Text>
          <Button variant={sortConfig.key === 'name' ? 'filled' : 'light'} onClick={() => handleSort('name')}>Name{getSortIndicator('name')}</Button>
          <Button variant={sortConfig.key === 'perPerson' ? 'filled' : 'light'} onClick={() => handleSort('perPerson')}>Price{getSortIndicator('perPerson')}</Button>
          <Button variant={sortConfig.key === 'durationNights' ? 'filled' : 'light'} onClick={() => handleSort('durationNights')}>Duration{getSortIndicator('durationNights')}</Button>
          <Button variant={sortConfig.key === 'rating' ? 'filled' : 'light'} onClick={() => handleSort('rating')}>Rating{getSortIndicator('rating')}</Button>
        </Group>
      </Paper>

      {filteredAndSortedTrips.length === 0 ? (
        <Text ta="center" my="xl">No trips match your current filters. Please try adjusting them.</Text>
      ) : (
        <Grid>
          {filteredAndSortedTrips.map((trip) => (
            <Grid.Col key={trip.code || trip._id} span={{ base: 12, sm: 6, lg: 4 }}>
              <TripCard trip={trip} isAdmin={false} />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
}
