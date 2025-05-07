// src/pages/PatientTestResults/index.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Dữ liệu giả
const allTestResults = [
  {
    id: 1,
    sampleType: "Mô phổi",
    testDate: "25/04/2025",
    resultDate: "26/04/2025",
    status: "Đã có kết quả",
    result: "Phát hiện bất thường",
    doctorName: "TS. BS. Trần Văn B",
    department: "Khoa Ung bướu",
    doctorNote: "Phát hiện tế bào bất thường trong mô phổi, cần tiến hành xét nghiệm bổ sung.",
    confidence: "94%",
    image: "/CMU-3.jpg"
  },
  {
    id: 2,
    sampleType: "Mô gan",
    testDate: "20/04/2025",
    resultDate: "21/04/2025",
    status: "Đã có kết quả",
    result: "Bình thường",
    doctorName: "TS. BS. Trần Văn B",
    department: "Khoa Ung bướu",
    doctorNote: "Không phát hiện bất thường trong mẫu mô gan.",
    confidence: "97%",
    image: "/CMU-2.jpg"
  },
  {
    id: 3,
    sampleType: "Mô tuyến giáp",
    testDate: "15/04/2025",
    resultDate: "16/04/2025",
    status: "Đã có kết quả",
    result: "Phát hiện bất thường",
    doctorName: "PGS. TS. Lê Thị C",
    department: "Khoa Nội tiết",
    doctorNote: "Phát hiện nốt tuyến giáp nghi ngờ. Đề nghị tái khám sau 2 tuần.",
    confidence: "89%",
    image: "/CMU-3.jpg"
  },
  {
    id: 4,
    sampleType: "Mô vú",
    testDate: "10/04/2025",
    resultDate: "11/04/2025",
    status: "Đã có kết quả",
    result: "Bình thường",
    doctorName: "TS. BS. Trần Văn B",
    department: "Khoa Ung bướu",
    doctorNote: "Mẫu mô vú bình thường, không phát hiện dấu hiệu bất thường.",
    confidence: "98%",
    image: "/CMU-2.jpg"
  },
  {
    id: 5,
    sampleType: "Mô ruột",
    testDate: "05/04/2025",
    resultDate: "06/04/2025",
    status: "Đã có kết quả", 
    result: "Phát hiện bất thường",
    doctorName: "TS. BS. Nguyễn Thị D",
    department: "Khoa Tiêu hóa",
    doctorNote: "Phát hiện viêm ruột mạn tính, cần theo dõi và điều trị.",
    confidence: "92%",
    image: "/CMU-3.jpg"
  },
  {
    id: 6,
    sampleType: "Mô da",
    testDate: "01/04/2025",
    resultDate: "02/04/2025",
    status: "Đã có kết quả",
    result: "Bình thường",
    doctorName: "BS. Phạm Văn E",
    department: "Khoa Da liễu",
    doctorNote: "Mẫu mô da bình thường, không có dấu hiệu bất thường.",
    confidence: "96%",
    image: "/CMU-2.jpg"
  },
  {
    id: 7,
    sampleType: "Mô tuyến tiền liệt",
    testDate: "25/03/2025",
    resultDate: "26/03/2025",
    status: "Đã có kết quả",
    result: "Bình thường",
    doctorName: "PGS. TS. Võ Văn F",
    department: "Khoa Niệu",
    doctorNote: "Mô tuyến tiền liệt bình thường, không có dấu hiệu bất thường.",
    confidence: "95%",
    image: "/CMU-3.jpg"
  },
  {
    id: 8,
    sampleType: "Mô lympho",
    testDate: "28/04/2025",
    resultDate: "",
    status: "Đang xử lý",
    result: "",
    doctorName: "TS. BS. Trần Văn B",
    department: "Khoa Ung bướu",
    doctorNote: "",
    confidence: "",
    image: "/CMU-2.jpg"
  },
  {
    id: 9,
    sampleType: "Mô tủy xương",
    testDate: "27/04/2025",
    resultDate: "",
    status: "Đang xử lý",
    result: "",
    doctorName: "TS. BS. Hoàng Thị G",
    department: "Khoa Huyết học",
    doctorNote: "",
    confidence: "",
    image: "/CMU-3.jpg"
  }
];

// Thông tin bệnh nhân
const patientInfo = {
  id: "BN-2023-045",
  name: "Nguyễn Văn A",
  age: 45,
  gender: "Nam",
  phone: "0901234567",
  email: "nguyenvana@email.com",
  address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
  doctorName: "TS. BS. Trần Văn B",
  department: "Khoa Ung bướu"
};

function PatientTestResults() {
  const [testResults, setTestResults] = useState(allTestResults);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [resultFilter, setResultFilter] = useState('Tất cả');
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(5);

  // Lọc kết quả xét nghiệm
  useEffect(() => {
    let filtered = allTestResults;
    
    // Lọc theo trạng thái
    if (statusFilter !== 'Tất cả') {
      filtered = filtered.filter(test => test.status === statusFilter);
    }
    
    // Lọc theo kết quả
    if (resultFilter !== 'Tất cả') {
      filtered = filtered.filter(test => test.result === resultFilter);
    }
    
    // Lọc theo tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(test => 
        test.sampleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (test.doctorNote && test.doctorNote.toLowerCase().includes(searchTerm.toLowerCase())) ||
        test.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setTestResults(filtered);
    setCurrentPage(1); // Reset về trang đầu tiên khi lọc
  }, [searchTerm, statusFilter, resultFilter]);

  // Phân trang
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = testResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(testResults.length / resultsPerPage);

  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Hàm hiển thị modal chi tiết
  const showTestDetail = (test) => {
    setSelectedTest(test);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setSelectedTest(null);
  };

  return (
    <div className="bg-blue-50 min-h-screen pb-10">
      {/* Patient Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl mr-4">
                {patientInfo.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{patientInfo.name}</h1>
                <p className="text-sm text-gray-500">
                  Mã BN: {patientInfo.id} | {patientInfo.age} tuổi | {patientInfo.gender}
                </p>
                <p className="text-sm text-gray-500">
                  Bác sĩ phụ trách: {patientInfo.doctorName}
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
              <h2 className="text-lg font-medium text-gray-800 mb-2 md:mb-0">Kết quả xét nghiệm</h2>
            </div>
            
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
                    <option>Tất cả</option>
                    <option>Đã có kết quả</option>
                    <option>Đang xử lý</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label htmlFor="result-filter" className="text-sm font-medium text-gray-700">
                    Kết quả:
                  </label>
                  <select
                    id="result-filter"
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={resultFilter}
                    onChange={(e) => setResultFilter(e.target.value)}
                  >
                    <option>Tất cả</option>
                    <option>Bình thường</option>
                    <option>Phát hiện bất thường</option>
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
                  placeholder="Tìm theo loại mẫu, bác sĩ, ghi chú..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Danh sách kết quả xét nghiệm */}
          <div className="divide-y divide-gray-200">
            {currentResults.length > 0 ? (
              currentResults.map((test) => (
                <div key={test.id} 
                     className="p-4 hover:bg-blue-50 transition cursor-pointer"
                     onClick={() => showTestDetail(test)}>
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-32 md:h-20 mb-4 md:mb-0 md:mr-4 flex-shrink-0">
                      <img 
                        src={test.image} 
                        alt={`Mẫu ${test.sampleType}`} 
                        className="w-full h-full object-cover rounded-md border border-gray-200" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-md font-medium text-gray-800">
                            {test.sampleType}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Ngày xét nghiệm: {test.testDate}
                            {test.resultDate && ` | Ngày có kết quả: ${test.resultDate}`}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0 flex flex-col sm:items-end">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium h-fit ${
                            test.status === 'Đã có kết quả' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {test.status}
                          </span>
                          {test.result && (
                            <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              test.result === 'Bình thường' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {test.result}
                            </span>
                          )}
                          {test.confidence && (
                            <span className="mt-1 text-xs text-gray-500">
                              Độ tin cậy: {test.confidence}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-700">
                          Bác sĩ: {test.doctorName} - {test.department}
                        </p>
                        {test.doctorNote && (
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {test.doctorNote}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy kết quả xét nghiệm nào</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Thử thay đổi bộ lọc hoặc điều kiện tìm kiếm
                </p>
              </div>
            )}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
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
                    Hiển thị <span className="font-medium">{indexOfFirstResult + 1}</span> đến <span className="font-medium">
                      {indexOfLastResult > testResults.length ? testResults.length : indexOfLastResult}
                    </span> trong <span className="font-medium">{testResults.length}</span> kết quả
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

      {/* Chi tiết kết quả xét nghiệm (Modal) */}
      {selectedTest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-90vh overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedTest.sampleType}</h2>
                  <p className="text-sm text-gray-500">
                    Ngày xét nghiệm: {selectedTest.testDate} 
                    {selectedTest.resultDate && ` | Ngày có kết quả: ${selectedTest.resultDate}`}
                  </p>
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

              {selectedTest.status === "Đang xử lý" ? (
                <div className="text-center py-8">
                  <div className="animate-pulse inline-block">
                    <svg className="h-12 w-12 text-yellow-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Mẫu đang được xử lý</h3>
                  <p className="mt-1 text-gray-500">
                    Kết quả xét nghiệm của bạn đang được phân tích. Vui lòng kiểm tra lại sau.
                  </p>
                  <p className="mt-4 text-sm text-blue-600">
                    Thời gian dự kiến có kết quả: 1-2 ngày làm việc
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <img 
                        src={selectedTest.image} 
                        alt={selectedTest.sampleType} 
                        className="w-full h-auto rounded-lg border border-gray-200" 
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Kết quả</h3>
                      <div className="mb-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                          selectedTest.result === 'Bình thường' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedTest.result}
                        </span>
                        {selectedTest.confidence && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            Độ tin cậy: {selectedTest.confidence}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">
                        {selectedTest.doctorNote}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">Thông tin bác sĩ</h3>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Bác sĩ phụ trách:</span> {selectedTest.doctorName}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Khoa:</span> {selectedTest.department}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Khuyến nghị</h3>
                      <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        {selectedTest.result === 'Bình thường' ? (
                          <>
                            <li>Tiếp tục kiểm tra định kỳ mỗi 6 tháng</li>
                            <li>Duy trì chế độ ăn uống và sinh hoạt lành mạnh</li>
                            <li>Thông báo cho bác sĩ nếu có triệu chứng bất thường</li>
                          </>
                        ) : (
                          <>
                            <li>Đặt lịch tái khám trong vòng 2 tuần</li>
                            <li>Thực hiện thêm các xét nghiệm bổ sung</li>
                            <li>Tuân thủ đơn thuốc được kê</li>
                            <li>Báo cáo ngay cho bác sĩ nếu có triệu chứng mới</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end rounded-b-lg">
              <button
                onClick={closeModal}
                className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition mr-2"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientTestResults;