import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Bảo vệ routes chỉ dành cho bệnh nhân
export const PatientRoute = ({ children }) => {
  const { currentUser, isPatient, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!isPatient) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};