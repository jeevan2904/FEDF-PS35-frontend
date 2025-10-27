import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchStudentDashboard } from "../../app/analyticsSlice";
import { fetchUnreadCount } from "../../app/notificationSlice";
import { logout } from "../../app/authSlice";

export default function StudentDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboardData, status } = useSelector((state) => state.analytics);
  const { unreadCount } = useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.auth);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchStudentDashboard());
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
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
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
          {/* My Groups */}
          <div className="bg-white rounded-lg shadow p-6">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stats.myGroups}
            </p>
            <p className="text-sm text-gray-600">My Groups</p>
          </div>

          {/* Assigned Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stats.assignedTasks}
            </p>
            <p className="text-sm text-gray-600">Assigned Tasks</p>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stats.completedTasks}
            </p>
            <p className="text-sm text-gray-600">Completed Tasks</p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      stats.assignedTasks > 0
                        ? (stats.completedTasks / stats.assignedTasks) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stats.pendingTasks}
            </p>
            <p className="text-sm text-gray-600">Pending Tasks</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/groups"
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">My Groups</h3>
              <p className="text-sm text-gray-600">View your team groups</p>
            </Link>

            <Link
              to="/tasks"
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">My Tasks</h3>
              <p className="text-sm text-gray-600">Manage your tasks</p>
            </Link>

            <Link
              to="/my-work"
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-2 border-transparent hover:border-orange-500"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">My Work</h3>
              <p className="text-sm text-gray-600">All tasks & assignments</p>
            </Link>

            <Link
              to="/my-progress"
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-2 border-transparent hover:border-indigo-500"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">My Progress</h3>
              <p className="text-sm text-gray-600">Track your performance</p>
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
              <h3 className="font-semibold text-gray-900 mb-1">Projects</h3>
              <p className="text-sm text-gray-600">View all projects</p>
            </Link>
          </div>
        </div>

        {/* My Tasks and Groups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Upcoming Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Upcoming Tasks
              </h3>
              <Link
                to="/tasks"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {dashboardData.myTasks && dashboardData.myTasks.length > 0 ? (
                dashboardData.myTasks.map((task) => (
                  <Link
                    key={task._id}
                    to={`/tasks/${task._id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          task.priority === "urgent"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "high"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{task.projectId?.title}</span>
                      {task.deadline && (
                        <>
                          <span>•</span>
                          <span>
                            Due: {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No upcoming tasks
                </p>
              )}
            </div>
          </div>

          {/* My Groups */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">My Groups</h3>
              <Link
                to="/groups"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {dashboardData.myGroups && dashboardData.myGroups.length > 0 ? (
                dashboardData.myGroups.map((group) => (
                  <Link
                    key={group._id}
                    to={`/groups/${group._id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <p className="font-medium text-gray-900 mb-1">
                      {group.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{group.members.length} members</span>
                      {group.projectId && (
                        <>
                          <span>•</span>
                          <span>{group.projectId.title}</span>
                        </>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Not in any groups yet
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
