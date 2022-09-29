import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import styles from './styles';

const Progress = () => {
  return (
    <Box sx={styles.progressBar}>
      <LinearProgress />
    </Box>
  );
};

export default Progress;
