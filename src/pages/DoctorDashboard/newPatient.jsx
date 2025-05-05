// src/pages/DoctorDashboard/newPatient.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createNewPatient } from '../../firebase/services/patientService';

function NewPatient() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Nam',
    address: '',
    status: 'Mới',
    diagnosis: '',
    password: generateRandomPassword(),
    doctorName: userProfile?.name || '',
    department: userProfile?.department || '',
    sendResetEmail: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Tạo mật khẩu ngẫu nhiên
  function generateRandomPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser?.uid) {
      setError('Bạn cần đăng nhập để thực hiện thao tác này');
      return;
    }
    
    // Kiểm tra các trường bắt buộc
    if (!formData.name || !formData.email) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Email)');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await createNewPatient(formData, currentUser.uid);
      
      setSuccessMessage('Đã thêm bệnh nhân mới thành công!');
      
      // Reset form sau khi thêm thành công
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: 'Nam',
        address: '',
        status: 'Mới',
        diagnosis: '',
        password: generateRandomPassword(),
        doctorName: userProfile?.name || '',
        department: userProfile?.department || '',
        sendResetEmail: true
      });
      
      // Chuyển hướng về danh sách bệnh nhân sau 2 giây
      setTimeout(() => {
        navigate('/doctor/patients');
      }, 2000);
    } catch (err) {
      console.error('Lỗi khi thêm bệnh nhân mới:', err);
      setError(err.message || 'Có lỗi xảy ra khi thêm bệnh nhân mới. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Thêm bệnh nhân mới</h1>
            <div className="flex space-x-2">
              <Link
                to="/doctor/patients"
                className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-200 transition flex items-center"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
              </Link>
              <Link
                to="/doctor/patients/link"
                className="bg-green-100 text-green-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-green-200 transition flex items-center"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
                </svg>
                Liên kết với bệnh nhân có sẵn
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-100 rounded-md">
              <p className="text-green-600">{successMessage}</p>
            </div>
          )}

          {/* Link Patient Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-800 font-medium">Bệnh nhân đã có tài khoản?</p>
                <p className="text-blue-600 text-sm mt-1">
                  Nếu bệnh nhân đã có tài khoản trong hệ thống, bạn có thể {' '}
                  <Link to="/doctor/patients/link" className="font-medium underline">
                    liên kết với bệnh nhân có sẵn
                  </Link>
                  {' '} thay vì tạo tài khoản mới.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thông tin cá nhân */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Thông tin cá nhân</h2>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                      Tuổi
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Giới tính
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option>Nam</option>
                      <option>Nữ</option>
                      <option>Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Địa chỉ
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              {/* Thông tin y tế */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Thông tin y tế</h2>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Trạng thái
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option>Mới</option>
                    <option>Đang điều trị</option>
                    <option>Theo dõi</option>
                    <option>Hoàn thành</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
                    Chẩn đoán ban đầu
                  </label>
                  <textarea
                    id="diagnosis"
                    name="diagnosis"
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.diagnosis}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700">
                    Bác sĩ phụ trách
                  </label>
                  <input
                    type="text"
                    id="doctorName"
                    name="doctorName"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.doctorName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Khoa
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                <div className="pt-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="sendResetEmail"
                        name="sendResetEmail"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={formData.sendResetEmail}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="sendResetEmail" className="font-medium text-gray-700">
                        Gửi email thiết lập mật khẩu cho bệnh nhân
                      </label>
                      <p className="text-gray-500">
                        Bệnh nhân sẽ nhận được email hướng dẫn tạo mật khẩu để đăng nhập vào hệ thống.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/doctor/patients')}
                className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition mr-4"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : 'Thêm bệnh nhân'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewPatient;