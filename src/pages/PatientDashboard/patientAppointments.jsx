// src/pages/PatientAppointments/index.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Dữ liệu giả
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

const allAppointments = [
  {
    id: 1,
    date: "30/04/2025",
    time: "09:00",
    doctorName: "TS. BS. Trần Văn B",
    department: "Khoa Ung bướu",
    purpose: "Tư vấn kết quả xét nghiệm",
    status: "Sắp tới",
    location: "Phòng khám số 301, Tầng 3, Tòa nhà A",
    note: "Mang theo kết quả xét nghiệm gần nhất"
  },
  {
    id: 2,
    date: "10/05/2025",
    time: "14:30",
    doctorName: "BS. Lê Thị C",
    department: "Khoa Nội soi",
    purpose: "Nội soi phế quản",
    status: "Sắp tới",
    location: "Phòng thủ thuật số 102, Tầng 1, Tòa nhà B",
    note: "Nhịn ăn 6 giờ trước khi đến khám"
  },
  {
    id: 3,
    date: "15/04/2025",
    time: "10:15",
    doctorName: "TS. BS. Trần Văn B",
    department: "Khoa Ung bướu",
    purpose: "Khám định kỳ",
    status: "Đã hoàn thành",
    location: "Phòng khám số 301, Tầng 3, Tòa nhà A",
    note: ""
  },
  {
    id: 4,
    date: "01/04/2025",
    time: "11:00",
    doctorName: "BS. Lê Thị C",
    department: "Khoa Nội soi",
    purpose: "Nội soi phế quản",
    status: "Đã hủy",
    location: "Phòng thủ thuật số 102, Tầng 1, Tòa nhà B",
    note: "Hủy do bệnh nhân không thể tham gia"
  },
  {
    id: 5,
    date: "20/03/2025",
    time: "15:45",
    doctorName: "PGS. TS. Nguyễn Thị D",
    department: "Khoa Huyết học",
    purpose: "Tư vấn kết quả xét nghiệm máu",
    status: "Đã hoàn thành",
    location: "Phòng khám số 205, Tầng 2, Tòa nhà A",
    note: ""
  },
  {
    id: 6,
    date: "05/03/2025",
    time: "08:30",
    doctorName: "TS. BS. Trần Văn B",
    department: "Khoa Ung bướu",
    purpose: "Khám lần đầu",
    status: "Đã hoàn thành",
    location: "Phòng khám số 301, Tầng 3, Tòa nhà A",
    note: ""
  },
  {
    id: 7,
    date: "05/06/2025",
    time: "10:30",
    doctorName: "TS. BS. Hoàng Văn E",
    department: "Khoa Tim mạch",
    purpose: "Khám tim mạch định kỳ",
    status: "Chờ xác nhận",
    location: "Phòng khám số 401, Tầng 4, Tòa nhà A",
    note: "Cần xác nhận trước ngày 30/05/2025"
  }
];

// Danh sách các khoa
const departments = [
  "Tất cả",
  "Khoa Ung bướu",
  "Khoa Nội soi",
  "Khoa Huyết học",
  "Khoa Tim mạch",
  "Khoa Nội tiết",
  "Khoa Da liễu",
  "Khoa Thần kinh"
];

// Danh sách trạng thái
const statuses = [
  "Tất cả",
  "Sắp tới",
  "Chờ xác nhận",
  "Đã hoàn thành",
  "Đã hủy"
];

function PatientAppointments() {
  const [appointments, setAppointments] = useState(allAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(5);

  // Lọc lịch hẹn
  useEffect(() => {
    let filtered = allAppointments;
    
    // Lọc theo khoa
    if (departmentFilter !== 'Tất cả') {
      filtered = filtered.filter(appointment => appointment.department === departmentFilter);
    }
    
    // Lọc theo trạng thái
    if (statusFilter !== 'Tất cả') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }
    
    // Lọc theo tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(appointment => 
        appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.date.includes(searchTerm)
      );
    }
    
    setAppointments(filtered);
    setCurrentPage(1); // Reset về trang đầu tiên khi lọc
  }, [searchTerm, departmentFilter, statusFilter]);

  // Phân trang
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Hàm hiển thị chi tiết lịch hẹn
  const showAppointmentDetail = (appointment) => {
    setSelectedAppointment(appointment);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setSelectedAppointment(null);
    setShowNewAppointment(false);
  };

  // Hàm hiển thị form đặt lịch hẹn mới
  const showNewAppointmentForm = () => {
    setShowNewAppointment(true);
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
              <button 
                className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-700 transition flex items-center"
                onClick={showNewAppointmentForm}
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Đặt lịch hẹn mới
              </button>
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
              <h2 className="text-lg font-medium text-gray-800 mb-2 md:mb-0">Lịch hẹn khám bệnh</h2>
            </div>
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <label htmlFor="department-filter" className="text-sm font-medium text-gray-700">
                    Khoa:
                  </label>
                  <select
                    id="department-filter"
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    {departments.map((department, index) => (
                      <option key={index} value={department}>{department}</option>
                    ))}
                  </select>
                </div>
                
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
                    {statuses.map((status, index) => (
                      <option key={index} value={status}>{status}</option>
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
                  placeholder="Tìm theo bác sĩ, mục đích, ngày..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Danh sách lịch hẹn */}
          <div className="divide-y divide-gray-200">
            {currentAppointments.length > 0 ? (
              currentAppointments.map((appointment) => (
                <div key={appointment.id} 
                     className="p-4 hover:bg-blue-50 transition cursor-pointer"
                     onClick={() => showAppointmentDetail(appointment)}>
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-md font-medium text-gray-800">{appointment.date}</span>
                        <span className="ml-2 text-gray-600">{appointment.time}</span>
                      </div>
                      <h3 className="text-md font-medium text-gray-800 mt-1">
                        {appointment.purpose}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Bác sĩ: {appointment.doctorName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appointment.department} - {appointment.location}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 md:ml-4 md:text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appointment.status === 'Sắp tới' 
                          ? 'bg-blue-100 text-blue-800' 
                          : appointment.status === 'Chờ xác nhận'
                            ? 'bg-yellow-100 text-yellow-800'
                            : appointment.status === 'Đã hoàn thành'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                      {appointment.status === 'Sắp tới' && (
                        <div className="mt-2">
                          <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                            Xem chi tiết
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy lịch hẹn nào</h3>
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
                    Hiển thị <span className="font-medium">{indexOfFirstAppointment + 1}</span> đến <span className="font-medium">
                      {indexOfLastAppointment > appointments.length ? appointments.length : indexOfLastAppointment}
                    </span> trong <span className="font-medium">{appointments.length}</span> lịch hẹn
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

      {/* Chi tiết lịch hẹn (Modal) */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Chi tiết lịch hẹn</h2>
                  <p className="text-sm text-gray-500">Mã lịch hẹn: LH-{selectedAppointment.id.toString().padStart(4, '0')}</p>
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

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-lg font-medium text-gray-800">{selectedAppointment.date} | {selectedAppointment.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-medium text-gray-800">{selectedAppointment.purpose}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedAppointment.status === 'Sắp tới' 
                        ? 'bg-blue-100 text-blue-800' 
                        : selectedAppointment.status === 'Chờ xác nhận'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedAppointment.status === 'Đã hoàn thành'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">Thông tin bác sĩ</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">Bác sĩ:</span> {selectedAppointment.doctorName}
                    </p>
                    <p className="text-sm text-gray-800 mt-1">
                      <span className="font-medium">Khoa:</span> {selectedAppointment.department}
                    </p>
                    {selectedAppointment.status !== 'Đã hoàn thành' && selectedAppointment.status !== 'Đã hủy' && (
                      <button className="mt-2 text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Liên hệ bác sĩ
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">Địa điểm khám</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-800">{selectedAppointment.location}</p>
                  </div>
                </div>

                {selectedAppointment.note && (
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-2">Ghi chú</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-800">{selectedAppointment.note}</p>
                    </div>
                  </div>
                )}

                {selectedAppointment.status === 'Sắp tới' && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-yellow-800 mb-2">Lưu ý</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      <li>Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục</li>
                      <li>Mang theo giấy tờ tùy thân và thẻ bảo hiểm y tế (nếu có)</li>
                      <li>Mang theo các kết quả xét nghiệm, chẩn đoán trước đây (nếu có)</li>
                      {selectedAppointment.note && <li>{selectedAppointment.note}</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end rounded-b-lg">
              <button
                onClick={closeModal}
                className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition mr-2"
              >
                Đóng
              </button>
              {selectedAppointment.status === 'Sắp tới' && (
                <>
                  <button className="bg-yellow-500 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-yellow-600 transition mr-2">
                    Đổi lịch hẹn
                  </button>
                  <button className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-600 transition">
                    Hủy lịch hẹn
                  </button>
                </>
              )}
              {selectedAppointment.status === 'Chờ xác nhận' && (
                <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition">
                  Xác nhận lịch hẹn
                </button>
              )}
              {selectedAppointment.status === 'Đã hoàn thành' && (
                <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition">
                  Đặt lịch tái khám
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form đặt lịch hẹn mới (Modal) */}
      {showNewAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Đặt lịch hẹn mới</h2>
                  <p className="text-sm text-gray-500">Vui lòng điền đầy đủ thông tin dưới đây</p>
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

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                      Khoa
                    </label>
                    <select
                      id="department"
                      name="department"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Chọn khoa</option>
                      {departments.filter(dept => dept !== 'Tất cả').map((department, index) => (
                        <option key={index} value={department}>{department}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                      Bác sĩ
                    </label>
                    <select
                      id="doctor"
                      name="doctor"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Chọn bác sĩ</option>
                      <option value="1">TS. BS. Trần Văn B</option>
                      <option value="2">BS. Lê Thị C</option>
                      <option value="3">PGS. TS. Nguyễn Thị D</option>
                      <option value="4">TS. BS. Hoàng Văn E</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Ngày hẹn
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                      Thời gian
                    </label>
                    <select
                      id="time"
                      name="time"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Chọn giờ hẹn</option>
                      <option value="08:00">08:00</option>
                      <option value="08:30">08:30</option>
                      <option value="09:00">09:00</option>
                      <option value="09:30">09:30</option>
                      <option value="10:00">10:00</option>
                      <option value="10:30">10:30</option>
                      <option value="11:00">11:00</option>
                      <option value="13:30">13:30</option>
                      <option value="14:00">14:00</option>
                      <option value="14:30">14:30</option>
                      <option value="15:00">15:00</option>
                      <option value="15:30">15:30</option>
                      <option value="16:00">16:00</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                    Mục đích khám
                  </label>
                  <select
                    id="purpose"
                    name="purpose"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Chọn mục đích</option>
                    <option value="Khám lần đầu">Khám lần đầu</option>
                    <option value="Tái khám">Tái khám</option>
                    <option value="Tư vấn kết quả xét nghiệm">Tư vấn kết quả xét nghiệm</option>
                    <option value="Khám định kỳ">Khám định kỳ</option>
                    <option value="Thủ thuật">Thủ thuật</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                    Ghi chú
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    rows={3}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Vui lòng cung cấp thêm thông tin về tình trạng, triệu chứng hoặc yêu cầu đặc biệt..."
                  ></textarea>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg text-sm text-gray-700">
                  <p className="font-medium text-yellow-800">Lưu ý:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Lịch hẹn sẽ được xác nhận qua SMS hoặc email</li>
                    <li>Vui lòng đến trước giờ hẹn 15 phút</li>
                    <li>Có thể thay đổi hoặc hủy lịch hẹn trước 24 giờ</li>
                  </ul>
                </div>
              </form>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end rounded-b-lg">
              <button
                onClick={closeModal}
                className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition mr-2"
              >
                Hủy
              </button>
              <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Đặt lịch hẹn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientAppointments;