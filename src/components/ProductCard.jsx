import React from 'react';
import PropTypes from 'prop-types';
import { GoLocation } from 'react-icons/go';
import { IoBedOutline, IoPricetagsOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons/lib';
import { MdOutlineBathroom } from 'react-icons/md';
import { BsHouse } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ img, name, location, bedrooms, bathrooms, regularPrice, offer, discountedPrice, type, id }) => {
  const navigate = useNavigate();

  const handleProductClicked = () => {
    navigate(`/category/${type}/${id}`);
  };

  return (
    <IconContext.Provider value={{ color: '#34568b', size: '30px' }}>
      <div
        onClick={() => handleProductClicked()}
        className="w-50 bg-white rounded-lg overflow-hidden font-sans font-semibold text-gray-500 h-80 cursor-pointer">
        <div className="flex flex-row h-full">
          <img src={img[0]} className="w-1/2 h-full" />
          <div className="p-2">
            <div className="flex flex-row items-center">
              <GoLocation />
              <h1 className="ml-2 capitalize">{location}</h1>
            </div>
            <div className="flex flex-row space-x-2 items-center">
              <BsHouse />
              <h2 className="mt-2 text-xl capitalize">{name}</h2>
            </div>
            <h3 className="text-2xl font-mono font-bold my-2 text-emerald-400">
              <div className="flex flex-row space-x-2">
                {<IoPricetagsOutline />} <p>{offer ? discountedPrice : regularPrice}</p>
                {type === 'rent' && '/Month'}
              </div>
            </h3>
            <div className="flex flex-row items-center space-x-2">
              <IoBedOutline />
              <p className="text-xl">{bedrooms ? bedrooms : '1'}</p>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <MdOutlineBathroom />
              <p className="text-xl">{bathrooms ? bathrooms : '1'}</p>
            </div>
          </div>
        </div>
      </div>
    </IconContext.Provider>
  );
};

ProductCard.propTypes = {
  type: PropTypes.string.isRequired,
  img: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  regularPrice: PropTypes.string.isRequired,
  bedrooms: PropTypes.number.isRequired,
  bathrooms: PropTypes.number.isRequired,
  offer: PropTypes.bool.isRequired,
  discountedPrice: PropTypes.string,
  id: PropTypes.string.isRequired
};

export default ProductCard;
