import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { cloneDeep } from 'lodash';
import { toast } from 'react-toastify';

import { db } from '../firebase.config';
import { EmailIcon, LockIcon, showPasswordIcon, hidePasswordIcon, UserIcon } from '../assets/icons';
import { app } from '../firebase.config';
import { OAuth } from '../components';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const { name, email, password } = userData;
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleUserInput = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: name
      });
      const userDataCopy = cloneDeep(userData);
      delete userDataCopy.password;
      userDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, 'users', user.uid), userDataCopy);
      localStorage.setItem('displayName', email);
      localStorage.setItem('Email', name);
      navigate('/');
      toast.success(`Welcome ${name}! You have registered successfully!`);
    } catch (error) {
      toast.error('Something went wrong. Please try again!');
    }
  };

  return (
    <div className="flex flex-col items-center w-screen h-screen">
      <header>
        <p className="text-primary">Signup To Get Started</p>
      </header>
      <main className="auth-container">
        <form onSubmit={handleSignUpSubmit} className="flex flex-col items-center py-5">
          <div className="flex flex-row justify-center items-center w-full">
            <UserIcon />
            <input
              type="text"
              id="name"
              placeholder="Name"
              value={name}
              onChange={handleUserInput}
              className="input-container"
            />
            <div className="w-5"></div>
          </div>
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
          <button type="submit" className="btn-primary hover:bg-indigo-400">
            Signup
          </button>
          <OAuth />
          <Link to="/sign-in" className="btn-primary my-5 bg-emerald-500 capitalize hover:bg-green-400">
            Click here to sign in
          </Link>
        </form>
      </main>
    </div>
  );
};

export default SignUp;
