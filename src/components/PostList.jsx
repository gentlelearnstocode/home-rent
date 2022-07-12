import React from 'react';
import PropTypes from 'prop-types';

const PostList = ({ title, location, index, price, type, onDeletePost, id, onViewPostItem }) => {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
        {index + 1}
      </th>
      <td className="px-6 py-4 capitalize">{title}</td>
      <td className="px-6 py-4 capitalize">{location}</td>
      <td className="px-6 py-4 capitalize">{type}</td>
      <td className="px-6 py-4">${price}</td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-center items-center space-x-2">
          <p
            onClick={() => onViewPostItem(type, id)}
            className="font-medium text-sky-500 dark:text-sky-500 cursor-pointer">
            View
          </p>
          <p onClick={onDeletePost} className="font-medium text-red-500 dark:text-red-500 cursor-pointer">
            Delete
          </p>
          <p className="font-medium text-green-500 dark:text-green-500 cursor-pointer">Edit</p>
        </div>
      </td>
    </tr>
  );
};

export default PostList;

PostList.propTypes = {
  title: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  onDeletePost: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  onViewPostItem: PropTypes.func.isRequired
};
