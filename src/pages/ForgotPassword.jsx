import React from 'react';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleEmailInput = (e) => setEmail(e.target.value);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('Reset password has been sent to your email');
    } catch (error) {
      toast.error('Could not set reset password');
    }
  };

  return (
    <div className="flex flex-col items-center w-screen">
      <header>
        <p className="text-primary">Forgot Password</p>
      </header>
      <main className="auth-container">
        <form onSubmit={handleFormSubmit} className="flex flex-col items-center py-5">
          <div className="flex flex-row justify-center items-center w-full">
            <input
              onChange={handleEmailInput}
              type="email"
              id="email"
              placeholder="Email"
              className="input-container"
              value={email}
            />
          </div>
          <button type="submit" className="btn-primary hover:bg-indigo-400">
            Reset Password
          </button>
        </form>
      </main>
    </div>
  );
};

export default ForgotPassword;
