import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  fetchMilestones,
  updateMilestoneStatus,
} from "../../app/milestoneSlice";

export default function MilestonesList() {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { milestones, status } = useSelector((state) => state.milestones);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchMilestones({ projectId }));
    } else {
      dispatch(fetchMilestones());
    }
  }, [dispatch, projectId]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(updateMilestoneStatus({ id, status: newStatus })).unwrap();
    } catch (error) {
      alert("Failed to update milestone status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-gray-100 text-gray-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const isOverdue = (dueDate, status) => {
    return status !== "completed" && new Date(dueDate) < new Date();
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading milestones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Project Milestones
            </h1>
            <p className="text-gray-600 mt-1">
              {milestones.length} milestone{milestones.length !== 1 ? "s" : ""}
            </p>
          </div>
          {user.role === "admin" && (
            <Link
              to={`/milestones/create${
                projectId ? `?projectId=${projectId}` : ""
              }`}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Milestone
            </Link>
          )}
        </div>

        {/* Timeline View */}
        {milestones.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No milestones yet</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

            {/* Milestones */}
            <div className="space-y-8">
              {milestones.map((milestone, index) => {
                const overdue = isOverdue(milestone.dueDate, milestone.status);

                return (
                  <div key={milestone._id} className="relative pl-20">
                    {/* Timeline Dot */}
                    <div
                      className={`absolute left-6 w-5 h-5 rounded-full border-4 ${
                        milestone.status === "completed"
                          ? "bg-green-500 border-white"
                          : overdue
                          ? "bg-red-500 border-white"
                          : milestone.status === "in-progress"
                          ? "bg-blue-500 border-white"
                          : "bg-gray-300 border-white"
                      }`}
                      style={{ top: "24px" }}
                    ></div>

                    {/* Milestone Card */}
                    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {milestone.title}
                          </h3>
                          {milestone.description && (
                            <p className="text-gray-600 mb-3">
                              {milestone.description}
                            </p>
                          )}
                        </div>

                        <div className="ml-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              milestone.status
                            )}`}
                          >
                            {milestone.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
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
                          <span
                            className={
                              overdue ? "text-red-600 font-medium" : ""
                            }
                          >
                            Due:{" "}
                            {new Date(milestone.dueDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                            {overdue && " (Overdue)"}
                          </span>
                        </div>

                        {milestone.completedAt && (
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-green-600"
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
                            <span className="text-green-600">
                              Completed:{" "}
                              {new Date(
                                milestone.completedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {milestone.tasks && milestone.tasks.length > 0 && (
                          <div className="flex items-center gap-2">
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
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            <span>{milestone.tasks.length} tasks</span>
                          </div>
                        )}
                      </div>

                      {/* Status Change */}
                      {user.role === "admin" && (
                        <div className="flex items-center gap-3 pt-4 border-t">
                          <label className="text-sm font-medium text-gray-700">
                            Update Status:
                          </label>
                          <select
                            value={milestone.status}
                            onChange={(e) =>
                              handleStatusChange(milestone._id, e.target.value)
                            }
                            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
