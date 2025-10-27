// components/dashboard/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchAdminDashboard } from "../../app/analyticsSlice";
import { fetchUnreadCount } from "../../app/notificationSlice";
import { logout } from "../../app/authSlice";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboardData, status } = useSelector((state) => state.analytics);
  const { unreadCount } = useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.auth);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  if (status === "loading" || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData.stats;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/notifications"
                className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                Notifications
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Projects */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalProjects}
            </p>
            <p className="text-sm text-gray-600">Total Projects</p>
            <p className="text-xs text-green-600 mt-2">
              {stats.activeProjects} active
            </p>
          </div>

          {/* Total Groups */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalGroups}
            </p>
            <p className="text-sm text-gray-600">Total Groups</p>
            <p className="text-xs text-green-600 mt-2">
              {stats.activeGroups} active
            </p>
          </div>

          {/* Total Students */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalStudents}
            </p>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>

          {/* Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalTasks}
            </p>
            <p className="text-sm text-gray-600">Total Tasks</p>
            <p className="text-xs text-green-600 mt-2">
              {stats.completedTasks} completed
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Project Status Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Projects by Status
            </h3>
            <div className="space-y-3">
              {dashboardData.projectsByStatus &&
                dashboardData.projectsByStatus.map((item) => (
                  <div key={item._id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 capitalize">
                        {item._id || "Unknown"}
                      </span>
                      <span className="font-medium text-gray-900">
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(item.count / stats.totalProjects) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Task Status Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tasks by Status
            </h3>
            <div className="space-y-3">
              {dashboardData.tasksByStatus &&
                dashboardData.tasksByStatus.map((item) => {
                  const color =
                    {
                      todo: "bg-gray-600",
                      "in-progress": "bg-blue-600",
                      completed: "bg-green-600",
                      blocked: "bg-red-600",
                    }[item._id] || "bg-gray-600";

                  return (
                    <div key={item._id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 capitalize">
                          {item._id.replace("-", " ")}
                        </span>
                        <span className="font-medium text-gray-900">
                          {item.count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${color} h-2 rounded-full transition-all duration-300`}
                          style={{
                            width: `${(item.count / stats.totalTasks) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/projects/create"
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-2 border-transparent hover:border-blue-500"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Create Project
              </h3>
              <p className="text-sm text-gray-600">Start a new project</p>
            </Link>

            <Link
              to="/groups/create"
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-2 border-transparent hover:border-purple-500"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Create Group</h3>
              <p className="text-sm text-gray-600">Form a new team</p>
            </Link>

            <Link
              to="/projects"
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-2 border-transparent hover:border-green-500"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                View Projects
              </h3>
              <p className="text-sm text-gray-600">Manage all projects</p>
            </Link>

            <Link
              to="/submissions"
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-2 border-transparent hover:border-yellow-500"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Review Submissions
              </h3>
              <p className="text-sm text-gray-600">Grade student work</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Projects
              </h3>
              <Link
                to="/projects"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {dashboardData.recentProjects &&
              dashboardData.recentProjects.length > 0 ? (
                dashboardData.recentProjects.map((project) => (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <p className="font-medium text-gray-900 mb-1">
                      {project.title}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>By {project.createdBy?.name}</span>
                      <span>•</span>
                      <span>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No recent projects
                </p>
              )}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Submissions
              </h3>
              <Link
                to="/submissions"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {dashboardData.recentSubmissions &&
              dashboardData.recentSubmissions.length > 0 ? (
                dashboardData.recentSubmissions.map((submission) => (
                  <Link
                    key={submission._id}
                    to={`/submissions/${submission._id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-gray-900">
                        {submission.projectId?.title}
                      </p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          submission.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : submission.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {submission.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{submission.groupId?.name}</span>
                      <span>•</span>
                      <span>
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No recent submissions
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal - ADD AT THE END */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
