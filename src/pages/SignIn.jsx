import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { TextField, Button, Paper } from '@mui/material';

import { showPasswordIcon, hidePasswordIcon } from '../assets/icons';
import { OAuth } from '../components';

const SignIn = () => {
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
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      userCredential.user && navigate('/profile');
      // const userAccessToken = await userCredential.user.getIdToken();
      localStorage.setItem('displayName', userCredential.user.displayName);
      localStorage.setItem('Email', userCredential.user.email);
    } catch (error) {
      toast.error('Invalid user credentials');
    }
  };

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
          <div className="flex flex-row justify-center items-center w-full">
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

export default SignIn;
