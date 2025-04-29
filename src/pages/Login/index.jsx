// src/pages/Login/index.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: 'test@gmail.com',
    password: '123456',
    rememberMe: false,
    userType: 'doctor' // 'doctor' hoặc 'patient'
  });

  const [errors, setErrors] = useState({});

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

  const handleUserTypeChange = (type) => {
    setFormData({
      ...formData,
      userType: type
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Xử lý đăng nhập
      console.log('Đăng nhập với:', formData);
      
      // Ở đây sẽ gọi API đăng nhập thực tế
      alert(`Đăng nhập thành công với vai trò ${formData.userType === 'doctor' ? 'Bác sĩ' : 'Bệnh nhân'}`);
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
          {/* User Type Selection */}
          <div className="mb-6">
            <div className="flex justify-center">
              <div className="bg-blue-50 rounded-lg inline-flex p-1">
                <button
                  type="button"
                  className={`px-4 py-1 text-sm rounded-md transition ${
                    formData.userType === 'doctor'
                      ? 'bg-blue-500 text-white'
                      : 'text-blue-600'
                  }`}
                  onClick={() => handleUserTypeChange('doctor')}
                >
                  Bác sĩ
                </button>
                <button
                  type="button"
                  className={`px-4 py-1 text-sm rounded-md transition ${
                    formData.userType === 'patient'
                      ? 'bg-blue-500 text-white'
                      : 'text-blue-600'
                  }`}
                  onClick={() => handleUserTypeChange('patient')}
                >
                  Bệnh nhân
                </button>
              </div>
            </div>
          </div>

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
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Đăng nhập
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-center text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>

          {/* Thông tin hướng dẫn */}
          <div className="mt-6 bg-blue-50 p-3 rounded-md">
            <h3 className="text-xs font-medium text-blue-800">Lưu ý</h3>
            <p className="mt-1 text-xs text-blue-700">
              Bệnh nhân có thể đăng nhập để xem kết quả phân tích mô học và theo dõi tiến trình điều trị.
              Bác sĩ có thể truy cập toàn bộ chức năng phân tích và quản lý hồ sơ bệnh nhân.
              Nếu bạn gặp vấn đề khi đăng nhập, vui lòng liên hệ hỗ trợ kỹ thuật qua email: support@mohist.vn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;