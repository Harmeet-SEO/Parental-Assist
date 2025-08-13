import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

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
import Profile from "./pages/Profile";
import Feedback from "./pages/Feedback";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import CreateUser from "./pages/CreateUser";
import ManageContent from "./pages/ManageContent";
import AddEditContent from "./pages/AddEditContent";
import AddEditArticle from "./pages/AddEditArticle";

// Student pages
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentActivity from "./pages/Student/StudentActivity";
import ChatbotSuccess from "./pages/ChatbotSuccess";
import ParentingTipDetail from "./components/ParentingTipDetail";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
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
        <Route path="/chatbot-success" element={<ChatbotSuccess />} />
        <Route path="/tip/:id" element={<ParentingTipDetail />} />

        {/* <Route path="/chatbot-cancel" element={<ChatbotCancel />} /> */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/feedback" element={<Feedback />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-user"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/content"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/content/add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddEditContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/content/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddEditContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/articles/add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddEditArticle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/articles/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddEditArticle />
            </ProtectedRoute>
          }
        />

        {/* Student Protected Routes */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/activity"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentActivity />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
