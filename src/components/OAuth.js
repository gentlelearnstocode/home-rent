import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';

import { googleIcon } from '../assets/icons';

const OAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const locateRoute = () => {
    if (location.pathname === '/sign-in') {
      return 'in';
    } else {
      return 'up';
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp()
        });
      }
      localStorage.setItem('displayName', user.displayName);
      localStorage.setItem('Email', user.email);

      navigate('/');
      toast.success(`Welcome ${user.displayName}! You have been logged in with google account!`);
    } catch (error) {
      toast.error(`Could not sign ${locateRoute()} with Google`);
    }
  };

  return (
    <div className="flex flex-row items-center space-x-2 text-lg text-gray-700 font-semibold">
      <Button onClick={handleGoogleAuth} type="button" variant="outlined">
        <h1>Sign {locateRoute()} with Google</h1>
        <img src={googleIcon} alt="google-icon" width="30px" height="30px" />
      </Button>
    </div>
  );
};

export default OAuth;
