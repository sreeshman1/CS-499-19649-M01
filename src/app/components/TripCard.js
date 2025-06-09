import Link from 'next/link';
import { Card, Image, Text, Button, Group, Badge, Box } from '@mantine/core';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    // Adjust for timezone to prevent off-by-one day errors
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return utcDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; // Return original if formatting fails
  }
};

const TripCard = ({ trip, isAdmin }) => {
  if (!trip) {
    return (
      <Card withBorder shadow="sm" radius="md">
        <Text>Loading trip...</Text>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Card.Section>
        <Image
          src={trip.image?.startsWith('http') ? trip.image : `/images/${trip.image || 'placeholder.jpg'}`}
          alt={trip.name || 'Trip image'}
          height={180}
          fallbackSrc="[https://placehold.co/600x400/E2E8F0/AAAAAA?text=Image+Not+Found](https://placehold.co/600x400/E2E8F0/AAAAAA?text=Image+Not+Found)"
        />
      </Card.Section>

      <Box style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: 'var(--mantine-spacing-md) 0' }}>
        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500} size="lg">{trip.name}</Text>
          <Badge color="green" variant="light" size="lg">
            ${trip.perPerson}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed"><strong>Length:</strong> {trip.length}</Text>
        <Text size="sm" c="dimmed"><strong>Start Date:</strong> {formatDate(trip.start)}</Text>
        <Text size="sm" c="dimmed" mt="xs">{trip.description}</Text>
      </Box>

      {isAdmin && (
        <Button component={Link} href={`/admin/edit-trip/${trip.code}`} fullWidth mt="md" radius="md">
          Edit Trip
        </Button>
      )}
    </Card>
  );
};

export default TripCard;
