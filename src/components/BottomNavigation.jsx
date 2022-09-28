import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationSearching from '@mui/icons-material/LocationSearching';

import styles from './styles';

const BottomNavigationBar = () => {
  const [value, setValue] = React.useState(0);
  return (
    <Box sx={styles.bottomNavigation}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}>
        <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Nearby" icon={<LocationSearching />} />
      </BottomNavigation>
    </Box>
  );
};

export default BottomNavigationBar;
