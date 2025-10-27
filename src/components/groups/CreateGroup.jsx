import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createGroup } from "../../app/groupSlice";
import { fetchProjects } from "../../app/projectSlice";
import api from "../../api/axios";

export default function CreateGroup() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [leaderId, setLeaderId] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects } = useSelector((state) => state.projects);
  const { status, error } = useSelector((state) => state.groups);

  useEffect(() => {
    dispatch(fetchProjects());
    fetchStudents();
  }, [dispatch]);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/auth/students");
      setStudents(res.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const handleStudentToggle = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
      if (leaderId === studentId) setLeaderId("");
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedStudents.length === 0) {
      alert("Please select at least one student");
      return;
    }

    if (!leaderId) {
      alert("Please select a group leader");
      return;
    }

    const members = selectedStudents.map((userId) => ({
      userId,
      role: userId === leaderId ? "leader" : "member",
    }));

    try {
      await dispatch(
        createGroup({
          name,
          description,
          projectId: projectId || undefined,
          members,
        })
      ).unwrap();

      alert("Group created successfully!");
      navigate("/groups");
    } catch (err) {
      console.error("Failed to create group:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Create New Group
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter group name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="3"
                placeholder="Enter group description"
              />
            </div>

            {/* Project Assignment (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Project (Optional)
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">No Project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Students */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Group Members *
              </label>
              <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                {students.length === 0 ? (
                  <p className="text-gray-500">No students available</p>
                ) : (
                  <div className="space-y-2">
                    {students.map((student) => (
                      <div
                        key={student._id}
                        className={`flex items-center justify-between p-3 rounded-lg border-2 transition ${
                          selectedStudents.includes(student._id)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student._id)}
                            onChange={() => handleStudentToggle(student._id)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {student.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {student.email}
                            </p>
                          </div>
                        </div>
                        {selectedStudents.includes(student._id) && (
                          <button
                            type="button"
                            onClick={() => setLeaderId(student._id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                              leaderId === student._id
                                ? "bg-purple-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {leaderId === student._id
                              ? "Leader"
                              : "Set as Leader"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Selected: {selectedStudents.length} student(s)
                {leaderId && " • Leader selected"}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/groups")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:bg-blue-400"
              >
                {status === "loading" ? "Creating..." : "Create Group"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
