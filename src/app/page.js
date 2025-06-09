"use client";
import Link from 'next/link';
import { Container, Title, Text, Button, Group, Image, Grid, Card, Box } from '@mantine/core';

export default function HomePage() {
  return (
    <Container size="lg" py="xl">
      <Box mb="xl">
        <Image
          radius="md"
          src="/images/sea-sound.jpg"
          alt="Beach"
          h={400}
          fit="cover"
          fallbackSrc="[https://placehold.co/800x400/E2E8F0/AAAAAA?text=Welcome+Image](https://placehold.co/800x400/E2E8F0/AAAAAA?text=Welcome+Image)"
        />
      </Box>
      <Title order={1} ta="center" mb="md">Enjoy the Summer with Us!</Title>
      <Text size="lg" ta="center" mb="xl" style={{ maxWidth: 600, margin: 'auto' }}>
        Welcome to Travlr Getaways, your premier destination for unforgettable beach resort experiences.
        Explore our curated trips, luxurious rooms, and delicious meals.
      </Text>
      <Group justify="center" mb="xl">
        <Button component={Link} href="/trips" size="lg">
          Explore Trips
        </Button>
        <Button component={Link} href="/about" size="lg" variant="outline">
          Learn More About Us
        </Button>
      </Group>

      <Title order={2} ta="center" my="xl">Latest News & Testimonials</Title>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} c="blue">2024 Best Beaches Contest Winners</Title>
            <Text size="sm" c="dimmed" mb="sm">April 02, 2024</Text>
            <Text>
              Integer magna leo, posuere et dignissim vitae, porttitor at odio. Pellentesque a metus nec magna placerat volutpat...
            </Text>
            <Button component={Link} href="#" variant="light" color="blue" mt="md">
              Read more
            </Button>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} c="blue">Testimonial</Title>
            <Text mt="xs" italic>
              “In hac habitasse platea dictumst. Integer purus justo, egestas eu consectetur eu, cursus in tortor. Quisque nec nunc ac mi ultrices iaculis.”
            </Text>
            <Text size="sm" c="dimmed" mt="sm" ta="right">- Juan De La Cruz</Text>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}