/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';

// Lazy load major route chunks to speed up the initial application load time
const Home = React.lazy(() => import('./pages/frontend/Home'));
const ProductDetail = React.lazy(() => import('./pages/frontend/ProductDetail'));
const BlogList = React.lazy(() => import('./pages/frontend/BlogList'));
const BlogPost = React.lazy(() => import('./pages/frontend/BlogPost'));
const Login = React.lazy(() => import('./pages/admin/Login'));
const AdminLayout = React.lazy(() => import('./components/layout/AdminLayout'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const Products = React.lazy(() => import('./pages/admin/Products'));
const Categories = React.lazy(() => import('./pages/admin/Categories'));
const Blogs = React.lazy(() => import('./pages/admin/Blogs'));

// Simple fallback skeleton for layout routes
const PageFallback = () => (
  <div className="w-full h-screen flex justify-center pt-20 bg-gray-50">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="h-8 w-32 bg-gray-200 rounded-md"></div>
      <div className="h-4 w-48 bg-gray-200 rounded-md"></div>
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageFallback />}>
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
          <Route path="/product/:slug" element={
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
      </Suspense>
    </Router>
  );
}
