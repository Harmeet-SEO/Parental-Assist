import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ArticlePage from "./pages/ArticlePage";
import CategoryPage from "./pages/CategoryPage";
import Podcasts from "./pages/Podcasts";
import SearchResults from "./pages/SearchResults";
import SearchDetail from "./pages/SearchDetail";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Feedback from "./pages/Feedback";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageContent from "./pages/ManageContent";
import AddEditContent from "./pages/AddEditContent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/content/:id" element={<SearchDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/articles" element={<ArticlePage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/content" element={<ManageContent />} />
        <Route path="/admin/content/add" element={<AddEditContent />} />
        <Route path="/admin/content/edit/:id" element={<AddEditContent />} />
      </Routes>
    </Router>
  );
}

export default App;
