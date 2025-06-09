import { Container, Title, Text, Paper, Divider, Grid } from '@mantine/core';

export default function AboutPage() {
  return (
    <Container size="lg" my="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Title order={1} mb="lg" style={{ borderBottom: '2px solid #DEE2E6', paddingBottom: '10px' }}>
          About Travlr Getaways
        </Title>

        <section>
          <Title order={2} c="blue.6" mb="sm">We Have Free Templates for Everyone</Title>
          <Text mb="md">
            Our website templates are created with inspiration, checked for quality and originality and meticulously sliced and coded. What's more, they're absolutely free! You can do a lot with them. You can modify them. You can use them to design websites for clients, so long as you agree with the Terms of Use. You can even remove all our links if you want to.
          </Text>
          <Text>
            We Have More Templates for You. Looking for more templates? Just browse through all our Free Website Templates and find what you're looking for. But if you don't find any website template you can use, you can try our Free Web Design service and tell us all about it. Maybe you're looking for something different, something special. And we love the challenge of doing something different and something special.
          </Text>
        </section>

        <Divider my="xl" />

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <section>
              <Title order={3} c="blue.6" mb="sm">Our Crews</Title>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a arcu ipsum.
              </Text>
            </section>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <section>
              <Title order={3} c="blue.6" mb="sm">Amenities</Title>
              <Text>
                Phasellus porta ultrices lorem vel luctus. Cras sodales nulla vitae eros fermentum consequat. Aenean at purus odio.
              </Text>
            </section>
          </Grid.Col>
        </Grid>

        <Divider my="xl" />

        <section>
          <Title order={2} c="blue.6" mb="sm">Be Part of Our Community</Title>
          <Text>
            If you're experiencing issues and concerns about this website template, join the discussion on our forum and meet other people in the community who share the same interests with you.
          </Text>
        </section>

        <Divider my="xl" />

        <section>
          <Title order={2} c="blue.6" mb="sm">Template Details</Title>
          <Text>
            Design version 14. Code version 4. Website Template details, discussion and updates for this Travlr Getaways Web Template. Website Template design by Free Website Templates. Please feel free to remove some or all the text and links of this page and replace it with your own About content.
          </Text>
        </section>
      </Paper>
    </Container>
  );
}