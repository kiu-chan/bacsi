// pages/Login/index.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Login() {
  const { login, loginWithGoogleAccount, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Xóa lỗi khi người dùng sửa
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Kiểm tra email
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    // Kiểm tra mật khẩu
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setDebugInfo(null);
    
    if (validateForm()) {
      try {
        setLoading(true);
        console.log("Đang đăng nhập với:", formData.email, formData.password);
        
        // Gọi hàm đăng nhập từ context
        const result = await login(formData.email, formData.password);
        console.log("Kết quả đăng nhập:", result);
        
        setDebugInfo({
          success: true,
          message: "Đăng nhập thành công! Vui lòng đợi chuyển hướng...",
          user: result.user?.uid,
          profile: result.profile,
        });
        
        // Chú ý: Không cần redirect ở đây vì đã xử lý trong AuthContext
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        
        setDebugInfo({
          success: false,
          message: "Đăng nhập thất bại",
          error: error.message,
          code: error.code
        });
        
        // Hiển thị lỗi từ Firebase
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          setLoginError('Email hoặc mật khẩu không chính xác');
        } else if (error.code === 'auth/too-many-requests') {
          setLoginError('Quá nhiều lần đăng nhập không thành công. Vui lòng thử lại sau.');
        } else {
          setLoginError('Đăng nhập không thành công. Vui lòng thử lại. ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Xử lý đăng nhập Google đã cập nhật
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setLoginError('');
      setDebugInfo(null);
      
      console.log("Đang đăng nhập bằng Google...");
      
      const result = await loginWithGoogleAccount();
      console.log("Kết quả đăng nhập Google:", result);
      
      setDebugInfo({
        success: true,
        message: "Đăng nhập Google thành công! Vui lòng đợi chuyển hướng...",
        user: result.user?.uid,
        profile: result.profile,
      });
      
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      
      setDebugInfo({
        success: false,
        message: "Đăng nhập Google thất bại",
        error: error.message,
        code: error.code
      });
      
      if (error.code === 'auth/user-not-found') {
        setLoginError('Tài khoản này chưa được đăng ký trong hệ thống. Vui lòng liên hệ quản trị viên.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setLoginError('Cửa sổ đăng nhập đã bị đóng. Vui lòng thử lại.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setLoginError('Yêu cầu đăng nhập bị hủy. Vui lòng thử lại.');
      } else {
        setLoginError('Đăng nhập Google không thành công. Vui lòng thử lại. ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            M
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Đăng nhập vào MoHist
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hệ thống quản lý và phân tích ảnh mô học
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10">
          {/* Hiển thị lỗi đăng nhập nếu có */}
          {loginError && (
            <div className="mb-4 bg-red-50 p-3 rounded-md">
              <p className="text-sm text-red-600">{loginError}</p>
            </div>
          )}

          {/* Debug Info nếu có */}
          {debugInfo && (
            <div className={`mb-4 p-3 rounded-md ${debugInfo.success ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <p className={`text-sm ${debugInfo.success ? 'text-green-600' : 'text-yellow-600'}`}>
                {debugInfo.message}
              </p>
              {debugInfo.success && debugInfo.profile && (
                <p className="text-sm text-gray-600 mt-1">
                  Vai trò: {debugInfo.profile.role || 'Không xác định'}
                </p>
              )}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600" id="email-error">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600" id="password-error">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </div>
          </form>

          {/* Thêm phần đăng nhập bằng Google */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Hoặc đăng nhập với
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.8,12.1 C21.8,11.5 21.7,10.9 21.6,10.3 L12,10.3 L12,14.1 L17.5,14.1 C17.3,15.3 16.6,16.3 15.6,17 L15.6,19.3 L19,19.3 C20.9,17.5 21.8,15 21.8,12.1 L21.8,12.1 Z" fill="#4285F4"></path>
                  <path d="M12,22 C14.7,22 17,21.1 18.7,19.3 L15.3,17 C14.5,17.6 13.3,17.9 12,17.9 C9.3,17.9 7,16.1 6.1,13.7 L2.8,13.7 L2.8,16 C4.4,19.6 8,22 12,22 L12,22 Z" fill="#34A853"></path>
                  <path d="M6.1,13.7 C5.9,13.1 5.8,12.6 5.8,12 C5.8,11.4 5.9,10.9 6.1,10.3 L6.1,8 L2.8,8 C2.3,9.2 2,10.6 2,12 C2,13.4 2.3,14.8 2.8,16 L6.1,13.7 L6.1,13.7 Z" fill="#FBBC05"></path>
                  <path d="M12,6.1 C13.4,6.1 14.6,6.6 15.6,7.5 L18.5,4.6 C17,3.2 14.7,2.3 12,2.3 C8,2.3 4.4,4.7 2.8,8.3 L6.1,10.6 C7,8.2 9.3,6.1 12,6.1 L12,6.1 Z" fill="#EA4335"></path>
                </svg>
                Đăng nhập với Google
              </button>
            </div>
          </div>

          {/* Thêm phần đăng ký với hiệu ứng nhấn mạnh */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Đăng ký ngay
              </Link>
            </p>
          </div>

          {/* Thông tin hướng dẫn */}
          <div className="mt-6 bg-blue-50 p-3 rounded-md">
            <h3 className="text-xs font-medium text-blue-800">Lưu ý</h3>
            <p className="mt-1 text-xs text-blue-700">
              Hệ thống MoHist phục vụ cả bác sĩ và bệnh nhân. Bác sĩ có thể phân tích và quản lý hồ sơ bệnh nhân, trong khi bệnh nhân có thể theo dõi kết quả phân tích và tiến trình điều trị.
              Nếu bạn gặp vấn đề khi đăng nhập, vui lòng liên hệ hỗ trợ kỹ thuật qua email: support@mohist.vn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;