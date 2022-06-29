import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { mainLogo } from '../assets/images';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <div>
      <nav className="grid grid-cols-2 w-full border-2 shadow-lg">
        <div className="px-10">
          <img className="cursor-pointer" src={mainLogo} width="120" onClick={() => navigate('/')} />
        </div>
        <ul className="flex flex-row justify-evenly items-center w-full text-lg font-semibold text-gray-500">
          <li onClick={() => navigate('/')} className={isMatchRoute('/') ? 'navbar-onRoute' : 'navbar-link'}>
            Explore
          </li>
          <li
            onClick={() => navigate('/offers')}
            className={isMatchRoute('/offers') ? 'navbar-onRoute' : 'navbar-link'}>
            Offers
          </li>
          <li
            onClick={() => navigate('/create-listing')}
            className={isMatchRoute('/create-listing') ? 'navbar-onRoute' : 'navbar-link'}>
            Post
          </li>
          <li
            onClick={() => navigate('/profile')}
            className={isMatchRoute('/profile') ? 'navbar-onRoute' : 'navbar-link'}>
            Profile
          </li>
        </ul>
      </nav>
      <hr></hr>
    </div>
  );
};

export default Navbar;
