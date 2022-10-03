import React, { Fragment } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { connect } from 'react-redux/es/exports';
import PropTypes from 'prop-types';

import { ProductCard, Progress, MediaCard, InstructionModal } from '../components';
import { queryListingData } from '../utils/asyncUtils';
import { Messages } from '../constants';

const Category = ({ isSignedIn }) => {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, toggleLoginModal] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let listings = [];
    try {
      queryListingData('type', params.categoryName, listings);
    } catch (error) {
      toast.success('Something went wrong');
    }
    const timer = setTimeout(() => {
      setListings(listings);
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleProductClicked = (type, id) => {
    navigate(`/category/${type}/${id}`);
  };

  const emptyList = (
    <h1 className="font-semibold text-center">Currently, there is no places for {params.categoryName}</h1>
  );

  console.log('signedin:', showLoginModal);

  return (
    <>
      <div className="h-full">
        {isLoading ? (
          <Progress />
        ) : listings && listings.length > 0 ? (
          <Fragment>
            <main className="grid lg:grid-cols-4 gap-2 mx-10 md:grid-cols-2 sm:grid-cols-1 my-10">
              {listings.map((list) => {
                const {
                  bathrooms,
                  bedrooms,
                  discountedPrice,
                  furnished,
                  geolocation,
                  imgUrls,
                  location,
                  name,
                  offer,
                  parking,
                  regularPrice,
                  timestamp,
                  type
                } = list.data;
                const { id } = list;
                return (
                  <section key={listings.id}>
                    <MediaCard
                      offer={offer}
                      img={imgUrls}
                      name={name}
                      regularPrice={regularPrice}
                      bedrooms={bedrooms}
                      bathrooms={bathrooms}
                      location={location}
                      discountedPrice={offer ? discountedPrice : regularPrice}
                      parking={parking}
                      furnished={furnished}
                      type={type}
                      id={id}
                      onClickCard={handleProductClicked}
                      toggleLoginModal={toggleLoginModal}
                      authStatus={isSignedIn}
                    />
                  </section>
                );
              })}
            </main>
          </Fragment>
        ) : (
          emptyList
        )}
        <InstructionModal
          open={showLoginModal}
          toggleModal={toggleLoginModal}
          onClose={() => navigate('/sign-in')}
          firstButtonLabel="cancel"
          secondButtonLabel="login"
          message={Messages.LOG_IN_TO_VIEW}
        />
      </div>
    </>
  );
};

Category.propTypes = {
  isSignedIn: PropTypes.bool.isRequired
};

const mapStateToProp = (state) => {
  return {
    isSignedIn: state.authReducer.isSignedIn
  };
};

export default connect(mapStateToProp)(Category);
