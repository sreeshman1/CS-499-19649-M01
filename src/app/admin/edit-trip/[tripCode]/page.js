'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from '@mantine/form';
import { Container, Title, Paper, TextInput, Textarea, NumberInput, Button, Notification, Alert, Loader, Center } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { parseCookies } from 'nookies';
import { IconX, IconCheck } from '@tabler/icons-react';
import dayjs from 'dayjs';

export default function EditTripPage() {
  const router = useRouter();
  const params = useParams();
  const tripCode = params?.tripCode;

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm({
    initialValues: {
      code: '', name: '', length: '', durationNights: null, start: null,
      resort: '', rating: null, perPerson: '', image: '', description: '',
    },
    validate: {
      // Validation rules are the same as the add page
    }
  });

  useEffect(() => {
    const cookies = parseCookies();
    if (!cookies['travlr-token']) {
      router.push('/login');
      return;
    }

    if (tripCode) {
      const fetchTripData = async () => {
        setInitialLoading(true);
        setError('');
        try {
          const res = await fetch(`/api/trips/${tripCode}`);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch trip data');
          }
          let tripData = await res.json();
          form.setValues({
            ...tripData,
            start: tripData.start ? dayjs(tripData.start).toDate() : null,
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setInitialLoading(false);
        }
      };
      fetchTripData();
    }
  }, [tripCode, router]);

  const handleSubmit = async (values) => {
    setError('');
    setSuccess('');
    setLoading(true);

    const cookies = parseCookies();
    const token = cookies['travlr-token'];

    try {
      const res = await fetch(`/api/trips/${tripCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update trip.');
      }

      setSuccess('Trip updated successfully!');
      setTimeout(() => router.push('/admin/list-trips'), 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Center style={{ height: '50vh' }}><Loader /></Center>;
  }

  return (
    <Container size="sm" my="xl">
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title order={2} ta="center" mb="xl">Edit Trip: {form.values.name || tripCode}</Title>
        {error && <Alert icon={<IconX size="1rem" />} title="Error" color="red" withCloseButton onClose={() => setError('')} mb="md">{error}</Alert>}
        {success && <Notification icon={<IconCheck size="1.1rem" />} color="teal" title="Success" onClose={() => setSuccess('')} mb="md">{success}</Notification>}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Trip Code" required disabled {...form.getInputProps('code')} />
          <TextInput mt="md" label="Trip Name" required {...form.getInputProps('name')} />
          <TextInput mt="md" label="Length (Display)" required {...form.getInputProps('length')} />
          <NumberInput mt="md" label="Duration (Nights)" required min={1} {...form.getInputProps('durationNights')} />
          <DatePickerInput mt="md" label="Start Date" required {...form.getInputProps('start')} />
          <TextInput mt="md" label="Resort (Display)" required {...form.getInputProps('resort')} />
          <NumberInput mt="md" label="Rating (1-5)" required min={1} max={5} step={1} {...form.getInputProps('rating')} />
          <TextInput mt="md" label="Price Per Person" required {...form.getInputProps('perPerson')} />
          <TextInput mt="md" label="Image Filename" required {...form.getInputProps('image')} />
          <Textarea mt="md" label="Description" required minRows={3} {...form.getInputProps('description')} />
          <Button type="submit" fullWidth mt="xl" loading={loading}>Update Trip</Button>
        </form>
      </Paper>
    </Container>
  );
}