import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createTask } from "../../app/taskSlice";
import { fetchProjects } from "../../app/projectSlice";
import { fetchGroups } from "../../app/groupSlice";
import api from "../../api/axios";

export default function CreateTask() {
  const [searchParams] = useSearchParams();
  const preselectedGroupId = searchParams.get("groupId");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [groupId, setGroupId] = useState(preselectedGroupId || "");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");
  const [students, setStudents] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { projects } = useSelector((state) => state.projects);
  const { groups } = useSelector((state) => state.groups);
  const { status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchGroups());
    fetchStudents();
  }, [dispatch]);

  useEffect(() => {
    if (groupId) {
      const selectedGroup = groups.find((g) => g._id === groupId);
      if (selectedGroup) {
        setProjectId(selectedGroup.projectId?._id || "");
      }
    }
  }, [groupId, groups]);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/auth/students");
      setStudents(res.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        createTask({
          title,
          description,
          projectId: projectId || undefined,
          groupId: groupId || undefined,
          assignedTo: assignedTo || undefined,
          priority,
          deadline: deadline || undefined,
        })
      ).unwrap();

      alert("Task created successfully!");

      if (groupId) {
        navigate(`/groups/${groupId}`);
      } else if (projectId) {
        navigate(`/projects/${projectId}`);
      } else {
        navigate("/tasks");
      }
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Create New Task
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter task title"
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
                rows="4"
                placeholder="Enter task description"
              />
            </div>

            {/* Project Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project
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

            {/* Group Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group
              </label>
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">No Group</option>
                {groups.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assign To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Unassigned</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:bg-blue-400"
              >
                {status === "loading" ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
