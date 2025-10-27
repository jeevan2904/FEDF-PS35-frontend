// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

// Auth Components
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Dashboard
import Dashboard from "./pages/Dashboard";

// Project Components
import ProjectsList from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import CreateProject from "./pages/CreateProject";

// Group Components
import GroupsList from "./components/groups/GroupsList";
import GroupDetails from "./components/groups/GroupDetails";
import CreateGroup from "./components/groups/CreateGroup";

// Task Components
import TaskBoard from "./components/tasks/TaskBoard";
import TaskDetails from "./components/tasks/TaskDetails";
import CreateTask from "./components/tasks/CreateTask";

// Assignment Components
import AssignProject from "./pages/AssignProject";
import MyProjects from "./pages/MyProjects";

// Submission Components
import CreateSubmission from "./components/submissions/CreateSubmission";
import SubmissionDetails from "./components/submissions/SubmissionDetails";

// Milestone Components
import MilestonesList from "./components/milestones/MilestonesList";
import MilestoneTracker from "./components/milestones/MilestoneTracker";

import MyTasksAndAssignments from "./components/student/MyTasksAndAssignments";
import ProgressDashboard from "./components/student/ProgressDashboard";

// Notification Components
import NotificationCenter from "./components/notifications/NotificationCenter";

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Public Route Component (redirect if already logged in)
function PublicRoute({ children }) {
  const { token } = useSelector((state) => state.auth);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Project Routes */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/create"
          element={
            <ProtectedRoute adminOnly>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/assign"
          element={
            <ProtectedRoute adminOnly>
              <AssignProject />
            </ProtectedRoute>
          }
        />

        {/* Group Routes */}
        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <GroupsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:id"
          element={
            <ProtectedRoute>
              <GroupDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/create"
          element={
            <ProtectedRoute adminOnly>
              <CreateGroup />
            </ProtectedRoute>
          }
        />

        {/* Task Routes */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute>
              <TaskDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/create"
          element={
            <ProtectedRoute>
              <CreateTask />
            </ProtectedRoute>
          }
        />

        {/* Assignment Routes */}
        <Route
          path="/my-projects"
          element={
            <ProtectedRoute>
              <MyProjects />
            </ProtectedRoute>
          }
        />

        {/* Submission Routes */}
        <Route
          path="/submissions/create"
          element={
            <ProtectedRoute>
              <CreateSubmission />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submissions/:id"
          element={
            <ProtectedRoute>
              <SubmissionDetails />
            </ProtectedRoute>
          }
        />

        {/* Student Work Route */}
        <Route
          path="/my-work"
          element={
            <ProtectedRoute>
              <MyTasksAndAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-progress"
          element={
            <ProtectedRoute>
              <ProgressDashboard />
            </ProtectedRoute>
          }
        />

        {/* Milestone Routes */}
        <Route
          path="/milestones"
          element={
            <ProtectedRoute>
              <MilestonesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/milestones"
          element={
            <ProtectedRoute>
              <MilestonesList />
            </ProtectedRoute>
          }
        />

        {/* Milestone Tracker Routes */}
        <Route
          path="/projects/:projectId/milestones/tracker"
          element={
            <ProtectedRoute>
              <MilestoneTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:groupId/milestones/tracker"
          element={
            <ProtectedRoute>
              <MilestoneTracker />
            </ProtectedRoute>
          }
        />

        {/* Notification Routes */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationCenter />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page not found</p>
                <a
                  href="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

// App.jsx file
