// src/pages/DoctorDashboard/patientDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { getPatientDetail, updatePatientInfo, unlinkPatientFromDoctor } from '../../../firebase/services/patientService';
import { getPrescriptionDetail } from '../../../firebase/services/medicationService';

function PatientDetail() {
  const { patientId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedPatient, setEditedPatient] = useState({});
  const [recentMedications, setRecentMedications] = useState([]);
  const [savingChanges, setSavingChanges] = useState(false);
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);

  // Lấy thông tin chi tiết của bệnh nhân
  useEffect(() => {
    const fetchPatientDetail = async () => {
      if (!patientId || !currentUser?.uid) return;
      
      try {
        setLoading(true);
        const patientData = await getPatientDetail(patientId);
        
        if (!patientData) {
          setError("Không tìm thấy thông tin bệnh nhân");
          return;
        }
        
        setPatient(patientData);
        setEditedPatient(patientData);
        
        // Lấy thông tin đơn thuốc gần đây nếu có
        if (patientData.latestPrescriptionId) {
          try {
            const prescriptionDetail = await getPrescriptionDetail(patientData.latestPrescriptionId);
            if (prescriptionDetail && prescriptionDetail.medications) {
              setRecentMedications(prescriptionDetail.medications);
            }
          } catch (medErr) {
            console.error("Lỗi khi lấy thông tin đơn thuốc:", medErr);
            // Không hiển thị lỗi này cho người dùng
          }
        }
        
        setError(null);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin bệnh nhân:", err);
        setError("Không thể tải thông tin bệnh nhân. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetail();
  }, [patientId, currentUser]);

  // Xử lý thay đổi input trong form chỉnh sửa
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPatient(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Lưu thay đổi thông tin bệnh nhân
  const handleSaveChanges = async () => {
    if (!patientId || !currentUser?.uid) {
      setError('Không đủ thông tin để cập nhật');
      return;
    }

    try {
      setSavingChanges(true);
      
      await updatePatientInfo(patientId, editedPatient);
      
      // Cập nhật state
      setPatient(editedPatient);
      setEditMode(false);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin bệnh nhân:", err);
      setError("Không thể cập nhật thông tin bệnh nhân. Vui lòng thử lại sau.");
    } finally {
      setSavingChanges(false);
    }
  };

  // Hủy bỏ chỉnh sửa
  const handleCancelEdit = () => {
    setEditedPatient(patient);
    setEditMode(false);
  };

  // Xử lý hủy liên kết với bệnh nhân
  const handleUnlinkPatient = async () => {
    if (!patientId || !currentUser?.uid) {
      setError('Không đủ thông tin để hủy liên kết');
      return;
    }

    try {
      setSavingChanges(true);
      
      await unlinkPatientFromDoctor(patientId, currentUser.uid);
      
      // Chuyển hướng về danh sách bệnh nhân
      navigate('/doctor/patients', { 
        state: { message: 'Đã hủy liên kết với bệnh nhân thành công' }
      });
    } catch (err) {
      console.error("Lỗi khi hủy liên kết bệnh nhân:", err);
      setError("Không thể hủy liên kết với bệnh nhân. Vui lòng thử lại sau.");
      setShowUnlinkConfirm(false);
    } finally {
      setSavingChanges(false);
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

  return (
    <div className="bg-blue-50 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Thông tin bệnh nhân</h1>
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
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Đang tải thông tin bệnh nhân...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="p-4 bg-red-50 border border-red-100 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Patient Information */}
        {!loading && patient && (
          <div className="space-y-6">
            {/* Patient Header Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl mr-4">
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
                <div className="md:ml-auto">
                  <div className="flex flex-wrap gap-2">
                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-200 transition flex items-center"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Chỉnh sửa
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSaveChanges}
                          disabled={savingChanges}
                          className="bg-green-100 text-green-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-green-200 transition flex items-center"
                        >
                          {savingChanges ? (
                            <div className="flex items-center">
                              <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-1"></div>
                              Đang lưu...
                            </div>
                          ) : (
                            <>
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Lưu thay đổi
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-gray-200 transition flex items-center"
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Hủy
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setShowUnlinkConfirm(true)}
                      className="bg-red-100 text-red-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-200 transition flex items-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      Hủy liên kết
                    </button>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.status === 'Đang điều trị' 
                        ? 'bg-green-100 text-green-800' 
                        : patient.status === 'Theo dõi' 
                          ? 'bg-blue-100 text-blue-800'
                          : patient.status === 'Mới'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                      {patient.status || 'Mới'}
                    </span>
                  </div>
                  
                  {editMode && (
                    <div className="ml-auto">
                      <select
                        name="status"
                        className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={editedPatient.status || 'Mới'}
                        onChange={handleChange}
                      >
                        <option>Mới</option>
                        <option>Đang điều trị</option>
                        <option>Theo dõi</option>
                        <option>Hoàn thành</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Patient Information Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Thông tin cá nhân</h3>
                
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Họ tên
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={editedPatient.name || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                        Tuổi
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={editedPatient.age || ''}
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
                        value={editedPatient.gender || 'Nam'}
                        onChange={handleChange}
                      >
                        <option>Nam</option>
                        <option>Nữ</option>
                        <option>Khác</option>
                      </select>
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
                        value={editedPatient.phone || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={editedPatient.email || ''}
                        onChange={handleChange}
                        disabled // Email không thể thay đổi
                      />
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
                        value={editedPatient.address || ''}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Họ tên</p>
                      <p className="text-sm text-gray-800">{patient.name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tuổi</p>
                      <p className="text-sm text-gray-800">{patient.age || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Giới tính</p>
                      <p className="text-sm text-gray-800">{patient.gender || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                      <p className="text-sm text-gray-800">{patient.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-800">{patient.email || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                      <p className="text-sm text-gray-800">{patient.address || '-'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Medical Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Thông tin y tế</h3>
                
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
                        Chẩn đoán
                      </label>
                      <textarea
                        id="diagnosis"
                        name="diagnosis"
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={editedPatient.diagnosis || ''}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                        Dị ứng
                      </label>
                      <textarea
                        id="allergies"
                        name="allergies"
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={editedPatient.allergies || ''}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">
                        Tiền sử bệnh
                      </label>
                      <textarea
                        id="medicalHistory"
                        name="medicalHistory"
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={editedPatient.medicalHistory || ''}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="lastVisit" className="block text-sm font-medium text-gray-700">
                        Lần khám gần nhất
                      </label>
                      <input
                        type="text"
                        id="lastVisit"
                        name="lastVisit"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={editedPatient.lastVisit || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="nextAppointment" className="block text-sm font-medium text-gray-700">
                        Lịch hẹn tiếp theo
                      </label>
                      <input
                        type="text"
                        id="nextAppointment"
                        name="nextAppointment"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={editedPatient.nextAppointment || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Chẩn đoán</p>
                      <p className="text-sm text-gray-800">{patient.diagnosis || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Dị ứng</p>
                      <p className="text-sm text-gray-800">{patient.allergies || 'Không có'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tiền sử bệnh</p>
                      <p className="text-sm text-gray-800">{patient.medicalHistory || 'Không có'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Lần khám gần nhất</p>
                      <p className="text-sm text-gray-800">{patient.lastVisit || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Lịch hẹn tiếp theo</p>
                      <p className="text-sm text-gray-800">{patient.nextAppointment || 'Chưa có lịch hẹn'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Medications & Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Đơn thuốc hiện tại</h3>
                
                {recentMedications.length > 0 ? (
                  <div className="space-y-3">
                    {recentMedications.map((med, index) => (
                      <div key={index} className="py-2 border-b border-gray-100 last:border-0">
                        <p className="text-sm font-medium text-gray-800">{med.name}</p>
                        <p className="text-xs text-gray-500">{med.dosage} - {med.frequency}</p>
                        <p className="text-xs text-gray-500">{med.instructions}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500"></p>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Thao tác nhanh</h3>
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/doctor/patients/${patientId}/prescribe`}
                      className="bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-1M9 14l2 2 4-4" />
                      </svg>
                      Kê đơn thuốc
                    </Link>
                    <Link
                      to={`/doctor/patients/${patientId}/prescriptions`}
                      className="bg-yellow-600 text-white text-sm font-medium py-2 px-3 rounded-md hover:bg-yellow-700 transition flex items-center justify-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Xem đơn thuốc
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Records & History */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Lịch sử y tế</h3>
                <Link
                  to={`/doctor/patients/${patientId}/history`}
                  className="text-blue-600 text-sm font-medium hover:text-blue-800"
                >
                  Xem đầy đủ
                </Link>
              </div>

              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loại
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mô tả
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bác sĩ
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patient.medicalRecords && patient.medicalRecords.length > 0 ? (
                        patient.medicalRecords.slice(0, 3).map((record, index) => (
                          <tr key={index} className="hover:bg-blue-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {record.date}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                record.type === 'Khám bệnh' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : record.type === 'Xét nghiệm' 
                                    ? 'bg-purple-100 text-purple-800'
                                    : record.type === 'Kê đơn'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                              }`}>
                                {record.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                              {record.description}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {record.doctorName}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <Link to={`/doctor/patients/${patientId}/records/${record.id}`} className="text-blue-600 hover:text-blue-900">
                                Chi tiết
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-4 text-sm text-center text-gray-500">
                            Chưa có thông tin lịch sử y tế
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Modal for Unlinking Patient */}
        {showUnlinkConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Xác nhận hủy liên kết</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Bạn có chắc chắn muốn hủy liên kết với bệnh nhân này? Thao tác này sẽ xóa bệnh nhân khỏi danh sách bệnh nhân của bạn, nhưng không xóa tài khoản của họ khỏi hệ thống.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowUnlinkConfirm(false)}
                    className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleUnlinkPatient}
                    disabled={savingChanges}
                    className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-700 transition"
                  >
                    {savingChanges ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Đang xử lý...
                      </div>
                    ) : 'Xác nhận hủy liên kết'}
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

export default PatientDetail;