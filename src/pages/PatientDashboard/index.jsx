// src/pages/PatientDashboard/index.jsx
import { useState } from 'react';
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

const testResults = [
  {
    id: 1,
    sampleType: "Mô phổi",
    testDate: "25/04/2025",
    resultDate: "26/04/2025",
    status: "Đã có kết quả",
    result: "Phát hiện bất thường",
    doctorNote: "Phát hiện tế bào bất thường trong mô phổi, cần tiến hành xét nghiệm bổ sung.",
    image: "/CMU-3.jpg"
  },
  {
    id: 2,
    sampleType: "Mô gan",
    testDate: "20/04/2025",
    resultDate: "21/04/2025",
    status: "Đã có kết quả",
    result: "Bình thường",
    doctorNote: "Không phát hiện bất thường trong mẫu mô gan.",
    image: "/CMU-2.jpg"
  },
  {
    id: 3,
    sampleType: "Mô tuyến giáp",
    testDate: "15/04/2025",
    resultDate: "16/04/2025",
    status: "Đã có kết quả",
    result: "Phát hiện bất thường",
    doctorNote: "Phát hiện nốt tuyến giáp nghi ngờ. Đề nghị tái khám sau 2 tuần.",
    image: "/CMU-3.jpg"
  }
];

const upcomingAppointments = [
  {
    id: 1,
    date: "30/04/2025",
    time: "09:00",
    doctorName: "TS. BS. Trần Văn B",
    department: "Khoa Ung bướu",
    purpose: "Tư vấn kết quả xét nghiệm"
  },
  {
    id: 2,
    date: "10/05/2025",
    time: "14:30",
    doctorName: "BS. Lê Thị C",
    department: "Khoa Nội soi",
    purpose: "Nội soi phế quản"
  }
];

const medications = [
  {
    id: 1,
    name: "Paracetamol",
    dosage: "500mg",
    frequency: "3 lần/ngày",
    startDate: "26/04/2025",
    endDate: "03/05/2025",
    note: "Uống sau ăn"
  },
  {
    id: 2,
    name: "Amoxicillin",
    dosage: "250mg",
    frequency: "2 lần/ngày",
    startDate: "26/04/2025",
    endDate: "05/05/2025",
    note: "Uống trước ăn 30 phút"
  }
];

function PatientDashboard() {
  const [selectedTest, setSelectedTest] = useState(null);

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
              <button className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-200 transition flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Liên hệ bác sĩ
              </button>
              <button className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-700 transition flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Đặt lịch hẹn
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patient Info Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Thông tin cá nhân</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Họ tên</p>
                  <p className="text-sm text-gray-800">{patientInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tuổi</p>
                  <p className="text-sm text-gray-800">{patientInfo.age}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Giới tính</p>
                  <p className="text-sm text-gray-800">{patientInfo.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                  <p className="text-sm text-gray-800">{patientInfo.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-800">{patientInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                  <p className="text-sm text-gray-800">{patientInfo.address}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Bác sĩ phụ trách</h3>
                <p className="text-sm text-gray-800">{patientInfo.doctorName}</p>
                <p className="text-sm text-gray-500">{patientInfo.department}</p>
              </div>
              <div className="mt-4">
                <Link
                  to="/patient/profile"
                  className="text-blue-600 text-sm font-medium hover:text-blue-800"
                >
                  Cập nhật thông tin →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Recent Results */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Kết quả xét nghiệm gần đây</h2>
                <Link
                  to="/patient/results"
                  className="text-blue-600 text-sm font-medium hover:text-blue-800"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="space-y-4">
                {testResults.slice(0, 2).map((test) => (
                  <div 
                    key={test.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer"
                    onClick={() => setSelectedTest(test)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-md font-medium text-gray-800">
                          {test.sampleType}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Ngày xét nghiệm: {test.testDate}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium h-fit ${
                        test.result === 'Bình thường' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {test.result}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {test.doctorNote}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Lịch hẹn sắp tới</h2>
                <Link
                  to="/patient/appointments"
                  className="text-blue-600 text-sm font-medium hover:text-blue-800"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-md font-medium text-gray-800">{appointment.date}</span>
                          <span className="ml-2 text-sm text-gray-600">{appointment.time}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700 mt-1">
                          {appointment.doctorName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.department}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {appointment.purpose}
                        </span>
                        <div className="mt-2">
                          <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                            Chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Đơn thuốc hiện tại</h2>
                <Link
                  to="/patient/medications"
                  className="text-blue-600 text-sm font-medium hover:text-blue-800"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thuốc
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {medications.map((med) => (
                      <tr key={med.id} className="hover:bg-gray-50">
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
                          {med.startDate} - {med.endDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Buttons */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/patient/appointments/new" className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Đặt lịch hẹn mới
          </Link>
          <Link to="/patient/messages/doctor" className="bg-green-600 text-white font-medium py-2 px-4 rounded-lg flex items-center hover:bg-green-700 transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Nhắn tin cho bác sĩ
          </Link>
          <Link to="/patient/results/upload" className="bg-purple-600 text-white font-medium py-2 px-4 rounded-lg flex items-center hover:bg-purple-700 transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Tải lên kết quả
          </Link>
        </div>
      </div>

      {/* Test Result Detail Modal */}
      {selectedTest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-90vh overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedTest.sampleType}</h2>
                  <p className="text-sm text-gray-500">
                    Ngày xét nghiệm: {selectedTest.testDate} | Ngày có kết quả: {selectedTest.resultDate}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedTest(null)} 
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <img 
                      src={selectedTest.image} 
                      alt={selectedTest.sampleType} 
                      className="w-full h-auto rounded-lg" 
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
                      <span className="font-medium">Bác sĩ phụ trách:</span> {patientInfo.doctorName}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Khoa:</span> {patientInfo.department}
                    </p>
                    <button className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Liên hệ bác sĩ
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Khuyến nghị</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      {selectedTest.result === 'Bình thường' ? (
                        <>
                          <li>Tiếp tục kiểm tra định kỳ mỗi 6 tháng</li>
                          <li>Duy trì chế độ ăn uống và sinh hoạt lành mạnh</li>
                        </>
                      ) : (
                        <>
                          <li>Đặt lịch tái khám trong vòng 2 tuần</li>
                          <li>Thực hiện thêm các xét nghiệm bổ sung</li>
                          <li>Tuân thủ đơn thuốc được kê</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Tải xuống & Chia sẻ</h3>
                    <div className="flex space-x-3">
                      <button className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-700 transition flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Tải PDF
                      </button>
                      <button className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-200 transition flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Chia sẻ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;