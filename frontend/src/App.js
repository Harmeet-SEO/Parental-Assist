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
      </Routes>
    </Router>
  );
}

export default App;
