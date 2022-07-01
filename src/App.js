import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Navbar, PrivateRoute } from './components';
import { Explore, ForgotPassword, Offers, Profile, SignIn, SignUp, Category, CreateListing, Post } from './pages';

function App() {
  return (
    <div className=" bg-gray-100 h-full">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/category/:categoryName/:postId" element={<Post />} />
          <Route path="/create-listing" element={<PrivateRoute />}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default App;
