'use client';

import { useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, Textarea, Button, Paper, Title, Container, Grid, Text, Notification, Box } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

export default function ContactPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Name must have at least 2 letters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      subject: (value) => (value.trim().length === 0 ? 'Subject is required' : null),
      message: (value) => (value.trim().length < 10 ? 'Message must be at least 10 characters long' : null),
    },
  });

  const handleSubmit = (values) => {
    setLoading(true);
    setStatus('Sending...');
    console.log('Form data submitted:', values);
    // Simulate API call
    setTimeout(() => {
      setStatus('Message sent successfully!');
      setLoading(false);
      form.reset();
      setTimeout(() => setStatus(''), 3000); // Clear status after 3 seconds
    }, 1000);
  };

  return (
    <Container size="lg" my="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Title order={1} ta="center" mb="xl">Contact Us</Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput label="Name" placeholder="Your name" required {...form.getInputProps('name')} />
              <TextInput mt="md" label="Email" placeholder="Your email" required {...form.getInputProps('email')} />
              <TextInput mt="md" label="Subject" placeholder="Subject" required {...form.getInputProps('subject')} />
              <Textarea mt="md" label="Message" placeholder="Your message" required minRows={4} {...form.getInputProps('message')} />
              <Button type="submit" fullWidth mt="xl" loading={loading}>
                Send Message
              </Button>
            </form>
            {status && (
              <Notification
                icon={status === 'Message sent successfully!' ? <IconCheck size="1.1rem" /> : null}
                color={status === 'Message sent successfully!' ? 'teal' : 'blue'}
                title="Status"
                mt="md"
                onClose={() => setStatus('')}
                loading={loading}
              >
                {status}
              </Notification>
            )}
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Box pl={{ base: 0, md: 'lg' }} mt={{ base: 'xl', md: 0 }}>
              <Title order={3} c="blue.6">Travlr Getaways</Title>
              <Text mt="md">
                <Text component="span" fw={500}>Address:</Text> 123 Lorem Ipsum Cove, Sed Ut City, LI 12345
              </Text>
              <Text mt="xs">
                <Text component="span" fw={500}>Telephone:</Text> 1-800-999-9999
              </Text>
              <Text mt="xs">
                <Text component="span" fw={500}>Fax:</Text> 1-800-111-1111
              </Text>
            </Box>
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
}