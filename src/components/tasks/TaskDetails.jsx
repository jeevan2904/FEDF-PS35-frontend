import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTaskById,
  updateTask,
  updateTaskStatus,
  addTaskComment,
  deleteTask,
} from "../../app/taskSlice";
import { fetchComments, createComment } from "../../app/commentSlice";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentTask, status } = useSelector((state) => state.tasks);
  const { comments } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);

  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(null);

  useEffect(() => {
    dispatch(fetchTaskById(id));
    dispatch(fetchComments({ relatedModel: "Task", relatedId: id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentTask) {
      setEditedTask(currentTask);
    }
  }, [currentTask]);

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(updateTaskStatus({ id, status: newStatus })).unwrap();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await dispatch(
        createComment({
          content: newComment,
          relatedTo: { model: "Task", id },
        })
      ).unwrap();

      setNewComment("");
      dispatch(fetchComments({ relatedModel: "Task", relatedId: id }));
    } catch (error) {
      alert("Failed to add comment");
    }
  };

  const handleUpdate = async () => {
    try {
      await dispatch(updateTask({ id, data: editedTask })).unwrap();
      setIsEditing(false);
      alert("Task updated successfully!");
    } catch (error) {
      alert("Failed to update task");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTask(id)).unwrap();
        navigate("/tasks");
      } catch (error) {
        alert("Failed to delete task");
      }
    }
  };

  if (status === "loading" || !currentTask) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  const canEdit =
    user.role === "admin" ||
    currentTask.createdBy._id === user.id ||
    currentTask.assignedTo?._id === user.id;

  const isOverdue =
    currentTask.deadline &&
    new Date(currentTask.deadline) < new Date() &&
    currentTask.status !== "completed";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/tasks"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Tasks
          </Link>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTask.title}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, title: e.target.value })
                    }
                    className="text-3xl font-bold text-white bg-transparent border-b-2 border-white/50 focus:outline-none focus:border-white w-full mb-2"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {currentTask.title}
                  </h1>
                )}
                <div className="flex items-center gap-3 text-indigo-100 text-sm">
                  <span>
                    Created:{" "}
                    {new Date(currentTask.createdAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>By: {currentTask.createdBy.name}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {canEdit && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedTask(currentTask);
                        }}
                        className="bg-indigo-500 text-white hover:bg-indigo-600 px-4 py-2 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition flex items-center gap-2"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Status and Priority */}
            <div className="flex items-center gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={currentTask.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={!canEdit}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                {isEditing ? (
                  <select
                    value={editedTask.priority}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, priority: e.target.value })
                    }
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                ) : (
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      currentTask.priority === "urgent"
                        ? "bg-red-100 text-red-800"
                        : currentTask.priority === "high"
                        ? "bg-orange-100 text-orange-800"
                        : currentTask.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {currentTask.priority}
                  </span>
                )}
              </div>

              {isOverdue && (
                <div className="ml-auto">
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
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
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Overdue
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Description
              </h2>
              {isEditing ? (
                <textarea
                  value={editedTask.description || ""}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  rows="5"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {currentTask.description || "No description provided"}
                </p>
              )}
            </div>

            {/* Task Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Assigned To */}
              {currentTask.assignedTo && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <h3 className="font-semibold text-gray-900">Assigned To</h3>
                  </div>
                  <p className="text-gray-700">{currentTask.assignedTo.name}</p>
                  <p className="text-sm text-gray-500">
                    {currentTask.assignedTo.email}
                  </p>
                </div>
              )}

              {/* Deadline */}
              {currentTask.deadline && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 text-gray-600"
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
                    <h3 className="font-semibold text-gray-900">Deadline</h3>
                  </div>
                  <p
                    className={`text-lg ${
                      isOverdue ? "text-red-600 font-semibold" : "text-gray-700"
                    }`}
                  >
                    {new Date(currentTask.deadline).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              )}

              {/* Project */}
              {currentTask.projectId && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 text-gray-600"
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
                    <h3 className="font-semibold text-gray-900">Project</h3>
                  </div>
                  <Link
                    to={`/projects/${currentTask.projectId._id}`}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    {currentTask.projectId.title}
                  </Link>
                </div>
              )}

              {/* Group */}
              {currentTask.groupId && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 text-gray-600"
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
                    <h3 className="font-semibold text-gray-900">Group</h3>
                  </div>
                  <Link
                    to={`/groups/${currentTask.groupId._id}`}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    {currentTask.groupId.name}
                  </Link>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                Comments ({comments.length})
              </h2>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  rows="3"
                  placeholder="Add a comment..."
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition disabled:bg-gray-400"
                >
                  Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No comments yet
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-indigo-600 font-semibold">
                            {comment.author.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {comment.author.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                            {comment.edited && (
                              <span className="text-xs text-gray-400">
                                (edited)
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
