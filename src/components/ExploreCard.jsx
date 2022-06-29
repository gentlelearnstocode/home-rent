import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ExploreCard = ({ type, icon, link }) => {
  console.log(icon);
  return (
    <div className="px-5 w-1/4 hover:-translate-y-1 transition duration-100">
      <div
        className="bg-white mt-10 h-40 rounded-lg shadow-lg"
        style={{ backgroundImage: 'url(../assets/icons/google.png)' }}>
        <section className="flex flex-col justify-center items-center space-y-4">
          <h1 className="text-center mx-2 text-xl font-semibold text-gray-600">{type}</h1>
          <Link to={link}>
            <img src={icon} width="80" height="80" />
          </Link>
        </section>
      </div>
    </div>
  );
};

ExploreCard.propTypes = {
  type: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
};

export default ExploreCard;
