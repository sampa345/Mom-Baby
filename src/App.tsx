/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/frontend/Home';
import ProductDetail from './pages/frontend/ProductDetail';
import BlogList from './pages/frontend/BlogList';
import BlogPost from './pages/frontend/BlogPost';
import Login from './pages/admin/Login';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Blogs from './pages/admin/Blogs';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="blogs" element={<Blogs />} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
          </>
        } />
        <Route path="/product/:id" element={
          <>
            <Navbar />
            <ProductDetail />
          </>
        } />
        <Route path="/blogs" element={
          <>
            <Navbar />
            <BlogList />
          </>
        } />
        <Route path="/blog/:slug" element={
          <>
            <Navbar />
            <BlogPost />
          </>
        } />
      </Routes>
    </Router>
  );
}
