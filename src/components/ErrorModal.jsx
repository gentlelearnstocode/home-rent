import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';

import styles from './styles';

const ErrorModal = (props) => {
  const { open, message, onClose, toggleModal, errorButtonLabel } = props;

  return (
    <div>
      <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={styles.instructionModalBox}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {message}
          </Typography>
          <div>
            <Button variant="contained" color="primary" onClick={() => toggleModal(false)}>
              {errorButtonLabel}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

ErrorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  errorButtonLabel: PropTypes.string
};

export default ErrorModal;
