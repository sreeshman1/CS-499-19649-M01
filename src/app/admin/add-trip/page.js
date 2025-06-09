'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { Container, Title, Paper, TextInput, Textarea, NumberInput, Button, Notification, Alert } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { parseCookies } from 'nookies';
import { IconX, IconCheck } from '@tabler/icons-react';

export default function AddTripPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      code: '', name: '', length: '', durationNights: null, start: null,
      resort: '', rating: null, perPerson: '', image: '', description: '',
    },
    validate: {
      code: (value) => (value.trim().length === 0 ? 'Trip code is required' : null),
      name: (value) => (value.trim().length === 0 ? 'Trip name is required' : null),
      length: (value) => (value.trim().length === 0 ? 'Length is required' : null),
      durationNights: (value) => (value === null || value <= 0 ? 'Duration must be a positive number' : null),
      start: (value) => (value === null ? 'Start date is required' : null),
      resort: (value) => (value.trim().length === 0 ? 'Resort is required' : null),
      rating: (value) => (value === null || value < 1 || value > 5 ? 'Rating must be between 1 and 5' : null),
      perPerson: (value) => (value.trim().length === 0 ? 'Price is required' : null),
      image: (value) => (value.trim().length === 0 ? 'Image is required' : null),
      description: (value) => (value.trim().length === 0 ? 'Description is required' : null),
    }
  });

  const handleSubmit = async (values) => {
    setError('');
    setSuccess('');
    setLoading(true);

    const cookies = parseCookies();
    const token = cookies['travlr-token'];

    if (!token) {
      setError('You must be logged in to add a trip.');
      setLoading(false);
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add trip. ' + (data.errors ? Object.values(data.errors).map(err => err.message).join(', ') : ''));
      }

      setSuccess('Trip added successfully!');
      setTimeout(() => router.push('/admin/list-trips'), 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" my="xl">
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title order={2} ta="center" mb="xl">Add New Trip</Title>
        {error && <Alert icon={<IconX size="1rem" />} title="Error" color="red" withCloseButton onClose={() => setError('')} mb="md">{error}</Alert>}
        {success && <Notification icon={<IconCheck size="1.1rem" />} color="teal" title="Success" onClose={() => setSuccess('')} mb="md">{success}</Notification>}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Trip Code" placeholder="e.g., TRP001" required {...form.getInputProps('code')} />
          <TextInput mt="md" label="Trip Name" placeholder="e.g., Amazing Reef Adventure" required {...form.getInputProps('name')} />
          <TextInput mt="md" label="Length (Display)" placeholder="e.g., 7 nights / 8 days" required {...form.getInputProps('length')} />
          <NumberInput mt="md" label="Duration (Nights)" placeholder="e.g., 7" required min={1} {...form.getInputProps('durationNights')} />
          <DatePickerInput mt="md" label="Start Date" placeholder="Pick a date" required {...form.getInputProps('start')} />
          <TextInput mt="md" label="Resort (Display)" placeholder="e.g., Ocean Paradise, 5 stars" required {...form.getInputProps('resort')} />
          <NumberInput mt="md" label="Rating (1-5)" placeholder="e.g., 5" required min={1} max={5} step={1} {...form.getInputProps('rating')} />
          <TextInput mt="md" label="Price Per Person" placeholder="e.g., 1299.99" required {...form.getInputProps('perPerson')} />
          <TextInput mt="md" label="Image Filename" placeholder="e.g., reef_adventure.jpg" required {...form.getInputProps('image')} />
          <Textarea mt="md" label="Description" placeholder="Trip details" required minRows={3} {...form.getInputProps('description')} />
          <Button type="submit" fullWidth mt="xl" loading={loading}>Add Trip</Button>
        </form>
      </Paper>
    </Container>
  );
}