// src/pages/DoctorDashboard/patientList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  getDoctorPatients, 
  filterPatientsByStatus, 
  searchPatients 
} from '../../../firebase/services/patientService';

function PatientList() {
  const { currentUser, userProfile } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(8);

  // Lấy danh sách bệnh nhân từ Firebase
  useEffect(() => {
    const fetchPatients = async () => {
      if (!currentUser?.uid) return;
      
      try {
        setLoading(true);
        let patientsList;
        
        if (statusFilter === 'Tất cả') {
          patientsList = await getDoctorPatients(currentUser.uid);
        } else {
          patientsList = await filterPatientsByStatus(currentUser.uid, statusFilter);
        }
        
        setPatients(patientsList);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách bệnh nhân:", err);
        setError("Không thể tải danh sách bệnh nhân. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [currentUser, statusFilter]);

  // Xử lý tìm kiếm
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchTerm || !currentUser?.uid) {
        // Nếu không có từ khóa tìm kiếm, tải lại danh sách ban đầu
        const fetchInitialPatients = async () => {
          if (statusFilter === 'Tất cả') {
            const patientsList = await getDoctorPatients(currentUser.uid);
            setPatients(patientsList);
          } else {
            const patientsList = await filterPatientsByStatus(currentUser.uid, statusFilter);
            setPatients(patientsList);
          }
        };
        
        fetchInitialPatients();
        return;
      }

      try {
        setLoading(true);
        const results = await searchPatients(currentUser.uid, searchTerm);
        setPatients(results);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tìm kiếm bệnh nhân:", err);
        setError("Không thể tìm kiếm bệnh nhân. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    // Sử dụng debounce để tránh gọi API quá nhiều
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentUser]);

  // Phân trang
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(patients.length / patientsPerPage);

  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-blue-50 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Danh sách bệnh nhân</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Filter and Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
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
                  <option>Đang điều trị</option>
                  <option>Theo dõi</option>
                  <option>Mới</option>
                  <option>Hoàn thành</option>
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
                  placeholder="Tìm theo tên, điện thoại, chẩn đoán..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 text-red-600 border-b border-gray-200">
              <p>{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Đang tải danh sách bệnh nhân...</p>
            </div>
          )}

          {/* Patient Table */}
          {!loading && (
            <>
              {patients.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mã BN
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Họ tên
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tuổi
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giới tính
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Điện thoại
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Khám gần nhất
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chẩn đoán
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
                      {currentPatients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-blue-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                            {patient.patientId || `BN-${patient.id.substring(0, 6)}`}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                            {patient.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {patient.age || '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {patient.gender || '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {patient.phone || '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {patient.lastVisit || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                            {patient.diagnosis || '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <Link to={`/doctor/patients/${patient.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                              Chi tiết
                              </Link>
                            <Link to={`/doctor/patients/${patient.id}/analyze`} className="text-green-600 hover:text-green-900">
                              Phân tích
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy bệnh nhân nào</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Bắt đầu bằng cách thêm bệnh nhân mới hoặc thay đổi bộ lọc.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
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
                    Hiển thị <span className="font-medium">{indexOfFirstPatient + 1}</span> đến <span className="font-medium">
                      {indexOfLastPatient > patients.length ? patients.length : indexOfLastPatient}
                    </span> trong <span className="font-medium">{patients.length}</span> bệnh nhân
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
                    
                    {/* Page numbers */}
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

        {/* Add Patient Buttons */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <Link to="/doctor/patients/new" className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm bệnh nhân mới
          </Link>

          <Link to="/doctor/patients/link" className="bg-green-600 text-white font-medium py-2 px-4 rounded-lg flex items-center hover:bg-green-700 transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
            </svg>
            Liên kết với bệnh nhân có sẵn
          </Link>
        </div>

        {/* Additional Buttons */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          <Link to="/doctor/patients/import" className="bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg flex items-center hover:bg-indigo-700 transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
            </svg>
            Nhập danh sách
          </Link>
          <button className="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg flex items-center hover:bg-blue-600 transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Xuất danh sách
          </button>
          <Link to="/doctor/patients/stats" className="bg-purple-600 text-white font-medium py-2 px-4 rounded-lg flex items-center hover:bg-purple-700 transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Thống kê
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PatientList;