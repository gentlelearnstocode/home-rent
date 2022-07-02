import React from 'react';
import PropTypes from 'prop-types';

const PostList = ({ title, location, index, price, type, onDeletePost, id }) => {
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
        <p onClick={() => onDeletePost(id)} className="font-medium text-red-500 dark:text-red-500 cursor-pointer">
          Delete
        </p>
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
  id: PropTypes.string.isRequired
};
