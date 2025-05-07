// src/pages/DoctorDashboard/sample/sampleList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

// Dữ liệu mẫu cho danh sách mẫu mô học
const mockSamples = [
  { 
    id: 101, 
    patientName: 'Nguyễn Văn A', 
    patientId: 'BN-0001',
    sampleType: 'Mô phổi', 
    dateCollected: '25/04/2025', 
    status: 'Chờ phân tích',
    image: '/CMU-3.jpg',
    fileName: 'CMU-3.svs'
  },
  { 
    id: 102, 
    patientName: 'Trần Thị B', 
    patientId: 'BN-0002',
    sampleType: 'Mô gan', 
    dateCollected: '24/04/2025', 
    status: 'Đang xử lý',
    image: '/CMU-2.jpg',
    fileName: 'SMU-2.svs'
  },
];

function SampleList() {
  const { currentUser } = useAuth();
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [typeFilter, setTypeFilter] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [samplesPerPage] = useState(10);

  // Lấy danh sách mẫu mô học (giả lập)
  useEffect(() => {
    const fetchSamples = async () => {
      try {
        setLoading(true);
        // Trong thực tế, đây sẽ là API call đến Firebase hoặc backend
        // Tạm thời sử dụng dữ liệu mẫu
        setTimeout(() => {
          setSamples(mockSamples);
          setError(null);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách mẫu mô học:", err);
        setError("Không thể tải danh sách mẫu mô học. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchSamples();
  }, [currentUser]);

  // Lọc mẫu mô học theo tìm kiếm và bộ lọc
  const filteredSamples = samples.filter(sample => {
    const matchesSearch = searchTerm === '' || 
      sample.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.sampleType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Tất cả' || sample.status === statusFilter;
    const matchesType = typeFilter === 'Tất cả' || sample.sampleType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Phân trang
  const indexOfLastSample = currentPage * samplesPerPage;
  const indexOfFirstSample = indexOfLastSample - samplesPerPage;
  const currentSamples = filteredSamples.slice(indexOfFirstSample, indexOfLastSample);
  const totalPages = Math.ceil(filteredSamples.length / samplesPerPage);

  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Danh sách các loại mẫu mô học
  const sampleTypes = ['Tất cả', 'Mô phổi', 'Mô gan', 'Mô vú', 'Mô tuyến giáp', 'Mô da'];
  
  // Danh sách trạng thái mẫu
  const sampleStatuses = ['Tất cả', 'Chờ phân tích', 'Đang xử lý', 'Đã phân tích'];

  return (
    <div className="bg-blue-50 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Danh sách mẫu mô học</h1>
            <Link
              to="/doctor/samples/upload"
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Tải lên mẫu mới
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Filter and Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
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
                    {sampleStatuses.map((status, index) => (
                      <option key={index}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label htmlFor="type-filter" className="text-sm font-medium text-gray-700">
                    Loại mẫu:
                  </label>
                  <select
                    id="type-filter"
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    {sampleTypes.map((type, index) => (
                      <option key={index}>{type}</option>
                    ))}
                  </select>
                </div>
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
                  placeholder="Tìm theo tên bệnh nhân, mã, loại mẫu..."
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
              <p className="mt-2 text-gray-600">Đang tải danh sách mẫu mô học...</p>
            </div>
          )}

          {/* Sample Table */}
          {!loading && (
            <>
              {currentSamples.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mã mẫu
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hình ảnh
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bệnh nhân
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loại mẫu
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày lấy mẫu
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên file
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
                      {currentSamples.map((sample) => (
                        <tr key={sample.id} className="hover:bg-blue-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                            MS-{sample.id.toString().padStart(4, '0')}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <img 
                              src={sample.image} 
                              alt={`Mẫu ${sample.sampleType}`} 
                              className="h-16 w-16 rounded-md object-cover border border-gray-200" 
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                            <div>
                              <p>{sample.patientName}</p>
                              <p className="text-xs text-gray-500">{sample.patientId}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                            {sample.sampleType}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {sample.dateCollected}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {sample.fileName}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              sample.status === 'Chờ phân tích' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : sample.status === 'Đang xử lý' 
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                            }`}>
                              {sample.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <Link to={`/doctor/samples/${sample.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                              Chi tiết
                            </Link>
                            <Link to={`/doctor/samples/${sample.id}/analyze`} className="text-green-600 hover:text-green-900">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy mẫu mô học nào</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Bắt đầu bằng cách tải lên mẫu mới hoặc thay đổi bộ lọc.
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
                    Hiển thị <span className="font-medium">{indexOfFirstSample + 1}</span> đến <span className="font-medium">
                      {indexOfLastSample > filteredSamples.length ? filteredSamples.length : indexOfLastSample}
                    </span> trong <span className="font-medium">{filteredSamples.length}</span> mẫu mô học
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

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <Link to="/doctor/samples/upload" className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Tải lên mẫu mới
          </Link>

          <Link to="/doctor/samples/bulk-upload" className="bg-green-600 text-white font-medium py-2 px-4 rounded-lg flex items-center hover:bg-green-700 transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
            </svg>
            Tải lên hàng loạt
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SampleList;