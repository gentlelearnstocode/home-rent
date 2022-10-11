const INCREASE_BEDROOMS = 'INCREASE_BEDROOMS';
const DECREASE_BEDROOMS = 'DECREASE_BEDROOMS';
const INCREASE_BATHROOMS = 'INCREASE_BATHROOMS';
const DECREASE_BATHROOMS = 'DECREASE_BATHROOMS';

//Categories
export const categoryRoutes = {
  rent: '/category/rent',
  sale: '/category/sale',
  homestay: '/category/homestay'
};

export const Messages = {
  LOG_OUT: 'Are you sure you want to log out?',
  LOG_IN_TO_VIEW: 'Please login to view this post!',
  INVALID_CREDENTIAL: 'Invalid user credentials!',
  LOGGED_IN: 'You have been logged in!',
  UPDATE_INFO_SUCCESS: 'Your information has been updated',
  UPDATE_INFO_FAIL: 'Could not update personal information. Please try again.',
  USER_SIGNOUT_SUCCESS: 'You have been signed out',
  NOTHING_TO_UPDATE: 'Nothing to be updated',
  POST_DELETE_SUCCESS: 'Post has been successfully deleted',
  DELETE_POST_CONFIRM: 'Are you sure you want to delete this post?',
  ERROR_FETCHING_POST: 'Could not fetch your post, please try again!'
};

export const colors = {};

export { INCREASE_BATHROOMS, DECREASE_BATHROOMS, INCREASE_BEDROOMS, DECREASE_BEDROOMS };
