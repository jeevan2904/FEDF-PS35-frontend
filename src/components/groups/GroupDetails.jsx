import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchGroupById } from "../../app/groupSlice";
import { fetchTasks } from "../../app/taskSlice";
import { fetchSubmissions } from "../../app/submissionSlice";
import { fetchGroupAnalytics } from "../../app/analyticsSlice";

export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentGroup, status } = useSelector((state) => state.groups);
  const { tasks } = useSelector((state) => state.tasks);
  const { submissions } = useSelector((state) => state.submissions);
  const { groupAnalytics } = useSelector((state) => state.analytics);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(fetchGroupById(id));
    dispatch(fetchTasks({ groupId: id }));
    dispatch(fetchSubmissions({ groupId: id }));
    dispatch(fetchGroupAnalytics(id));
  }, [dispatch, id]);

  if (status === "loading" || !currentGroup) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading group details...</p>
        </div>
      </div>
    );
  }

  const leader = currentGroup.members.find((m) => m.role === "leader");
  const isLeader = leader?.userId._id === user.id;
  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/groups"
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
            Back to Groups
          </Link>
        </div>

        {/* Group Header Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {currentGroup.name}
                </h1>
                {currentGroup.description && (
                  <p className="text-purple-100">{currentGroup.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-purple-100">
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    {currentGroup.members.length} Members
                  </span>
                  {leader && (
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
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      Leader: {leader.userId.name}
                    </span>
                  )}
                </div>
              </div>
              {currentGroup.projectId && (
                <Link
                  to={`/projects/${currentGroup.projectId._id}`}
                  className="bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg transition flex items-center gap-2"
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  View Project
                </Link>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === "overview"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === "members"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Members
              </button>
              <button
                onClick={() => setActiveTab("tasks")}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === "tasks"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Tasks ({tasks.length})
              </button>
              <button
                onClick={() => setActiveTab("submissions")}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === "submissions"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Submissions ({submissions.length})
              </button>
              <button
                onClick={() => setActiveTab("milestones")}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === "milestones"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Milestones
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && groupAnalytics && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Group Statistics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium mb-1">
                    Total Tasks
                  </p>
                  <p className="text-3xl font-bold text-blue-700">
                    {groupAnalytics.stats.totalTasks}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium mb-1">
                    Completed
                  </p>
                  <p className="text-3xl font-bold text-green-700">
                    {groupAnalytics.stats.completedTasks}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium mb-1">
                    Submissions
                  </p>
                  <p className="text-3xl font-bold text-purple-700">
                    {groupAnalytics.stats.totalSubmissions}
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-yellow-600 font-medium mb-1">
                    Latest Grade
                  </p>
                  <p className="text-3xl font-bold text-yellow-700">
                    {groupAnalytics.stats.latestGrade
                      ? `${groupAnalytics.stats.latestGrade.score}/${groupAnalytics.stats.latestGrade.maxScore}`
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Member Contributions */}
              {groupAnalytics.memberContributions && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Member Contributions
                  </h3>
                  <div className="space-y-3">
                    {groupAnalytics.memberContributions.map((contribution) => (
                      <div
                        key={contribution.user._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-semibold">
                              {contribution.user.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {contribution.user.name}
                              {contribution.role === "leader" && (
                                <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  Leader
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              {contribution.tasksCompleted} /{" "}
                              {contribution.totalTasks} tasks completed
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            {contribution.completionRate.toFixed(0)}%
                          </p>
                          <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{
                                width: `${contribution.completionRate}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Members Tab */}
          {activeTab === "members" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Group Members ({currentGroup.members.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentGroup.members.map((member) => (
                  <div
                    key={member.userId._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-lg">
                          {member.userId.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.userId.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {member.userId.email}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Joined:{" "}
                          {new Date(member.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.role === "leader"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Group Tasks
                </h2>
                {(isAdmin || isLeader) && (
                  <Link
                    to={`/tasks/create?groupId=${id}`}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-sm flex items-center gap-2"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create Task
                  </Link>
                )}
              </div>

              {tasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No tasks yet</p>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <Link
                      key={task._id}
                      to={`/tasks/${task._id}`}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={task.status === "completed"}
                          readOnly
                          className="w-5 h-5"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {task.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            {task.assignedTo && (
                              <span>Assigned to: {task.assignedTo.name}</span>
                            )}
                            {task.deadline && (
                              <span>
                                Due:{" "}
                                {new Date(task.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : task.status === "in-progress"
                              ? "bg-blue-100 text-blue-800"
                              : task.status === "blocked"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submissions Tab */}
          {activeTab === "submissions" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Submissions
                </h2>
                <Link
                  to={`/submissions/create?groupId=${id}&projectId=${currentGroup.projectId?._id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm flex items-center gap-2"
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Upload Submission
                </Link>
              </div>

              {submissions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No submissions yet
                </p>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div
                      key={submission._id}
                      className="border rounded-lg p-4 hover:border-blue-300 transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            Version {submission.version}
                          </p>
                          <p className="text-sm text-gray-500">
                            Submitted:{" "}
                            {new Date(submission.submittedAt).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            By: {submission.submittedBy.name}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            submission.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : submission.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : submission.status === "under-review"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {submission.status}
                        </span>
                      </div>

                      {submission.description && (
                        <p className="text-gray-600 text-sm mb-3">
                          {submission.description}
                        </p>
                      )}

                      {submission.files && submission.files.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Files ({submission.files.length}):
                          </p>
                          <div className="space-y-1">
                            {submission.files.map((file, index) => (
                              <a
                                key={index}
                                href={`http://localhost:5000${file.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
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
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                {file.originalName}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {submission.grade && (
                        <div className="bg-green-50 rounded-lg p-3 mb-3">
                          <p className="text-sm font-medium text-green-900">
                            Grade: {submission.grade.score} /{" "}
                            {submission.grade.maxScore}
                          </p>
                          {submission.feedback && (
                            <p className="text-sm text-green-700 mt-1">
                              Feedback: {submission.feedback}
                            </p>
                          )}
                        </div>
                      )}

                      <Link
                        to={`/submissions/${submission._id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === "milestones" && currentGroup.projectId && (
            <div>
              <MilestoneTracker
                projectId={currentGroup.projectId._id}
                groupId={currentGroup._id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
