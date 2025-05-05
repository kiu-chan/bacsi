// src/pages/DoctorDashboard/prescriptionDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  getPatientDetail 
} from '../../../firebase/services/patientService';
import { 
  getPrescriptionDetail,
  updatePrescriptionStatus 
} from '../../../firebase/services/medicationService';

function PrescriptionDetail() {
  const { patientId, prescriptionId } = useParams();
  const { currentUser } = useAuth();
  
  const [patient, setPatient] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Lấy thông tin bệnh nhân và chi tiết đơn thuốc
  useEffect(() => {
    const fetchData = async () => {
      if (!patientId || !prescriptionId || !currentUser?.uid) return;
      
      try {
        setLoading(true);
        
        // Lấy thông tin bệnh nhân
        const patientData = await getPatientDetail(patientId);
        setPatient(patientData);
        
        // Lấy chi tiết đơn thuốc
        const prescriptionData = await getPrescriptionDetail(prescriptionId);
        setPrescription(prescriptionData);
        
        setError(null);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        setError('Không thể tải thông tin bệnh nhân hoặc chi tiết đơn thuốc. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [patientId, prescriptionId, currentUser]);

  // Xử lý cập nhật trạng thái đơn thuốc
  const handleUpdateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      
      await updatePrescriptionStatus(prescriptionId, newStatus);
      
      // Cập nhật state
      setPrescription(prev => ({
        ...prev,
        status: newStatus
      }));
      
      setSuccessMessage(`Đã cập nhật trạng thái thành "${newStatus}"`);
      
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái:', err);
      setError('Không thể cập nhật trạng thái đơn thuốc. Vui lòng thử lại sau.');
    } finally {
      setUpdating(false);
    }
  };

  // In đơn thuốc
  const handlePrintPrescription = () => {
    window.print();
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
  const getStatusClass = (status) => {
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

  return (
    <div className="bg-blue-50 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Chi tiết đơn thuốc</h1>
            <Link
              to={`/doctor/patients/${patientId}/prescriptions`}
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

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-100 rounded-md">
            <p className="text-green-600">{successMessage}</p>
          </div>
        )}

        {!loading && patient && prescription && (
          <div className="space-y-6 print:space-y-4" id="printable-content">
            {/* Prescription Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 print:shadow-none">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 print:mb-3">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl mr-4 print:hidden">
                    {patient.name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{patient.name}</h2>
                    <p className="text-sm text-gray-500">
                      Mã BN: {patient.patientId || `BN-${patientId.substring(0, 6)}`}
                    </p>
                    <p className="text-sm text-gray-500">{formatAgeGender()}</p>
                  </div>
                </div>
                
                <div className="flex items-center print:hidden">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusClass(prescription.status)} mr-3`}>
                    {prescription.status}
                  </span>
                  <button
                    onClick={handlePrintPrescription}
                    className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-200 transition flex items-center"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    In đơn thuốc
                  </button>
                </div>
              </div>

              <div className="print:text-center print:mb-4">
                <h2 className="text-xl font-bold text-gray-800 hidden print:block print:text-center mb-2">ĐƠN THUỐC</h2>
                <div className="print:text-center print:text-sm print:mb-2">Mã đơn: {prescription.id}</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-3">
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">Thông tin đơn thuốc</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ngày kê đơn</p>
                      <p className="text-sm text-gray-800">{prescription.date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ngày hết hạn</p>
                      <p className="text-sm text-gray-800">{prescription.expiryDate || 'Không có'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Bác sĩ kê đơn</p>
                      <p className="text-sm text-gray-800">{prescription.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Khoa</p>
                      <p className="text-sm text-gray-800">{prescription.department || 'Không có'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">Chẩn đoán và hướng dẫn</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Chẩn đoán</p>
                      <p className="text-sm text-gray-800">{prescription.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Hướng dẫn chung</p>
                      <p className="text-sm text-gray-800">{prescription.instructions}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Status update buttons - only visible in web view */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-2 print:hidden">
                <p className="text-sm font-medium text-gray-700 mr-2">Cập nhật trạng thái:</p>
                <button
                  onClick={() => handleUpdateStatus('Mới')}
                  disabled={prescription.status === 'Mới' || updating}
                  className={`px-3 py-1 rounded-md text-xs font-medium ${
                    prescription.status === 'Mới'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  Mới
                </button>
                <button
                  onClick={() => handleUpdateStatus('Đang sử dụng')}
                  disabled={prescription.status === 'Đang sử dụng' || updating}
                  className={`px-3 py-1 rounded-md text-xs font-medium ${
                    prescription.status === 'Đang sử dụng'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  Đang sử dụng
                </button>
                <button
                  onClick={() => handleUpdateStatus('Hoàn thành')}
                  disabled={prescription.status === 'Hoàn thành' || updating}
                  className={`px-3 py-1 rounded-md text-xs font-medium ${
                    prescription.status === 'Hoàn thành'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                  }`}
                >
                  Hoàn thành
                </button>
                <button
                  onClick={() => handleUpdateStatus('Hết hạn')}
                  disabled={prescription.status === 'Hết hạn' || updating}
                  className={`px-3 py-1 rounded-md text-xs font-medium ${
                    prescription.status === 'Hết hạn'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  Hết hạn
                </button>
              </div>
            </div>

            {/* Medications List */}
            <div className="bg-white rounded-lg shadow-sm p-6 print:shadow-none">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Danh sách thuốc</h3>
              
              {prescription.medications?.length > 0 ? (
                <div className="space-y-4">
                  {prescription.medications.map((med, index) => (
                    <div key={index} className="p-4 bg-blue-50 border border-blue-100 rounded-md print:bg-white print:border print:border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-md font-medium text-gray-800">{med.name}</h4>
                          {med.category && (
                            <p className="text-xs text-gray-500">{med.category}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700">Liều dùng: {med.dosage}</p>
                        </div>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Tần suất:</span> {med.frequency}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Thời gian:</span> {med.duration}
                          </p>
                        </div>
                      </div>
                      
                      {med.instructions && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Hướng dẫn:</span> {med.instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
                  <p className="text-sm text-gray-500">Không có thuốc nào trong đơn</p>
                </div>
              )}
            </div>

            {/* Print footer - only visible when printing */}
            <div className="hidden print:block mt-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-sm font-medium mb-12">Người kê đơn</p>
                  <p className="text-sm font-medium">{prescription.doctorName}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium mb-12">Bệnh nhân</p>
                  <p className="text-sm font-medium">{patient.name}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrescriptionDetail;