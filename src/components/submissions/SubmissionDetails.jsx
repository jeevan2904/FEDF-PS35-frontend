import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSubmissionById,
  gradeSubmission,
  updateSubmissionStatus,
} from "../../app/submissionSlice";

export default function SubmissionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentSubmission, status } = useSelector(
    (state) => state.submissions
  );
  const { user } = useSelector((state) => state.auth);

  const [showGradeForm, setShowGradeForm] = useState(false);
  const [gradeData, setGradeData] = useState({
    score: "",
    maxScore: 100,
    feedback: "",
    status: "approved",
    breakdown: [],
  });

  useEffect(() => {
    dispatch(fetchSubmissionById(id));
  }, [dispatch, id]);

  const handleGradeSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        gradeSubmission({
          id,
          gradeData: {
            score: parseFloat(gradeData.score),
            maxScore: parseFloat(gradeData.maxScore),
            feedback: gradeData.feedback,
            status: gradeData.status,
            breakdown: gradeData.breakdown.filter((b) => b.criteria && b.score),
          },
        })
      ).unwrap();

      alert("Submission graded successfully!");
      setShowGradeForm(false);
      dispatch(fetchSubmissionById(id));
    } catch (error) {
      alert("Failed to grade submission");
    }
  };

  const addCriteria = () => {
    setGradeData({
      ...gradeData,
      breakdown: [
        ...gradeData.breakdown,
        { criteria: "", score: "", maxScore: 10, comments: "" },
      ],
    });
  };

  const updateCriteria = (index, field, value) => {
    const newBreakdown = [...gradeData.breakdown];
    newBreakdown[index][field] = value;
    setGradeData({ ...gradeData, breakdown: newBreakdown });
  };

  const removeCriteria = (index) => {
    const newBreakdown = gradeData.breakdown.filter((_, i) => i !== index);
    setGradeData({ ...gradeData, breakdown: newBreakdown });
  };

  if (status === "loading" || !currentSubmission) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submission details...</p>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const isGroupMember = currentSubmission.groupId?.members?.some(
    (m) => m.userId._id === user.id
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={`/groups/${currentSubmission.groupId._id}`}
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
            Back to Group
          </Link>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Submission - Version {currentSubmission.version}
                </h1>
                <div className="flex items-center gap-4 text-blue-100">
                  <span>Project: {currentSubmission.projectId?.title}</span>
                  <span>•</span>
                  <span>Group: {currentSubmission.groupId?.name}</span>
                </div>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  currentSubmission.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : currentSubmission.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : currentSubmission.status === "under-review"
                    ? "bg-yellow-100 text-yellow-800"
                    : currentSubmission.status === "resubmit"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {currentSubmission.status}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Submission Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Submitted By</p>
                <p className="font-medium text-gray-900">
                  {currentSubmission.submittedBy.name}
                </p>
                <p className="text-sm text-gray-500">
                  {currentSubmission.submittedBy.email}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Submitted On</p>
                <p className="font-medium text-gray-900">
                  {new Date(currentSubmission.submittedAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(currentSubmission.submittedAt).toLocaleTimeString()}
                </p>
              </div>

              {currentSubmission.reviewedBy && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Reviewed By</p>
                  <p className="font-medium text-gray-900">
                    {currentSubmission.reviewedBy.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(
                      currentSubmission.reviewedAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            {currentSubmission.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {currentSubmission.description}
                </p>
              </div>
            )}

            {/* Files */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Submitted Files ({currentSubmission.files.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSubmission.files.map((file, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:border-blue-300 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">
                            {file.originalName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(file.uploadedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`http://localhost:5000${file.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition text-sm flex items-center gap-2"
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
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade Display */}
            {currentSubmission.grade && (
              <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  Grade
                </h2>

                <div className="flex items-center gap-6 mb-4">
                  <div>
                    <p className="text-5xl font-bold text-green-600">
                      {currentSubmission.grade.score}
                    </p>
                    <p className="text-gray-600">
                      out of {currentSubmission.grade.maxScore}
                    </p>
                  </div>

                  <div className="flex-1">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-green-600">
                            {(
                              (currentSubmission.grade.score /
                                currentSubmission.grade.maxScore) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-green-200">
                        <div
                          style={{
                            width: `${
                              (currentSubmission.grade.score /
                                currentSubmission.grade.maxScore) *
                              100
                            }%`,
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600 transition-all duration-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grade Breakdown */}
                {currentSubmission.grade.breakdown &&
                  currentSubmission.grade.breakdown.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Grade Breakdown:
                      </h3>
                      <div className="space-y-3">
                        {currentSubmission.grade.breakdown.map(
                          (item, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-lg p-3 border border-green-200"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-gray-900">
                                  {item.criteria}
                                </span>
                                <span className="text-green-600 font-semibold">
                                  {item.score} / {item.maxScore}
                                </span>
                              </div>
                              {item.comments && (
                                <p className="text-sm text-gray-600">
                                  {item.comments}
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Feedback */}
                {currentSubmission.feedback && (
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Feedback:
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {currentSubmission.feedback}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Admin Grading Section */}
            {isAdmin && !showGradeForm && !currentSubmission.grade && (
              <div className="mb-8">
                <button
                  onClick={() => setShowGradeForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition flex items-center gap-2"
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
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  Grade This Submission
                </button>
              </div>
            )}

            {/* Grading Form */}
            {isAdmin && showGradeForm && (
              <div className="mb-8 border rounded-lg p-6 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Grade Submission
                </h2>

                <form onSubmit={handleGradeSubmit} className="space-y-4">
                  {/* Score */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Score *
                      </label>
                      <input
                        type="number"
                        value={gradeData.score}
                        onChange={(e) =>
                          setGradeData({ ...gradeData, score: e.target.value })
                        }
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        min="0"
                        max={gradeData.maxScore}
                        step="0.1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Score *
                      </label>
                      <input
                        type="number"
                        value={gradeData.maxScore}
                        onChange={(e) =>
                          setGradeData({
                            ...gradeData,
                            maxScore: e.target.value,
                          })
                        }
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  {/* Grade Breakdown */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Grade Breakdown (Optional)
                      </label>
                      <button
                        type="button"
                        onClick={addCriteria}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        + Add Criteria
                      </button>
                    </div>

                    {gradeData.breakdown.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg border mb-3"
                      >
                        <div className="flex gap-3 mb-2">
                          <input
                            type="text"
                            placeholder="Criteria (e.g., Code Quality)"
                            value={item.criteria}
                            onChange={(e) =>
                              updateCriteria(index, "criteria", e.target.value)
                            }
                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                          />
                          <input
                            type="number"
                            placeholder="Score"
                            value={item.score}
                            onChange={(e) =>
                              updateCriteria(index, "score", e.target.value)
                            }
                            className="w-24 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            min="0"
                            step="0.1"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={item.maxScore}
                            onChange={(e) =>
                              updateCriteria(index, "maxScore", e.target.value)
                            }
                            className="w-24 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            min="1"
                          />
                          <button
                            type="button"
                            onClick={() => removeCriteria(index)}
                            className="text-red-600 hover:text-red-700"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        <textarea
                          placeholder="Comments (optional)"
                          value={item.comments}
                          onChange={(e) =>
                            updateCriteria(index, "comments", e.target.value)
                          }
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                          rows="2"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Feedback */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback
                    </label>
                    <textarea
                      value={gradeData.feedback}
                      onChange={(e) =>
                        setGradeData({ ...gradeData, feedback: e.target.value })
                      }
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      rows="4"
                      placeholder="Provide feedback to the students..."
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={gradeData.status}
                      onChange={(e) =>
                        setGradeData({ ...gradeData, status: e.target.value })
                      }
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="resubmit">Needs Resubmission</option>
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowGradeForm(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
                    >
                      Submit Grade
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
