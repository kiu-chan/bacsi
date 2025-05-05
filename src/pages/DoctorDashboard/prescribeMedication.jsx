// src/pages/DoctorDashboard/prescribeMedication.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getPatientDetail } from '../../firebase/services/patientService';
import { savePrescription, getMedicationsList } from '../../firebase/services/medicationService';

function PrescribeMedication() {
  const { patientId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const [availableMeds, setAvailableMeds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMeds, setFilteredMeds] = useState([]);
  
  const [prescription, setPrescription] = useState({
    patientId: patientId,
    doctorId: currentUser?.uid || '',
    doctorName: userProfile?.name || '',
    department: userProfile?.department || '',
    date: new Date().toLocaleDateString('vi-VN'),
    diagnosis: '',
    medications: [],
    instructions: '',
    expiryDate: '',
    status: 'Mới'
  });
  
  // Lấy thông tin bệnh nhân và danh sách thuốc có sẵn
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Lấy thông tin bệnh nhân
        const patientData = await getPatientDetail(patientId);
        setPatient(patientData);
        
        // Cập nhật chẩn đoán từ hồ sơ bệnh nhân
        if (patientData?.diagnosis) {
          setPrescription(prev => ({
            ...prev,
            diagnosis: patientData.diagnosis
          }));
        }
        
        // Lấy danh sách thuốc
        const medsData = await getMedicationsList();
        setAvailableMeds(medsData);
        setFilteredMeds(medsData);
        
        setError(null);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        setError('Không thể tải thông tin bệnh nhân hoặc danh sách thuốc. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [patientId, currentUser]);
  
  // Lọc danh sách thuốc theo từ khóa tìm kiếm
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMeds(availableMeds);
    } else {
      const filtered = availableMeds.filter(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMeds(filtered);
    }
  }, [searchTerm, availableMeds]);
  
  // Thêm thuốc vào đơn
  const handleAddMedication = (med) => {
    // Kiểm tra xem thuốc đã có trong đơn chưa
    const exists = prescription.medications.some(m => m.id === med.id);
    if (exists) {
      setError('Thuốc này đã được thêm vào đơn');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setPrescription(prev => ({
      ...prev,
      medications: [...prev.medications, {
        id: med.id,
        name: med.name,
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        category: med.category
      }]
    }));
  };
  
  // Xóa thuốc khỏi đơn
  const handleRemoveMedication = (index) => {
    setPrescription(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };
  
  // Cập nhật thông tin thuốc trong đơn
  const handleMedicationChange = (index, field, value) => {
    setPrescription(prev => {
      const updatedMeds = [...prev.medications];
      updatedMeds[index] = {
        ...updatedMeds[index],
        [field]: value
      };
      return {
        ...prev,
        medications: updatedMeds
      };
    });
  };
  
  // Cập nhật thông tin chung của đơn thuốc
  const handlePrescriptionChange = (e) => {
    const { name, value } = e.target;
    setPrescription(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Lưu đơn thuốc
  const handleSavePrescription = async (e) => {
    e.preventDefault();
    
    // Kiểm tra xem đơn thuốc có hợp lệ không
    if (prescription.medications.length === 0) {
      setError('Đơn thuốc phải có ít nhất một loại thuốc');
      return;
    }
    
    // Kiểm tra xem các trường bắt buộc của thuốc đã được điền chưa
    const invalidMeds = prescription.medications.filter(med => 
      !med.dosage || !med.frequency || !med.duration
    );
    
    if (invalidMeds.length > 0) {
      setError('Vui lòng điền đầy đủ thông tin liều dùng, tần suất và thời gian cho tất cả thuốc');
      return;
    }
    
    // Kiểm tra xem các trường bắt buộc của đơn thuốc đã được điền chưa
    if (!prescription.diagnosis || !prescription.instructions) {
      setError('Vui lòng điền đầy đủ thông tin chẩn đoán và hướng dẫn chung');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Thêm ngày hết hạn mặc định nếu không có
      if (!prescription.expiryDate) {
        // Mặc định là 30 ngày từ ngày kê đơn
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        prescription.expiryDate = expiryDate.toLocaleDateString('vi-VN');
      }
      
      // Lưu đơn thuốc vào database
      await savePrescription({
        ...prescription,
        timestamp: new Date(),
        patientName: patient.name,
        patientEmail: patient.email
      });
      
      setSuccessMessage('Đã lưu đơn thuốc thành công!');
      
      // Chuyển hướng về trang chi tiết bệnh nhân sau 2 giây
      setTimeout(() => {
        navigate(`/doctor/patients/${patientId}`);
      }, 2000);
      
    } catch (err) {
      console.error('Lỗi khi lưu đơn thuốc:', err);
      setError('Không thể lưu đơn thuốc. Vui lòng thử lại sau.');
    } finally {
      setSaving(false);
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
            <h1 className="text-2xl font-bold text-gray-800">Kê đơn thuốc</h1>
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

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-100 rounded-md">
            <p className="text-green-600">{successMessage}</p>
          </div>
        )}

        {!loading && patient && (
          <div className="space-y-6">
            {/* Patient Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Danh sách thuốc có sẵn */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Danh sách thuốc</h3>
                  
                  {/* Tìm kiếm thuốc */}
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Tìm kiếm thuốc..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {/* Danh sách thuốc lọc được */}
                  <div className="h-96 overflow-y-auto border border-gray-200 rounded-md">
                    {filteredMeds.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {filteredMeds.map((med) => (
                          <li key={med.id} className="p-3 hover:bg-blue-50">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-gray-800">{med.name}</p>
                                <p className="text-xs text-gray-500">{med.category}</p>
                              </div>
                              <button
                                onClick={() => handleAddMedication(med)}
                                className="bg-blue-100 text-blue-600 text-xs font-medium p-1 rounded hover:bg-blue-200 transition"
                              >
                                Thêm
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-sm text-gray-500">Không tìm thấy thuốc nào</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form kê đơn */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Thông tin đơn thuốc</h3>
                  
                  <form onSubmit={handleSavePrescription}>
                    <div className="space-y-6">
                      {/* Thông tin chung */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
                            Chẩn đoán <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="diagnosis"
                            name="diagnosis"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            rows="3"
                            value={prescription.diagnosis}
                            onChange={handlePrescriptionChange}
                            required
                          ></textarea>
                        </div>
                        <div>
                          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                            Hướng dẫn chung <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="instructions"
                            name="instructions"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            rows="3"
                            value={prescription.instructions}
                            onChange={handlePrescriptionChange}
                            required
                          ></textarea>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Ngày kê đơn
                          </label>
                          <input
                            type="text"
                            id="date"
                            name="date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={prescription.date}
                            onChange={handlePrescriptionChange}
                            readOnly
                          />
                        </div>
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                            Ngày hết hạn
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={prescription.expiryDate}
                            onChange={handlePrescriptionChange}
                            placeholder="DD/MM/YYYY"
                          />
                        </div>
                      </div>

                      {/* Danh sách thuốc đã thêm */}
                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-2">
                          Thuốc đã thêm ({prescription.medications.length})
                        </h4>
                        
                        {prescription.medications.length === 0 ? (
                          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
                            <p className="text-sm text-gray-500">
                              Chưa có thuốc nào được thêm vào đơn. Chọn thuốc từ danh sách bên trái.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {prescription.medications.map((med, index) => (
                              <div key={index} className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-800">{med.name}</h5>
                                    <p className="text-xs text-gray-500">{med.category}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMedication(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <label htmlFor={`dosage-${index}`} className="block text-xs font-medium text-gray-700">
                                      Liều dùng <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      id={`dosage-${index}`}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs"
                                      value={med.dosage}
                                      onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                      placeholder="VD: 1 viên"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor={`frequency-${index}`} className="block text-xs font-medium text-gray-700">
                                      Tần suất <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      id={`frequency-${index}`}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs"
                                      value={med.frequency}
                                      onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                      placeholder="VD: 3 lần/ngày"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor={`duration-${index}`} className="block text-xs font-medium text-gray-700">
                                      Thời gian <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      id={`duration-${index}`}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs"
                                      value={med.duration}
                                      onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                      placeholder="VD: 7 ngày"
                                      required
                                    />
                                  </div>
                                </div>
                                
                                <div className="mt-2">
                                  <label htmlFor={`med-instructions-${index}`} className="block text-xs font-medium text-gray-700">
                                    Hướng dẫn riêng
                                  </label>
                                  <textarea
                                    id={`med-instructions-${index}`}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs"
                                    rows="2"
                                    value={med.instructions}
                                    onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                                    placeholder="VD: Uống sau khi ăn"
                                  ></textarea>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Buttons */}
                      <div className="flex justify-end space-x-3">
                        <Link
                          to={`/doctor/patients/${patientId}`}
                          className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition"
                        >
                          Hủy
                        </Link>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition"
                          disabled={saving}
                        >
                          {saving ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Đang lưu...
                            </div>
                          ) : 'Lưu đơn thuốc'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrescribeMedication;