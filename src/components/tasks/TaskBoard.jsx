import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchTasks, updateTaskStatus } from "../../app/taskSlice";

export default function TaskBoard() {
  const dispatch = useDispatch();
  const { tasks, status } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  //   const [filterProject, setFilterProject] = useState("");
  //   const [filterGroup, setFilterGroup] = useState("");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await dispatch(
        updateTaskStatus({ id: taskId, status: newStatus })
      ).unwrap();
    } catch (error) {
      alert("Failed to update task status");
    }
  };

  const columns = [
    { id: "todo", title: "To Do", color: "gray" },
    { id: "in-progress", title: "In Progress", color: "blue" },
    { id: "completed", title: "Completed", color: "green" },
    { id: "blocked", title: "Blocked", color: "red" },
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
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

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
            <p className="text-gray-600 mt-1">{tasks.length} total tasks</p>
          </div>
          <div className="flex gap-3">
            {(user.role === "admin" || user.role === "leader") && (
              <Link
                to="/tasks/create"
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
                Create Task
              </Link>
            )}
            <Link
              to="/dashboard"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div key={column.id} className="bg-white rounded-lg shadow">
                {/* Column Header */}
                <div
                  className={`bg-${column.color}-50 px-4 py-3 rounded-t-lg border-b-2 border-${column.color}-200`}
                >
                  <h3
                    className={`font-semibold text-${column.color}-900 flex items-center justify-between`}
                  >
                    {column.title}
                    <span
                      className={`bg-${column.color}-200 text-${column.color}-800 px-2 py-0.5 rounded-full text-xs`}
                    >
                      {columnTasks.length}
                    </span>
                  </h3>
                </div>

                {/* Tasks */}
                <div className="p-3 space-y-3 min-h-[500px] max-h-[calc(100vh-300px)] overflow-y-auto">
                  {columnTasks.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-8">
                      No tasks
                    </p>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task._id}
                        className={`bg-white border rounded-lg p-3 hover:shadow-md transition cursor-pointer ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        <Link to={`/tasks/${task._id}`}>
                          <h4 className="font-medium text-gray-900 mb-2">
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            {task.assignedTo && (
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-3 h-3"
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
                                {task.assignedTo.name}
                              </span>
                            )}

                            {task.deadline && (
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-3 h-3"
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
                                {new Date(task.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                task.priority === "urgent"
                                  ? "bg-red-100 text-red-800"
                                  : task.priority === "high"
                                  ? "bg-orange-100 text-orange-800"
                                  : task.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </Link>

                        {/* Quick Status Change */}
                        <div className="mt-3 pt-3 border-t">
                          <select
                            value={task.status}
                            onChange={(e) =>
                              handleStatusChange(task._id, e.target.value)
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="w-full text-xs p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                          >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
