import React from 'react';
import { Box, Container, Grid, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/system';
import Sidebar from './Sidebar';
import MealList from './MealList';
import WeeklyMealList from './WeeklyMealList';
import NutritionInfo from './NutritionInfo';

const PlannerContainer = styled(Container)({
  marginTop: '20px',
  padding: '20px',
  display: 'flex',
});

const ContentContainer = styled(Box)({
  flexGrow: 1,
  marginLeft: '240px',
});

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
});

const Planner = () => {
  const [view, setView] = React.useState('daily');

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <PlannerContainer maxWidth="xl">
      <Sidebar selectedTab="WeeklyPlanner" onSelectTab={() => {}} />
      <ContentContainer>
        <Header>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view"
          >
            <ToggleButton value="daily" aria-label="daily">
              Day
            </ToggleButton>
            <ToggleButton value="weekly" aria-label="weekly">
              Week
            </ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="h4">{view === 'daily' ? 'Today' : 'This Week'}</Typography>
        </Header>
        <Grid container spacing={2}>
          <Grid item xs={5} md={10}>
            {view === 'daily' ? <MealList /> : <WeeklyMealList />}
          </Grid>
          <Grid item xs={12} md={4}>
          {view === 'daily' ? <NutritionInfo />: ''}
          </Grid>
        </Grid>
      </ContentContainer>
    </PlannerContainer>
  );
};

export default Planner;
