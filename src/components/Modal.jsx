import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ toggleModal, mapUrl, inputAddress, longitude, latitude, onModalConfirm }) => {
  console.log(mapUrl);
  return (
    <div className="bg-black bg-opacity-50 opacity-100 fixed inset-0 z-50">
      <div className="flex h-screen justify-center items-center">
        <div className="flex flex-col items-center bg-white py-2 px-2 border-4 border-sky-500 rounded-xl w-1/2 h-1/2 justify-evenly">
          <h2 className="text-2xl text-blue-500 font-semibold">Confirm Geolocation</h2>
          <div className="flex flex-row w-full">
            <img className="w-2/3" src={mapUrl} />
            <section className="bg-sky-100 w-full p-2 text-lg text-gray-500 font-thin">
              <p className="text-xl font-semibold">Geocoding Information</p>
              <p>Address: {inputAddress}</p>
              <p>Latitude: {latitude}</p>
              <p>Longitude: {longitude}</p>
            </section>
          </div>
          <div className="flex flex-row justify-evenly">
            <button onClick={onModalConfirm} className="rounded px-4 py-2 ml-4 text-white bg-green-400 ">
              Confirm
            </button>
            <button onClick={toggleModal} className="rounded px-4 py-2 ml-4 text-white bg-slate-400 ">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  mapUrl: PropTypes.any,
  inputAddress: PropTypes.string,
  longitude: PropTypes.number,
  latitude: PropTypes.number,
  onModalConfirm: PropTypes.func
};

export default Modal;
