// src/pages/PatientDashboard/patientMedications.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getPatientPrescriptions, 
  getPrescriptionDetail, 
  filterPrescriptionsByStatus, 
  searchPrescriptions 
} from '../../firebase/services/medicationService';

function PatientMedications() {
  const { currentUser, userProfile } = useAuth();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [prescriptionsPerPage] = useState(5);

  // Lấy danh sách đơn thuốc
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        let prescriptions;
        
        if (statusFilter === 'Tất cả') {
          prescriptions = await getPatientPrescriptions(currentUser.uid);
        } else {
          prescriptions = await filterPrescriptionsByStatus(currentUser.uid, statusFilter);
        }
        
        setMedications(prescriptions);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi lấy đơn thuốc:", err);
        setError("Không thể tải đơn thuốc. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.uid) {
      fetchPrescriptions();
    }
  }, [currentUser, statusFilter]);

  // Xử lý tìm kiếm
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchTerm) {
        // Nếu không có từ khóa tìm kiếm, tải lại danh sách ban đầu
        if (statusFilter === 'Tất cả') {
          const prescriptions = await getPatientPrescriptions(currentUser.uid);
          setMedications(prescriptions);
        } else {
          const prescriptions = await filterPrescriptionsByStatus(currentUser.uid, statusFilter);
          setMedications(prescriptions);
        }
        return;
      }

      try {
        setLoading(true);
        const results = await searchPrescriptions(currentUser.uid, searchTerm);
        setMedications(results);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tìm kiếm đơn thuốc:", err);
        setError("Không thể tìm kiếm đơn thuốc. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    // Sử dụng debounce để tránh gọi API quá nhiều
    const timeoutId = setTimeout(() => {
      if (currentUser?.uid) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentUser]);

  // Phân trang
  const indexOfLastPrescription = currentPage * prescriptionsPerPage;
  const indexOfFirstPrescription = indexOfLastPrescription - prescriptionsPerPage;
  const currentPrescriptions = medications.slice(indexOfFirstPrescription, indexOfLastPrescription);
  const totalPages = Math.ceil(medications.length / prescriptionsPerPage);

  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Hàm hiển thị chi tiết đơn thuốc
  const showPrescriptionDetail = async (prescription) => {
    try {
      // Nếu đơn thuốc đã có đầy đủ thông tin (bao gồm danh sách medications)
      if (prescription.medications) {
        setSelectedPrescription(prescription);
      } else {
        // Nếu chưa có đầy đủ thông tin, lấy chi tiết từ API
        setLoading(true);
        const detail = await getPrescriptionDetail(prescription.id);
        setSelectedPrescription(detail);
        setLoading(false);
      }
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đơn thuốc:", err);
      setError("Không thể tải chi tiết đơn thuốc. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  // Hàm đóng modal
  const closeModal = () => {
    setSelectedPrescription(null);
  };

  return (
    <div className="bg-blue-50 min-h-screen pb-10">
      {/* Patient Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl mr-4">
                {userProfile?.name?.charAt(0) || 'B'}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{userProfile?.name || 'Bệnh nhân'}</h1>
                <p className="text-sm text-gray-500">
                  Mã BN: {userProfile?.patientId || 'BN-XXXX'} | {userProfile?.age || 'N/A'} tuổi | {userProfile?.gender || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  Bác sĩ phụ trách: {userProfile?.doctorName || 'Chưa có thông tin'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link to="/patient" className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-200 transition flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Tiêu đề và bộ lọc */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800 mb-2 md:mb-0">Đơn thuốc</h2>
            </div>
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
                  Trạng thái:
                </label>
                <select
                  id="status-filter"
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>Tất cả</option>
                  <option>Đang sử dụng</option>
                  <option>Đã hoàn thành</option>
                </select>
              </div>
              
              <div className="relative max-w-xs w-full md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tìm theo mã đơn, bác sĩ, thuốc, chẩn đoán..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Hiển thị lỗi */}
          {error && (
            <div className="p-4 bg-red-50 text-red-600 border-b border-gray-200">
              <p>{error}</p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Đang tải đơn thuốc...</p>
            </div>
          )}

          {/* Danh sách đơn thuốc */}
          {!loading && (
            <div className="divide-y divide-gray-200">
              {currentPrescriptions.length > 0 ? (
                currentPrescriptions.map((prescription) => (
                  <div key={prescription.id} 
                      className="p-4 hover:bg-blue-50 transition cursor-pointer"
                      onClick={() => showPrescriptionDetail(prescription)}>
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div>
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                          <span className="text-md font-medium text-gray-800">{prescription.prescriptionId}</span>
                          <span className="ml-2 text-gray-600">({prescription.date})</span>
                        </div>
                        <h3 className="text-md font-medium text-gray-800 mt-1">
                          {prescription.diagnosis}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Bác sĩ: {prescription.doctorName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {prescription.department}
                        </p>
                        <div className="mt-2">
                          <ul className="list-disc text-sm text-gray-600 pl-5">
                            {prescription.medications && prescription.medications.slice(0, 2).map((med, index) => (
                              <li key={index}>{med.name} {med.dosage} - {med.frequency}</li>
                            ))}
                            {prescription.medications && prescription.medications.length > 2 && (
                              <li className="text-blue-600">+{prescription.medications.length - 2} thuốc khác</li>
                            )}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0 md:ml-4 md:text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          prescription.status === 'Đang sử dụng' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {prescription.status}
                        </span>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Hết hạn: {prescription.expiryDate}</p>
                        </div>
                        <div className="mt-2">
                          <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy đơn thuốc nào</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Thử thay đổi bộ lọc hoặc điều kiện tìm kiếm
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Phân trang */}
          {!loading && totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Trước
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{indexOfFirstPrescription + 1}</span> đến <span className="font-medium">
                      {indexOfLastPrescription > medications.length ? medications.length : indexOfLastPrescription}
                    </span> trong <span className="font-medium">{medications.length}</span> đơn thuốc
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Trang trước</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Số trang */}
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Trang sau</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chi tiết đơn thuốc (Modal) */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-90vh overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Chi tiết đơn thuốc</h2>
                  <p className="text-sm text-gray-500">Mã đơn: {selectedPrescription.prescriptionId}</p>
                </div>
                <button 
                  onClick={closeModal} 
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <h3 className="text-md font-medium text-gray-800">Thông tin kê đơn</h3>
                      <p className="text-sm text-gray-600 mt-1">Ngày kê đơn: {selectedPrescription.date}</p>
                      <p className="text-sm text-gray-600">Hết hạn: {selectedPrescription.expiryDate}</p>
                    </div>
                    <span className={`mt-2 sm:mt-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedPrescription.status === 'Đang sử dụng' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedPrescription.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-2">Thông tin bác sĩ</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">Bác sĩ:</span> {selectedPrescription.doctorName}
                    </p>
                    <p className="text-sm text-gray-800 mt-1">
                      <span className="font-medium">Khoa:</span> {selectedPrescription.department}
                    </p>
                    <p className="text-sm text-gray-800 mt-1">
                      <span className="font-medium">Chẩn đoán:</span> {selectedPrescription.diagnosis}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-2">Danh sách thuốc</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tên thuốc
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Liều lượng
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tần suất
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thời gian
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hướng dẫn
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedPrescription.medications.map((med, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {med.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {med.dosage}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {med.frequency}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {med.duration}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {med.instructions}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedPrescription.status === 'Đang sử dụng' && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-yellow-800 mb-2">Lưu ý</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      <li>Uống thuốc đúng liều lượng và thời gian quy định</li>
                      <li>Tuân thủ hướng dẫn sử dụng của từng loại thuốc</li>
                      <li>Tránh bỏ liều thuốc đã được kê</li>
                      <li>Thông báo cho bác sĩ nếu có bất kỳ tác dụng phụ nào</li>
                      <li>Lưu trữ thuốc ở nơi khô ráo, tránh ánh nắng trực tiếp</li>
                    </ul>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Tái khám</h3>
                  {selectedPrescription.status === 'Đang sử dụng' ? (
                    <div>
                      <p className="text-sm text-gray-700">
                        Bạn nên tái khám sau khi kết thúc liệu trình thuốc này để đánh giá hiệu quả điều trị.
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">
                      Bạn đã hoàn thành liệu trình thuốc này. Nếu cần thiết, hãy liên hệ với bác sĩ để được tư vấn thêm.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end rounded-b-lg">
              <button
                onClick={closeModal}
                className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition mr-2"
              >
                Đóng
              </button>
              <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Tải xuống PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientMedications;