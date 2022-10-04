const styles = {
  bottomNavigation: {
    width: '100%',
    position: 'fixed',
    bottom: 0
  },
  instructionModalBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: 200,
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    borderRadius: 2,
    boxShadow: 24,
    p: 4
  },
  progressBar: {
    width: '100%',
    marginTop: 5
  },
  cardWrapper: { maxWidth: 400, maxHeight: 800, margin: '5px 0 50px 0' },
  cardMedia: { maxHeight: 200, objectFit: 'cover' }
};

export default styles;
