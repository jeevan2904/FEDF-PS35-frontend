import { useSelector } from "react-redux";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import StudentDashboard from "../components/dashboard/StudentDashboard";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return user.role === "admin" ? <AdminDashboard /> : <StudentDashboard />;
}
