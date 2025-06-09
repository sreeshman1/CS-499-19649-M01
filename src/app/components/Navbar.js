'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { parseCookies, destroyCookie } from 'nookies';
import { useRouter } from 'next/navigation';
import { Container, Header, Group, Button, Image, Burger, Text, Box, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [opened, { toggle, close }] = useDisclosure(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = () => {
      const cookies = parseCookies();
      const token = cookies['travlr-token'];
      setIsLoggedIn(!!token);
    };
    checkAuthStatus();

    // Listen for route changes to re-check auth status
    const handleRouteChange = () => checkAuthStatus();
    // next/navigation does not have events like 'routeChangeComplete'.
    // A simple interval or more complex state management would be needed for instant updates.
    // For this case, we rely on page reloads or manual refreshes after login/logout.

    return () => {
      // Cleanup if any listeners were added
    };
  }, [router]);


  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      destroyCookie(null, 'travlr-token', { path: '/' });
      setIsLoggedIn(false);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = (
    <>
      <Button component={Link} href="/" variant="subtle" onClick={close}>Home</Button>
      <Button component={Link} href="/trips" variant="subtle" onClick={close}>Travel</Button>
      <Button component={Link} href="/about" variant="subtle" onClick={close}>About</Button>
      <Button component={Link} href="/contact" variant="subtle" onClick={close}>Contact</Button>
      {isLoggedIn && (
        <>
          <Button component={Link} href="/admin/list-trips" variant="subtle" onClick={close}>Admin Trips</Button>
          <Button component={Link} href="/admin/add-trip" variant="subtle" onClick={close}>Add Trip</Button>
        </>
      )}
    </>
  );

  return (
    <Box
      component="header"
      py="xs"
      px="md"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
        height: 60,
      })}
    >
      <Container size="lg" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Group style={{ flex: 1 }}>
          <Image src="/images/logo.png" alt="Travlr Logo" height={40} width="auto" />
          <Text size="xl" fw={700} component={Link} href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Travlr Getaways
          </Text>
        </Group>

        <Group spacing="xs" visibleFrom="sm">
          {navLinks}
        </Group>

        <Group visibleFrom="sm">
          {isLoggedIn ? (
            <Button color="red" onClick={handleLogout}>Logout</Button>
          ) : (
            <Button component={Link} href="/login" color="green">Login</Button>
          )}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

        <Drawer opened={opened} onClose={close} title="Menu" padding="xl" size="sm" position="right">
          <Group direction="column" align="stretch">
            {navLinks}
            {isLoggedIn ? (
              <Button color="red" onClick={() => { handleLogout(); close(); }}>Logout</Button>
            ) : (
              <Button component={Link} href="/login" color="green" onClick={close}>Login</Button>
            )}
          </Group>
        </Drawer>
      </Container>
    </Box>
  );
}