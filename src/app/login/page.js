'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { TextInput, Button, Paper, Title, Container, PasswordInput, Notification, Alert } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must have at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values) => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      router.push('/admin/list-trips');
      router.refresh(); // Refresh to update server-side auth checks and navbar
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Admin Login</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && (
          <Alert icon={<IconX size="1rem" />} title="Login Failed" color="red" withCloseButton onClose={() => setError('')} mb="md">
            {error}
          </Alert>
        )}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps('password')}
          />
          <Button type="submit" fullWidth mt="xl" loading={loading}>
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}