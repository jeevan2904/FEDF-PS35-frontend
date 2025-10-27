import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../app/taskSlice";
import { fetchAssignments } from "../../app/assignmentSlice";
import { fetchGroups } from "../../app/groupSlice";
import { Link } from "react-router-dom";

export default function ProgressDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks } = useSelector((state) => state.tasks);
  const { assignments } = useSelector((state) => state.assignments);
  const { groups } = useSelector((state) => state.groups);

  useEffect(() => {
    dispatch(fetchTasks({ assignedTo: user.id }));
    dispatch(fetchAssignments());
    dispatch(fetchGroups());
  }, [dispatch, user.id]);

  // Calculate statistics
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;
  const taskCompletionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const completedAssignments = assignments.filter(
    (a) => a.status === "submitted"
  ).length;
  const totalAssignments = assignments.length;
  const assignmentCompletionRate =
    totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

  const overallCompletionRate =
    ((completedTasks + completedAssignments) /
      (totalTasks + totalAssignments)) *
      100 || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>
            <p className="text-gray-600 mt-1">Track your overall performance</p>
          </div>
          <Link
            to="/dashboard"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Overall Progress Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Overall Completion Rate</h2>
          <div className="flex items-center gap-6">
            <div className="text-6xl font-bold">
              {overallCompletionRate.toFixed(0)}%
            </div>
            <div className="flex-1">
              <div className="w-full bg-white/30 rounded-full h-4 mb-2">
                <div
                  className="bg-white h-4 rounded-full transition-all duration-500"
                  style={{ width: `${overallCompletionRate}%` }}
                ></div>
              </div>
              <p className="text-blue-100">
                {completedTasks + completedAssignments} of{" "}
                {totalTasks + totalAssignments} items completed
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tasks Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Tasks</h3>
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {taskCompletionRate.toFixed(0)}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${taskCompletionRate}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {completedTasks} / {totalTasks} completed
            </p>
          </div>

          {/* Assignments Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Assignments</h3>
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {assignmentCompletionRate.toFixed(0)}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${assignmentCompletionRate}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {completedAssignments} / {totalAssignments} submitted
            </p>
          </div>

          {/* Groups */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Groups</h3>
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {groups.length}
            </p>
            <p className="text-sm text-gray-600">Active groups</p>
          </div>
        </div>

        {/* Task Breakdown by Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Task Status Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">
                {tasks.filter((t) => t.status === "todo").length}
              </p>
              <p className="text-sm text-gray-600 mt-1">To Do</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {tasks.filter((t) => t.status === "in-progress").length}
              </p>
              <p className="text-sm text-gray-600 mt-1">In Progress</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {tasks.filter((t) => t.status === "completed").length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Completed</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {tasks.filter((t) => t.status === "blocked").length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Blocked</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/my-work"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex items-center justify-between border-2 border-transparent hover:border-blue-500"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                View All My Work
              </h3>
              <p className="text-sm text-gray-600">
                See all tasks and assignments
              </p>
            </div>
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <Link
            to="/groups"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex items-center justify-between border-2 border-transparent hover:border-purple-500"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                My Groups
              </h3>
              <p className="text-sm text-gray-600">
                Collaborate with your team
              </p>
            </div>
            <svg
              className="w-8 h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
