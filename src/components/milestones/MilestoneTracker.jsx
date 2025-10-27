import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchMilestones } from "../../app/milestoneSlice";
import { fetchTasks } from "../../app/taskSlice";

export default function MilestoneTracker() {
  const { projectId, groupId } = useParams();
  const dispatch = useDispatch();

  const { milestones } = useSelector((state) => state.milestones);
  const { tasks } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchMilestones({ projectId }));
      dispatch(fetchTasks({ projectId }));
    }
  }, [dispatch, projectId]);

  const calculateMilestoneProgress = (milestone) => {
    if (!milestone.tasks || milestone.tasks.length === 0) return 0;

    const completedTasks = tasks.filter(
      (task) =>
        milestone.tasks.includes(task._id) && task.status === "completed"
    ).length;

    return (completedTasks / milestone.tasks.length) * 100;
  };

  const calculateOverallProgress = () => {
    if (milestones.length === 0) return 0;

    const completedMilestones = milestones.filter(
      (m) => m.status === "completed"
    ).length;
    return (completedMilestones / milestones.length) * 100;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Milestone Tracker
          </h2>
          <p className="text-gray-600 mt-1">
            Track project milestones and progress
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Overall Progress</p>
          <p className="text-3xl font-bold text-blue-600">
            {calculateOverallProgress().toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${calculateOverallProgress()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>
            {milestones.filter((m) => m.status === "completed").length}{" "}
            completed
          </span>
          <span>{milestones.length} total milestones</span>
        </div>
      </div>

      {/* Milestones Timeline */}
      {milestones.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No milestones created yet
        </p>
      ) : (
        <div className="space-y-6">
          {milestones.map((milestone, index) => {
            const progress = calculateMilestoneProgress(milestone);
            const isOverdue =
              milestone.dueDate &&
              new Date(milestone.dueDate) < new Date() &&
              milestone.status !== "completed";

            return (
              <div key={milestone._id} className="relative">
                {/* Milestone Card */}
                <div
                  className={`border-l-4 rounded-lg p-4 ${
                    milestone.status === "completed"
                      ? "border-green-500 bg-green-50"
                      : isOverdue
                      ? "border-red-500 bg-red-50"
                      : milestone.status === "in-progress"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {index + 1}. {milestone.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            milestone.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : milestone.status === "in-progress"
                              ? "bg-blue-100 text-blue-800"
                              : isOverdue
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {milestone.status}
                        </span>
                      </div>

                      {milestone.description && (
                        <p className="text-gray-700 text-sm mb-3">
                          {milestone.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Due:{" "}
                          {new Date(milestone.dueDate).toLocaleDateString()}
                          {isOverdue && (
                            <span className="text-red-600 font-medium ml-1">
                              (Overdue)
                            </span>
                          )}
                        </span>

                        {milestone.tasks && milestone.tasks.length > 0 && (
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
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            {milestone.tasks.length} tasks
                          </span>
                        )}

                        {milestone.completedAt && (
                          <span className="flex items-center gap-1 text-green-600">
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Completed:{" "}
                            {new Date(
                              milestone.completedAt
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {milestone.tasks && milestone.tasks.length > 0 && (
                        <div>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Task Progress</span>
                            <span>{progress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                milestone.status === "completed"
                                  ? "bg-green-600"
                                  : "bg-blue-600"
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status Icon */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ml-4 ${
                        milestone.status === "completed"
                          ? "bg-green-500"
                          : milestone.status === "in-progress"
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    >
                      {milestone.status === "completed" ? (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span className="text-white font-bold">
                          {index + 1}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Connection Line to Next Milestone */}
                {index < milestones.length - 1 && (
                  <div className="flex justify-center my-2">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
