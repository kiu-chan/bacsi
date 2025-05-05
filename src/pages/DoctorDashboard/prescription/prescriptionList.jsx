// src/pages/DoctorDashboard/prescriptionList.jsx
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { getPatientDetail } from '../../../firebase/services/patientService';
import { getPatientPrescriptions, deletePrescription } from '../../../firebase/services/medicationService';

function PrescriptionList() {
  const { patientId } = useParams();
  const { currentUser } = useAuth();
  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Lấy thông tin bệnh nhân và danh sách đơn thuốc
  useEffect(() => {
    const fetchData = async () => {
      if (!patientId || !currentUser?.uid) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Lấy thông tin bệnh nhân
        const patientData = await getPatientDetail(patientId);
        if (!patientData) {
          setError("Không tìm thấy thông tin bệnh nhân");
          setLoading(false);
          return;
        }
        
        setPatient(patientData);
        
        // Lấy danh sách đơn thuốc
        const prescriptionsData = await getPatientPrescriptions(patientId);
        console.log("Danh sách đơn thuốc:", prescriptionsData);
        setPrescriptions(prescriptionsData || []);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        setError('Không thể tải thông tin bệnh nhân hoặc danh sách đơn thuốc. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [patientId, currentUser]);

  // Xử lý việc xóa đơn thuốc
  const handleDeletePrescription = async () => {
    if (!selectedPrescription) return;
    
    try {
      setDeleting(true);
      
      await deletePrescription(selectedPrescription.id);
      
      // Cập nhật danh sách sau khi xóa
      setPrescriptions(prevPrescriptions =>
        prevPrescriptions.filter(p => p.id !== selectedPrescription.id)
      );
      
      setShowDeleteConfirm(false);
      setSelectedPrescription(null);
    } catch (err) {
      console.error('Lỗi khi xóa đơn thuốc:', err);
      setError('Không thể xóa đơn thuốc. Vui lòng thử lại sau.');
    } finally {
      setDeleting(false);
    }
  };

  // Format tuổi và giới tính
  const formatAgeGender = () => {
    if (!patient) return '';
    
    let result = '';
    if (patient.age) result += `${patient.age} tuổi`;
    if (patient.age && patient.gender) result += ' - ';
    if (patient.gender) result += patient.gender;
    
    return result;
  };

  // Hàm định dạng trạng thái đơn thuốc với màu tương ứng
  const getPrescriptionStatusClass = (status) => {
    switch (status) {
      case 'Mới':
        return 'bg-blue-100 text-blue-800';
      case 'Đang sử dụng':
        return 'bg-green-100 text-green-800';
      case 'Hoàn thành':
        return 'bg-gray-100 text-gray-800';
      case 'Hết hạn':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm format ngày tháng từ Timestamp nếu cần
  const formatDate = (dateValue) => {
    if (!dateValue) return '-';
    
    // Kiểm tra nếu là Timestamp từ Firestore
    if (dateValue && typeof dateValue.toDate === 'function') {
      const date = dateValue.toDate();
      return date.toLocaleDateString('vi-VN');
    }
    
    // Nếu đã là chuỗi ngày tháng
    return dateValue;
  };

  return (
    <div className="bg-blue-50 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Danh sách đơn thuốc</h1>
            <Link
              to={`/doctor/patients/${patientId}`}
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
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Đang tải thông tin...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && patient && (
          <div className="space-y-6">
            {/* Patient Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl mr-4">
                    {patient.name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{patient.name || "Bệnh nhân"}</h2>
                    <p className="text-sm text-gray-500">
                      Mã BN: {patient.patientId || `BN-${patientId.substring(0, 6)}`}
                    </p>
                    <p className="text-sm text-gray-500">{formatAgeGender()}</p>
                  </div>
                </div>
                <div>
                  <Link
                    to={`/doctor/patients/${patientId}/prescribe`}
                    className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Kê đơn mới
                  </Link>
                </div>
              </div>
            </div>

            {/* Lịch sử đơn thuốc */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Lịch sử đơn thuốc</h3>

              {prescriptions.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                    <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="text-md font-medium text-gray-700 mb-2">Chưa có đơn thuốc nào</h4>
                  <p className="text-sm text-gray-500 mb-4">Bắt đầu bằng cách kê đơn thuốc mới cho bệnh nhân.</p>
                  <Link
                    to={`/doctor/patients/${patientId}/prescribe`}
                    className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition inline-flex items-center"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Kê đơn mới
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày kê đơn
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chẩn đoán
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số loại thuốc
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bác sĩ kê đơn
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày hết hạn
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {prescriptions.map((prescription) => (
                        <tr key={prescription.id} className="hover:bg-blue-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                            {formatDate(prescription.date)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800 max-w-xs truncate">
                            {prescription.diagnosis || '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                            {prescription.medications?.length || 0}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                            {prescription.doctorName || '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                            {formatDate(prescription.expiryDate)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrescriptionStatusClass(prescription.status)}`}>
                              {prescription.status || 'Mới'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/doctor/patients/${patientId}/prescriptions/${prescription.id}`}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Chi tiết
                            </Link>
                            <button
                              onClick={() => {
                                setSelectedPrescription(prescription);
                                setShowDeleteConfirm(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Xác nhận xóa đơn thuốc</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Bạn có chắc chắn muốn xóa đơn thuốc này? Thao tác này không thể hoàn tác.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setSelectedPrescription(null);
                    }}
                    className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleDeletePrescription}
                    disabled={deleting}
                    className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-700 transition"
                  >
                    {deleting ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Đang xử lý...
                      </div>
                    ) : 'Xác nhận xóa'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrescriptionList;