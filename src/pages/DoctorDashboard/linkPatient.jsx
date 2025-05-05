// src/pages/DoctorDashboard/linkPatient.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { linkPatientToDoctor } from '../../firebase/services/patientService';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

function LinkPatient() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Tìm kiếm bệnh nhân theo email
  const searchPatient = async () => {
    if (!email) {
      setError('Vui lòng nhập email bệnh nhân');
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);
      setPatientDetails(null);

      // Tìm kiếm user theo email (trong thực tế, bạn cần tạo một cloud function để làm việc này vì Firestore không hỗ trợ tìm kiếm theo field không phải là index)
      // Giả lập: Kiểm tra email trong collection users
      // Lưu ý: Đây chỉ là mã giả, trong thực tế cần triển khai cloud function
      const usersCollection = await import('../../firebase/services/userService');
      const user = await usersCollection.getUserByEmail(email);

      if (user) {
        // Kiểm tra xem user có phải là bệnh nhân không
        const userDoc = await getDoc(doc(db, 'users', user.id));
        
        if (userDoc.exists() && userDoc.data().role === 'patient') {
          setPatientDetails({
            id: user.id,
            name: userDoc.data().name || '',
            email: userDoc.data().email || '',
            phone: userDoc.data().phone || ''
          });
        } else {
          setError('Email này không thuộc về tài khoản bệnh nhân');
        }
      } else {
        setError('Không tìm thấy bệnh nhân với email này');
      }
    } catch (err) {
      console.error('Lỗi khi tìm kiếm bệnh nhân:', err);
      setError('Có lỗi xảy ra khi tìm kiếm bệnh nhân');
    } finally {
      setSearchLoading(false);
    }
  };

  // Liên kết bệnh nhân với bác sĩ
  const handleLinkPatient = async () => {
    if (!patientDetails || !currentUser?.uid) {
      setError('Không thể liên kết bệnh nhân');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await linkPatientToDoctor(
        patientDetails.id,
        currentUser.uid,
        userProfile?.name || '',
        userProfile?.department || ''
      );
      
      setSuccessMessage('Đã liên kết bệnh nhân thành công!');
      
      // Chuyển hướng về danh sách bệnh nhân sau 2 giây
      setTimeout(() => {
        navigate('/doctor/patients');
      }, 2000);
    } catch (err) {
      console.error('Lỗi khi liên kết bệnh nhân:', err);
      setError(err.message || 'Có lỗi xảy ra khi liên kết bệnh nhân');
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
            <h1 className="text-2xl font-bold text-gray-800">Liên kết với bệnh nhân</h1>
            <Link
              to="/doctor/patients"
              className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-200 transition flex items-center"
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </Link>
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

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Tìm kiếm bệnh nhân</h2>
            <p className="text-gray-600 mb-4">
              Nhập email của bệnh nhân đã đăng ký để liên kết với bạn.
            </p>
            
            <div className="flex items-center space-x-2">
              <input
                type="email"
                placeholder="Email bệnh nhân"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={searchPatient}
                disabled={searchLoading}
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                {searchLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang tìm...
                  </div>
                ) : 'Tìm kiếm'}
              </button>
            </div>
          </div>

          {/* Patient Details */}
          {patientDetails && (
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-md font-medium text-gray-800 mb-2">Thông tin bệnh nhân</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Họ tên:</span> {patientDetails.name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {patientDetails.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Số điện thoại:</span> {patientDetails.phone || 'Chưa cập nhật'}
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleLinkPatient}
                  disabled={loading}
                  className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : 'Liên kết với bệnh nhân này'}
                </button>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 mt-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Thêm bệnh nhân mới</h2>
            <p className="text-gray-600 mb-4">
              Nếu bệnh nhân chưa có tài khoản trong hệ thống, bạn có thể tạo tài khoản mới cho họ.
            </p>
            <Link
              to="/doctor/patients/new"
              className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-green-700 transition inline-flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm bệnh nhân mới
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinkPatient;