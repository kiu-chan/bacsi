// Cập nhật file: contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  authStateListener, 
  loginWithEmailAndPassword, 
  logout, 
  resetPassword,
  updateUserProfile
} from '../firebase/services/authService';
import { getDocument } from '../firebase/services/firestoreService';

// Tạo context cho authentication
const AuthContext = createContext();

// Hook để sử dụng context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Đăng nhập
  const login = async (email, password) => {
    try {
      setError(null);
      const { user, profile } = await loginWithEmailAndPassword(email, password);
      
      // Cập nhật state
      setCurrentUser(user);
      setUserProfile(profile);
      
      // Kiểm tra vai trò và chuyển hướng tương ứng
      console.log("Đăng nhập thành công với vai trò:", profile?.role);
      
      if (profile?.role === 'doctor') {
        console.log("Chuyển hướng đến /doctor");
        navigate('/doctor');
      } else if (profile?.role === 'patient') {
        console.log("Chuyển hướng đến /patient");
        navigate('/patient');
      } else {
        // Mặc định chuyển về trang chủ nếu không có role
        console.log("Không xác định được vai trò, chuyển về trang chủ");
        navigate('/');
      }
      
      return { user, profile };
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setError(error.message);
      throw error;
    }
  };

  // Đăng xuất
  const signOut = async () => {
    try {
      setError(null);
      await logout();
      setCurrentUser(null);
      setUserProfile(null);
      navigate('/login');
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Quên mật khẩu
  const forgotPassword = async (email) => {
    try {
      setError(null);
      await resetPassword(email);
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Effect để theo dõi trạng thái đăng nhập
  useEffect(() => {
    const unsubscribe = authStateListener(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Lấy thông tin chi tiết từ Firestore
          const profile = await getDocument('users', user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Không thể lấy thông tin người dùng:", error);
        }
      }
      
      setLoading(false);
    });

    // Cleanup function
    return unsubscribe;
  }, []);

  // Giá trị cung cấp cho context
  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    login,
    signOut,
    forgotPassword,
    isDoctor: userProfile?.role === 'doctor',
    isPatient: userProfile?.role === 'patient',
    isAdmin: userProfile?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};