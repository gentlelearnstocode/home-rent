import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { cloneDeep } from 'lodash';
import { toast } from 'react-toastify';
import { TextField, Button } from '@mui/material';

import { db } from '../firebase.config';
import { EmailIcon, LockIcon, showPasswordIcon, hidePasswordIcon, UserIcon } from '../assets/icons';
import { app } from '../firebase.config';
import { OAuth } from '../components';
import styles from './styles';
import { storeImages } from '../utils/asyncUtils';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    profileImage: null
  });

  const navigate = useNavigate();
  const { name, email, password, profileImage } = userData;
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleUserInput = (e) => {
    if (e.target.files) {
      setUserData((prev) => ({
        ...prev,
        profileImage: e.target.files
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [e.target.id]: e.target.value
      }));
    }
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
      <main className="auth-container mt-5 pt-5">
        <form onSubmit={handleSignUpSubmit} className="flex flex-col items-center py-5">
          <div className="flex flex-row justify-center items-center w-full">
            <TextField
              variant="filled"
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
            <TextField
              variant="filled"
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
            <TextField
              variant="filled"
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
          <Button variant="text" component="label">
            Profile photo
            <input onChange={handleUserInput} accept=".png,.jpeg,.jpg" type="file" />
          </Button>
          <Button variant="contained" type="submit" sx={styles.marginTop}>
            Signup
          </Button>
          <div className="flex flex-row space-x-5 mt-5">
            <OAuth />
            <Button variant="outlined">
              <Link to="/sign-in">Click here to sign in</Link>
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SignUp;
