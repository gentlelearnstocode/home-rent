import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux/es/exports';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useEffect } from 'react';
import { types } from '../actions/types';

const PrivateRoute = ({ isSignedIn, checkingStatus, signInUser }) => {
  //TODO
  //App does not remember isSignedIn status

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      user && signInUser();
    });
    // const isAuthenticated = localStorage.getItem('access token');
    // if (isAuthenticated) {
    //   signInUser();
    // }
  });

  return isSignedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.authReducer.isSignedIn,
    checkingStatus: state.authReducer.checkingStatus
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signInUser: () => dispatch({ type: types.SIGN_IN })
  };
};

PrivateRoute.propTypes = {
  isSignedIn: PropTypes.bool.isRequired,
  checkingStatus: PropTypes.bool.isRequired,
  signInUser: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
