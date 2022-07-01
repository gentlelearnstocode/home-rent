import React from 'react';

import { ExploreCard } from '../components';
import { houseIcon, rentIcon, homestayIcon } from '../assets/icons';
import { categoryRoutes } from '../constants';

const Explore = () => {
  return (
    <div>
      <header>Choose your option</header>
      <div className="flex flex-row justify-center py-20 h-screen">
        <ExploreCard type="Sale" icon={houseIcon} link={categoryRoutes.sale} />
        <ExploreCard type="Rent" icon={rentIcon} link={categoryRoutes.rent} />
        <ExploreCard type="Homestay" icon={homestayIcon} link={categoryRoutes.homestay} />
      </div>
    </div>
  );
};

export default Explore;
