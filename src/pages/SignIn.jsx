import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';

import { EmailIcon, LockIcon, showPasswordIcon, hidePasswordIcon } from '../assets/icons';
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
      <header>
        <p className="text-primary">Welcome To HomeRent</p>
      </header>
      <main className="auth-container">
        <form onSubmit={handleSignInSubmit} className="flex flex-col items-center py-5">
          <div className="flex flex-row justify-center items-center w-full">
            <EmailIcon />
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={handleUserInput}
              className="input-container"
            />
            <div className="w-5"></div>
          </div>
          <div className="flex flex-row justify-center items-center w-full">
            <LockIcon />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              value={password}
              onChange={handleUserInput}
              className="input-container"
            />
            {!showPassword ? (
              <img onClick={toggleShowPassword} src={showPasswordIcon} width="20px" height="20px" />
            ) : (
              <img onClick={toggleShowPassword} src={hidePasswordIcon} width="20px" height="20px" />
            )}
          </div>
          <Link to="/forgot-password" className="self-end mx-2 my-2">
            Forgot password
          </Link>
          <button type="submit" className="btn-primary hover:bg-indigo-400">
            Signin
          </button>
          <OAuth />
          <Link to="/sign-up" className="btn-primary my-5 bg-emerald-500 capitalize hover:bg-green-400">
            Click here to Sign up
          </Link>
        </form>
      </main>
    </div>
  );
};

export default SignIn;
