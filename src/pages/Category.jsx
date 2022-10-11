import React, { Fragment } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { connect } from 'react-redux/es/exports';
import PropTypes from 'prop-types';

import { ProductCard, Progress, MediaCard, InstructionModal, ErrorModal } from '../components';
import { queryListingData, queryListingDataV2 } from '../utils/asyncUtils';
import { Messages } from '../constants';
import { types } from '../actions/types';

const Category = ({
  isSignedIn,
  isFetchingPost,
  isErrorFetching,
  fetchPostInit,
  fetchPostSuccess,
  fetchPostFail,
  userCredentails,
  userPosts
}) => {
  const [showLoginModal, toggleLoginModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(isErrorFetching);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPosts = async () => {
      fetchPostInit();
      try {
        const response = await queryListingDataV2('userRef', userCredentails.userId);
        if (response) {
          fetchPostSuccess({ userPosts: response });
        }
      } catch (error) {
        fetchPostFail();
      }
    };
    fetchUserPosts();
  }, []);

  const handleProductClicked = (type, id) => {
    navigate(`/category/${type}/${id}`);
  };

  const emptyList = (
    <h1 className="font-semibold text-center">Currently, there is no places for {params.categoryName}</h1>
  );

  return (
    <>
      <div className="h-full">
        {isFetchingPost ? (
          <Progress />
        ) : userPosts && userPosts.length > 0 ? (
          <Fragment>
            <main className="grid lg:grid-cols-4 gap-2 mx-10 md:grid-cols-2 sm:grid-cols-1 my-10">
              {userPosts.map((list) => {
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
                  <section key={userPosts.id}>
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
        <ErrorModal
          open={showErrorModal}
          toggleModal={setShowErrorModal}
          message={Messages.ERROR_FETCHING_POST}
          errorButtonLabel="Got it"
        />
      </div>
    </>
  );
};

Category.propTypes = {
  isSignedIn: PropTypes.bool.isRequired,
  isFetchingPost: PropTypes.bool,
  isErrorFetching: PropTypes.bool,
  fetchPostInit: PropTypes.func,
  fetchPostSuccess: PropTypes.func,
  fetchPostFail: PropTypes.func,
  userCredentails: PropTypes.object,
  userPosts: PropTypes.array
};

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.authReducer.isSignedIn,
    userPosts: state.postReducer.userPosts,
    isFetchingPost: state.postReducer.isFetchingPost,
    isErrorFetching: state.postReducer.isErrorFetching,
    userCredentails: state.authReducer.userCredentials
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPostInit: () => dispatch({ type: types.FETCH_USER_POST_INIT }),
    fetchPostSuccess: (payload) => dispatch({ type: types.FETCH_USER_POST_SUCCESS, payload }),
    fetchPostFail: () => dispatch({ type: types.FETCH_USER_POST_FAIL })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);
