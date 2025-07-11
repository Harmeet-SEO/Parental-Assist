import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ArticlePage from "./pages/ArticlePage";
import ArticleDetail from "./pages/ArticleDetail";
import CategoryPage from "./pages/CategoryPage";
import Podcasts from "./pages/Podcasts";
import SearchResults from "./pages/SearchResults";
import SearchDetail from "./pages/SearchDetail";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Feedback from "./pages/Feedback";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import CreateUser from "./pages/CreateUser";
import ManageContent from "./pages/ManageContent";
import AddEditArticle from "./pages/AddEditArticle";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/articles" element={<ArticlePage />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/content/:id" element={<SearchDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feedback" element={<Feedback />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/create-user" element={<CreateUser />} />
        <Route path="/admin/content" element={<ManageContent />} />
        <Route path="/admin/articles/add" element={<AddEditArticle />} />
        <Route path="/admin/articles/edit/:id" element={<AddEditArticle />} />
      </Routes>
    </Router>
  );
}

export default App;
