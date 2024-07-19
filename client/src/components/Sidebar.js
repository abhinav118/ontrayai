import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ selectedTab, onSelectTab }) => {
  const navigate = useNavigate();

  const handleListItemClick = (tab) => {
    onSelectTab(tab);
    if (tab === 'Home') {
      navigate('/home');
    } else if (tab === 'DailyPlanner') {
      navigate('/planner?view=daily');
    } else if (tab === 'WeeklyPlanner') {
      navigate('/planner?view=weekly');
    } else if (tab === 'Profile') {
      navigate('/profile');
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <List>
        <ListItem>
          <ListItemIcon>
            <Avatar alt="Profile Picture" src="/static/images/avatar/1.jpg" />
          </ListItemIcon>
          <ListItemText primary="User Name" secondary="user@example.com" />
        </ListItem>
        <Divider />
        <ListItem button selected={selectedTab === 'Home'} onClick={() => handleListItemClick('Home')}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button selected={selectedTab === 'DailyPlanner'} onClick={() => handleListItemClick('DailyPlanner')}>
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText primary="Daily Planner" />
        </ListItem>
        <ListItem button selected={selectedTab === 'WeeklyPlanner'} onClick={() => handleListItemClick('WeeklyPlanner')}>
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText primary="Weekly Planner" />
        </ListItem>
        <ListItem button selected={selectedTab === 'Profile'} onClick={() => handleListItemClick('Profile')}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
