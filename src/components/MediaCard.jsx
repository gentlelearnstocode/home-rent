import * as React from 'react';
import { useState } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Collapse,
  Fab,
  Chip,
  ListItem,
  Avatar,
  Divider,
  ListItemAvatar,
  Badge
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { KingBed, Weekend, LocalParking, Bathroom, Place } from '@mui/icons-material';

import { ExpandMore } from '../utils/utilComponent';
import styles from './styles';

const MediaCard = (props) => {
  const {
    img,
    name,
    regularPrice,
    discountedPrice,
    offer,
    id,
    onClickCard,
    type,
    bathrooms,
    bedrooms,
    parking,
    furnished,
    location,
    authStatus,
    toggleLoginModal
  } = props;
  console.log(props);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={styles.cardWrapper}>
      <CardMedia sx={styles.cardMedia} component="img" height="100" src={img[0]} alt="post" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {name}
        </Typography>
        <Divider />
        <div className="flex flex-row mt-5 mb-5">
          <Place color="primary" />
          <Typography sx={{ marginLeft: 1, fontSize: 18 }} gutterBottom variant="h6" component="h2">
            {location}
          </Typography>
        </div>
        <Chip
          variant="outlined"
          label={`$${offer ? discountedPrice : regularPrice}`}
          sx={{ width: 100, fontSize: 20 }}
        />
      </CardContent>
      <CardActions>
        <div>
          <Button
            size="small"
            variant="outlined"
            onClick={() => (authStatus ? onClickCard(type, id) : toggleLoginModal(true))}>
            Learn More
          </Button>
        </div>
        <ExpandMore
          expand={expanded}
          onClick={() => handleExpandClick()}
          aria-expanded={expanded}
          aria-label="show more">
          <Fab color="primary">
            <ExpandMoreIcon />
          </Fab>
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <ListItem>
            <ListItemAvatar>
              <Badge badgeContent={bedrooms} color="primary">
                <KingBed color="action" />
              </Badge>
            </ListItemAvatar>
            <ListItemAvatar>
              <Badge badgeContent={bathrooms} color="primary">
                <Bathroom color="action" />
              </Badge>
            </ListItemAvatar>
            <ListItemAvatar>
              <Badge badgeContent={furnished ? 'Yes' : 'No'} color={furnished ? 'success' : 'error'}>
                <Weekend color="action" />
              </Badge>
            </ListItemAvatar>
            <ListItemAvatar>
              <Badge badgeContent={parking ? 'Yes' : 'No'} color={parking ? 'success' : 'error'}>
                <LocalParking color="action" />
              </Badge>
            </ListItemAvatar>
          </ListItem>
        </CardContent>
      </Collapse>
    </Card>
  );
};

MediaCard.propTypes = {
  img: PropTypes.array,
  name: PropTypes.string.isRequired,
  regularPrice: PropTypes.string,
  discountedPrice: PropTypes.string,
  offer: PropTypes.bool.isRequired,
  id: PropTypes.string,
  onClickCard: PropTypes.func,
  type: PropTypes.string,
  bathrooms: PropTypes.number,
  bedrooms: PropTypes.number,
  parking: PropTypes.bool,
  furnished: PropTypes.bool,
  location: PropTypes.string,
  authStatus: PropTypes.bool,
  toggleLoginModal: PropTypes.func
};

export default MediaCard;
