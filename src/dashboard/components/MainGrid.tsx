import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard, { StatCardProps } from './StatCard';
import { useMockData } from '../../context/MockDataContext';

export default function MainGrid() {
  const { stats, loading } = useMockData();

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '80vh', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
        <Typography variant="h6">Loading Dashboard Data...</Typography>
      </Box>
    );
  }

  const cards: StatCardProps[] = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      interval: 'All time',
      trend: 'up',
      data: [2, 4, 10, 20, 30, stats.totalUsers], // Dummy trend data
    },
    {
      title: 'Total Sellers',
      value: stats.totalSellers.toString(),
      interval: 'All time',
      trend: 'neutral',
      data: [1, 2, 5, 10, stats.totalSellers],
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      interval: 'All time',
      trend: 'up',
      data: [10, 20, 50, 100, stats.totalProducts],
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals.toString(),
      interval: 'Action needed',
      trend: 'down', // Assuming down is bad, but here it might differ. Let's keep it generic.
      data: [5, 10, 2, stats.pendingApprovals],
    },
    {
      title: 'Live Listings',
      value: stats.liveListings.toString(),
      interval: 'Active',
      trend: 'up',
      data: [10, 50, 80, stats.liveListings],
    },
    {
      title: 'Blocked Listings',
      value: stats.blockedListings.toString(),
      interval: 'Requires attention',
      trend: 'down',
      data: [0, 1, stats.blockedListings],
    },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {cards.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <CustomizedDataGrid />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
