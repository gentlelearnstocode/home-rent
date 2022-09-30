import * as React from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Collapse, Fab, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';

import { ExpandMore } from '../utils/utilComponent';

const MediaCard = (props) => {
  const { img, name, regularPrice, discountedPrice, offer, id, onClickCard, type } = props;
  console.log(props);
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ minWidth: 345, minHeight: 500 }} onClick={onClickCard(type, id)}>
      <CardMedia component="img" height="140" src={img} alt="post" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Chip
          variant="outlined"
          label={`$${offer ? discountedPrice : regularPrice}`}
          sx={{ width: 100, fontSize: 20 }}
        />
      </CardContent>
      <CardActions>
        <div>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </div>
        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
          <Fab color="primary">
            <ExpandMoreIcon />
          </Fab>
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10 minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken,
            shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp
            to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic,
            tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes.
            Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook without stirring,
            until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
            mussels, tucking them down into the rice, and cook again without stirring, until mussels have opened and
            rice is just tender, 5 to 7 minutes more. (Discard any mussels that don&apos;t open.)
          </Typography>
          <Typography>Set aside off of the heat to let rest for 10 minutes, and then serve.</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

MediaCard.propTypes = {
  img: PropTypes.string,
  name: PropTypes.string.isRequired,
  regularPrice: PropTypes.string,
  discountedPrice: PropTypes.string,
  offer: PropTypes.bool.isRequired,
  id: PropTypes.string,
  onClickCard: PropTypes.func,
  type: PropTypes.string
};

export default MediaCard;
