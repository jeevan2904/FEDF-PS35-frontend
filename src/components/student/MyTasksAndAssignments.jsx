import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchTasks, updateTaskStatus } from "../../app/taskSlice";
import {
  fetchAssignments,
  updateAssignmentStatus,
} from "../../app/assignmentSlice";

export default function MyTasksAndAssignments() {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const { assignments } = useSelector((state) => state.assignments);
  const { user } = useSelector((state) => state.auth);

  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchTasks({ assignedTo: user.id })).unwrap(),
          dispatch(fetchAssignments()).unwrap(),
        ]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, user.id]);

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await dispatch(
        updateTaskStatus({ id: taskId, status: newStatus })
      ).unwrap();
    } catch (error) {
      alert("Failed to update task status");
    }
  };

  const handleAssignmentStatusChange = async (assignmentId, newStatus) => {
    try {
      await dispatch(
        updateAssignmentStatus({ id: assignmentId, status: newStatus })
      ).unwrap();
    } catch (error) {
      alert("Failed to update assignment status");
    }
  };

  // Combine tasks and assignments into one list
  const allItems = [
    ...tasks.map((task) => ({
      id: task._id,
      type: "task",
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      deadline: task.deadline,
      projectTitle: task.projectId?.title,
      projectId: task.projectId?._id,
      groupName: task.groupId?.name,
      groupId: task.groupId?._id,
      createdAt: task.createdAt,
    })),
    ...assignments.map((assignment) => ({
      id: assignment._id,
      type: "assignment",
      title: assignment.projectId?.title,
      description: assignment.projectId?.description,
      status: assignment.status,
      priority: "medium",
      deadline: assignment.projectId?.deadline,
      projectTitle: assignment.projectId?.title,
      projectId: assignment.projectId?._id,
      assignedAt: assignment.assignedAt,
      createdAt: assignment.assignedAt,
    })),
  ];

  // Filter items
  const filteredItems = allItems.filter((item) => {
    if (filter === "all") return true;
    if (filter === "tasks") return item.type === "task";
    if (filter === "assignments") return item.type === "assignment";
    if (filter === "pending") return ["pending", "todo"].includes(item.status);
    if (filter === "in-progress") return item.status === "in-progress";
    if (filter === "completed")
      return ["completed", "submitted"].includes(item.status);
    return true;
  });

  // Sort by deadline
  const sortedItems = filteredItems.sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const getStatusColor = (status) => {
    const colors = {
      todo: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      submitted: "bg-purple-100 text-purple-800",
      blocked: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: "border-l-4 border-red-500",
      high: "border-l-4 border-orange-500",
      medium: "border-l-4 border-yellow-500",
      low: "border-l-4 border-green-500",
    };
    return colors[priority] || "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your work...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Tasks & Assignments
            </h1>
            <p className="text-gray-600 mt-1">
              {allItems.length} total items • {sortedItems.length} showing
            </p>
          </div>
          <Link
            to="/dashboard"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({allItems.length})
            </button>
            <button
              onClick={() => setFilter("tasks")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "tasks"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setFilter("assignments")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "assignments"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Assignments ({assignments.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "pending"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("in-progress")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "in-progress"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Items List */}
        {sortedItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No items found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedItems.map((item) => {
              const isOverdue =
                item.deadline &&
                new Date(item.deadline) < new Date() &&
                !["completed", "submitted"].includes(item.status);

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className={`bg-white rounded-lg shadow hover:shadow-md transition p-6 ${getPriorityColor(
                    item.priority
                  )}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            item.type === "task"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {item.type === "task" ? "Task" : "Assignment"}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                        {item.priority && item.type === "task" && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              item.priority === "urgent"
                                ? "bg-red-100 text-red-800"
                                : item.priority === "high"
                                ? "bg-orange-100 text-orange-800"
                                : item.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.priority}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {item.projectTitle && (
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
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
                            Project: {item.projectTitle}
                          </span>
                        )}

                        {item.groupName && (
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
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
                            Group: {item.groupName}
                          </span>
                        )}

                        {item.deadline && (
                          <span
                            className={`flex items-center gap-1 ${
                              isOverdue ? "text-red-600 font-medium" : ""
                            }`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Due: {new Date(item.deadline).toLocaleDateString()}
                            {isOverdue && " (Overdue!)"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                    {/* Status Update */}
                    <div className="flex-1">
                      <label className="text-xs text-gray-600 block mb-1">
                        Update Status:
                      </label>
                      <select
                        value={item.status}
                        onChange={(e) => {
                          if (item.type === "task") {
                            handleTaskStatusChange(item.id, e.target.value);
                          } else {
                            handleAssignmentStatusChange(
                              item.id,
                              e.target.value
                            );
                          }
                        }}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      >
                        {item.type === "task" ? (
                          <>
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="blocked">Blocked</option>
                          </>
                        ) : (
                          <>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="submitted">Submitted</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* View Details Button */}
                    {item.type === "task" ? (
                      <Link
                        to={`/tasks/${item.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm self-end"
                      >
                        View Details
                      </Link>
                    ) : (
                      <Link
                        to={`/projects/${item.projectId}`}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition text-sm self-end"
                      >
                        View Project
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
