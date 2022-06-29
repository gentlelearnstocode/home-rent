import React from 'react';

import { ExploreCard } from '../components';
import { houseIcon, rentIcon, hotelIcon } from '../assets/icons';

const Explore = () => {
  const categoryRoutes = {
    rent: '/category/rent',
    sale: '/category/sale',
    hotel: '/category/hotel'
  };

  return (
    <div>
      <header>Choose your option</header>
      <div className="flex flex-row justify-center py-20 h-screen">
        <ExploreCard type="Sale" icon={houseIcon} link={categoryRoutes.sale} />
        <ExploreCard type="Rent" icon={rentIcon} link={categoryRoutes.rent} />
        <ExploreCard type="Hotel" icon={hotelIcon} link={categoryRoutes.hotel} />
      </div>
    </div>
  );
};

export default Explore;
