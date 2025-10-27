import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAssignments,
  updateAssignmentStatus,
} from "../app/assignmentSlice";
import { Link } from "react-router-dom";

export default function MyProjects() {
  const dispatch = useDispatch();
  const { assignments, status } = useSelector((state) => state.assignments);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  const handleStatusChange = async (assignmentId, newStatus) => {
    try {
      await dispatch(
        updateAssignmentStatus({
          id: assignmentId,
          status: newStatus,
        })
      ).unwrap();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      "in-progress": "bg-blue-100 text-blue-800",
      submitted: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading your projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-600 mt-1">
              {assignments.length} project{assignments.length !== 1 ? "s" : ""}{" "}
              assigned
            </p>
          </div>
          <Link
            to="/dashboard"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
          >
            Back to Dashboard
          </Link>
        </div>

        {assignments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No projects assigned yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {assignment.projectId?.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      assignment.status
                    )}`}
                  >
                    {assignment.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {assignment.projectId?.description}
                </p>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <p>
                    <strong>Deadline:</strong>{" "}
                    {assignment.projectId?.deadline
                      ? new Date(
                          assignment.projectId.deadline
                        ).toLocaleDateString()
                      : "No deadline"}
                  </p>
                  <p>
                    <strong>Assigned:</strong>{" "}
                    {new Date(assignment.assignedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <select
                    value={assignment.status}
                    onChange={(e) =>
                      handleStatusChange(assignment._id, e.target.value)
                    }
                    className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                  </select>
                  <Link
                    to={`/projects/${assignment.projectId?._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
