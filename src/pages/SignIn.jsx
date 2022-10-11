import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { TextField, Button, Input } from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { showPasswordIcon, hidePasswordIcon } from '../assets/icons';
import { OAuth, Progress } from '../components';
import { Messages } from '../constants';
import { types } from '../actions/types';

const SignIn = (props) => {
  const { signInInit, signInSuccess, signInFail, isSigningIn, isSigningError } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const { email, password } = userData;
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const handleUserInput = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    signInInit();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        const { displayName, email, uid, photoURL } = userCredential.user;
        signInSuccess({ displayName, email, uid, photoURL });
        navigate('/profile');
      }
      localStorage.setItem('displayName', userCredential.user.displayName);
      localStorage.setItem('Email', userCredential.user.email);
      toast.success(Messages.LOGGED_IN);
    } catch (error) {
      signInFail();
      console.log('error', error);
      toast.error(Messages.INVALID_CREDENTIAL);
    }
  };

  if (isSigningIn) {
    return <Progress />;
  }

  return (
    <div className="flex flex-col items-center w-screen h-screen">
      <main className="auth-container mt-5 pt-5">
        <form onSubmit={handleSignInSubmit} className="flex flex-col items-center py-5">
          <div className="flex flex-row justify-center items-center w-full">
            <TextField
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={handleUserInput}
              className="input-container"
              variant="filled"
            />
            <div className="w-5"></div>
          </div>
          <div className="flex flex-row justify-center items-center w-full mt-5">
            <TextField
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              value={password}
              onChange={handleUserInput}
              className="input-container"
              variant="filled"
            />
            {!showPassword ? (
              <img onClick={toggleShowPassword} src={showPasswordIcon} width="20px" height="20px" />
            ) : (
              <img onClick={toggleShowPassword} src={hidePasswordIcon} width="20px" height="20px" />
            )}
          </div>
          <Button variant="text">
            <Link to="/forgot-password" className="self-end mx-2 my-2">
              Forgot password
            </Link>
          </Button>
          <Button type="submit" variant="contained">
            Signin
          </Button>
          <div className="flex flex-row mt-5 space-x-5">
            <OAuth />
            <Button variant="outlined">
              <Link to="/sign-up">Click here to Sign up</Link>
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    signInInit: () => dispatch({ type: types.SIGN_IN_INIT }),
    signInSuccess: (payload) => dispatch({ type: types.SIGN_IN_SUCCESS, payload }),
    signInFail: () => dispatch({ type: types.SIGN_IN_FAIL })
  };
};

const mapStateToProps = (state) => {
  return {
    userCredentials: state.authReducer.userCredentials,
    isSigningIn: state.authReducer.isSigningIn,
    isSigningError: state.authReducer.isSigningError
  };
};

SignIn.propTypes = {
  signInInit: PropTypes.func.isRequired,
  signInSuccess: PropTypes.func.isRequired,
  signInFail: PropTypes.func.isRequired,
  userCredentials: PropTypes.object,
  isSigningIn: PropTypes.bool,
  isSigningError: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
