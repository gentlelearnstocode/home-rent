import React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';

import { db } from '../firebase.config';
import { contactIcon } from '../assets/images';
import { Loading } from '../components';

const ContactOwner = () => {
  const [userMessage, setUserMessage] = useState('');
  const [owner, setOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    fetchOwner();
  }, [params.ownerId]);

  const fetchOwner = async () => {
    const userRef = doc(db, 'users', params.ownerId);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      setOwner(userSnapshot.data());
      setIsLoading(false);
    } else {
      toast.error('Could not get owner info');
    }
  };

  console.log(owner);

  const onChangeMessage = (e) => {
    setUserMessage(e.target.value);
  };

  return (
    <div className="h-screen px-5">
      {isLoading ? (
        <Loading />
      ) : (
        <main className="flex flex-col items-center mt-10">
          <label className="block mb-2 text-xl font-medium text-gray-900 dark:text-gray-600 text-center">
            <div className="flex space-x-2">
              <img src={contactIcon} width="40" />
              <p>Contact {owner.name}</p>
            </div>
          </label>
          <textarea
            onChange={onChangeMessage}
            id="message"
            rows="4"
            value={userMessage}
            className="block p-2.5 w-1/2 h-52 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Your message..."></textarea>
          <section className="grid grid-cols-2 space-x-2 mt-2">
            <a href={`mailto:${owner.email}?Subject=${searchParams.get('postName')}&body=${userMessage}`}>
              <button
                type="button"
                className="px-2 py-1 bg-sky-500 rounded-md font-medium text-gray-50 hover:bg-indigo-400">
                Send Email
              </button>
            </a>
            <button
              onClick={() => setUserMessage('')}
              type="button"
              className="px-2 py-1 bg-yellow-400 rounded-md font-medium text-gray-500 hover:bg-yellow-300">
              Clear
            </button>
          </section>
        </main>
      )}
    </div>
  );
};

export default ContactOwner;
