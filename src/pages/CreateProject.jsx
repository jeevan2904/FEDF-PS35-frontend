import { useState } from "react";
import api from "../api/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Only admins should access
  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Only administrators can create projects.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    if (!title.trim()) {
      setError("Project title is required");
      return false;
    }
    if (title.length > 100) {
      setError("Project title must be 100 characters or less");
      return false;
    }
    if (!description.trim()) {
      setError("Project description is required");
      return false;
    }
    if (description.length > 1000) {
      setError("Description must be 1000 characters or less");
      return false;
    }
    if (!startDate) {
      setError("Start date is required");
      return false;
    }
    if (!dueDate) {
      setError("Due date is required");
      return false;
    }
    if (new Date(dueDate) < new Date(startDate)) {
      setError("Due date must be after start date");
      return false;
    }
    if (new Date(startDate) < new Date().setHours(0, 0, 0, 0)) {
      setError("Start date cannot be in the past");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post("/projects/", { title, description, startDate, dueDate });
      alert("Project created successfully!");
      navigate("/projects");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error creating project. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
            disabled={loading}
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Project
          </h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to create a new project
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-8"
        >
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Project Title */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              maxLength={100}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {title.length}/100 characters
            </p>
          </div>

          {/* Project Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Project Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32"
              placeholder="Provide a detailed description of the project"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              maxLength={1000}
              required
              rows={6}
            />
            <p className="text-sm text-gray-500 mt-1">
              {description.length}/1000 characters
            </p>
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                id="startDate"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={loading}
                min={getTodayDate()}
                required
              />
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                id="dueDate"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={loading}
                min={startDate || getTodayDate()}
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">
                Tips for creating a project:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Use a clear, descriptive title that summarizes the project
                </li>
                <li>
                  • Include specific goals and requirements in the description
                </li>
                <li>
                  • Set realistic deadlines that give students enough time to
                  complete the work
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
