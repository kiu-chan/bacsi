// src/pages/PatientHealth/index.jsx
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

// Dữ liệu sức khỏe mẫu
const healthRecords = {
  vitalSigns: [
    {
      id: 1,
      date: "28/04/2025",
      bloodPressure: "125/85",
      heartRate: 75,
      bodyTemperature: 36.5,
      bloodSugar: 5.4,
      weight: 68,
      height: 172,
      bmi: 23.0,
      notes: "Khám định kỳ, các chỉ số ổn định"
    },
    {
      id: 2,
      date: "15/03/2025",
      bloodPressure: "130/86",
      heartRate: 78,
      bodyTemperature: 36.7,
      bloodSugar: 5.6,
      weight: 69,
      height: 172,
      bmi: 23.3,
      notes: "Huyết áp hơi cao một chút, cần lưu ý chế độ ăn ít muối"
    },
    {
      id: 3,
      date: "05/02/2025",
      bloodPressure: "135/90",
      heartRate: 82,
      bodyTemperature: 36.9,
      bloodSugar: 6.1,
      weight: 70,
      height: 172,
      bmi: 23.7,
      notes: "Huyết áp cao, đường huyết tăng nhẹ, cần kiểm soát chế độ ăn"
    }
  ],
  bloodTests: [
    {
      id: 1,
      date: "28/04/2025",
      complete: true,
      results: {
        hematocrit: { value: 45, unit: "%", normal: "41-50" },
        hemoglobin: { value: 15.2, unit: "g/dL", normal: "13.5-17.5" },
        platelets: { value: 250, unit: "10^3/μL", normal: "150-450" },
        wbc: { value: 7.2, unit: "10^3/μL", normal: "4.5-11.0" },
        rbc: { value: 5.1, unit: "10^6/μL", normal: "4.5-5.9" },
        totalCholesterol: { value: 195, unit: "mg/dL", normal: "<200" },
        ldl: { value: 128, unit: "mg/dL", normal: "<130" },
        hdl: { value: 45, unit: "mg/dL", normal: ">40" },
        triglycerides: { value: 150, unit: "mg/dL", normal: "<150" },
        glucose: { value: 98, unit: "mg/dL", normal: "70-100" }
      }
    },
    {
      id: 2,
      date: "05/02/2025",
      complete: true,
      results: {
        hematocrit: { value: 44, unit: "%", normal: "41-50" },
        hemoglobin: { value: 15.0, unit: "g/dL", normal: "13.5-17.5" },
        platelets: { value: 240, unit: "10^3/μL", normal: "150-450" },
        wbc: { value: 7.8, unit: "10^3/μL", normal: "4.5-11.0" },
        rbc: { value: 5.0, unit: "10^6/μL", normal: "4.5-5.9" },
        totalCholesterol: { value: 210, unit: "mg/dL", normal: "<200" },
        ldl: { value: 135, unit: "mg/dL", normal: "<130" },
        hdl: { value: 42, unit: "mg/dL", normal: ">40" },
        triglycerides: { value: 165, unit: "mg/dL", normal: "<150" },
        glucose: { value: 105, unit: "mg/dL", normal: "70-100" }
      }
    }
  ],
  vaccinations: [
    {
      id: 1,
      name: "Vắc-xin cúm",
      date: "15/10/2024",
      provider: "TS. BS. Lê Thị D",
      dueDate: "15/10/2025",
      notes: "Tiêm nhắc hàng năm"
    },
    {
      id: 2,
      name: "Vắc-xin viêm phổi",
      date: "10/09/2023",
      provider: "BS. Nguyễn Văn E",
      dueDate: "10/09/2028",
      notes: "Tiêm nhắc sau 5 năm"
    },
    {
      id: 3,
      name: "Vắc-xin uốn ván",
      date: "05/05/2020",
      provider: "BS. Trần Thị F",
      dueDate: "05/05/2030",
      notes: "Tiêm nhắc sau 10 năm"
    }
  ],
  allergies: [
    {
      id: 1,
      allergen: "Penicillin",
      severity: "Trung bình",
      reaction: "Phát ban, ngứa",
      diagnosed: "2018",
      notes: "Tránh sử dụng các kháng sinh nhóm Penicillin"
    }
  ],
  lifestyle: {
    smoking: "Không",
    alcohol: "Thỉnh thoảng",
    exercise: "3 lần/tuần (đi bộ, bơi)",
    diet: "Ăn nhiều rau, ít đường, thỉnh thoảng ăn thịt đỏ",
    sleep: "6-7 giờ/ngày"
  },
  riskFactors: [
    {
      id: 1,
      factor: "Tăng huyết áp",
      status: "Được kiểm soát với thuốc",
      notes: "Cần uống thuốc đều đặn và theo dõi huyết áp"
    },
    {
      id: 2,
      factor: "Tiền sử gia đình có bệnh tim mạch",
      status: "Đang theo dõi",
      notes: "Cha bị nhồi máu cơ tim ở tuổi 60"
    }
  ],
  recommendations: [
    {
      id: 1,
      category: "Chế độ ăn",
      detail: "Giảm muối, tăng cường rau xanh và trái cây, hạn chế thịt đỏ và thực phẩm chế biến sẵn",
      doctor: "TS. BS. Trần Văn B",
      date: "28/04/2025"
    },
    {
      id: 2,
      category: "Tập thể dục",
      detail: "Duy trì tập 30 phút mỗi ngày, tối thiểu 5 ngày/tuần",
      doctor: "BS. Lê Thị D",
      date: "28/04/2025"
    },
    {
      id: 3,
      category: "Kiểm tra định kỳ",
      detail: "Theo dõi huyết áp hàng tuần và ghi chép lại kết quả",
      doctor: "TS. BS. Trần Văn B",
      date: "28/04/2025"
    }
  ]
};

// Dữ liệu các bài viết sức khỏe
const healthArticles = [
  {
    id: 1,
    title: "5 Cách giảm huyết áp tự nhiên không cần thuốc",
    description: "Tìm hiểu các phương pháp tự nhiên để kiểm soát huyết áp cao thông qua chế độ ăn uống, tập luyện và thư giãn.",
    image: "/api/placeholder/300/200",
    date: "20/04/2025",
    author: "TS. BS. Nguyễn Văn G, Chuyên gia Tim mạch",
    category: "Sức khỏe tim mạch"
  },
  {
    id: 2,
    title: "Vai trò của chế độ ăn Địa Trung Hải với sức khỏe tim mạch",
    description: "Chế độ ăn Địa Trung Hải được chứng minh có nhiều lợi ích cho sức khỏe tim mạch và ngăn ngừa nhiều bệnh mãn tính.",
    image: "/api/placeholder/300/200",
    date: "15/04/2025",
    author: "TS. BS. Lê Thị H, Chuyên gia Dinh dưỡng",
    category: "Dinh dưỡng"
  },
  {
    id: 3,
    title: "Tất cả những gì bạn cần biết về tiểu đường",
    description: "Hướng dẫn toàn diện về bệnh tiểu đường: nguyên nhân, triệu chứng, phòng ngừa và kiểm soát.",
    image: "/api/placeholder/300/200",
    date: "10/04/2025",
    author: "PGS. TS. Trần Thị I, Nội tiết học",
    category: "Tiểu đường"
  },
  {
    id: 4,
    title: "Tập thể dục nào tốt nhất cho người trung niên?",
    description: "Các bài tập an toàn và hiệu quả cho người trên 40 tuổi để duy trì sức khỏe và ngăn ngừa bệnh tật.",
    image: "/api/placeholder/300/200",
    date: "05/04/2025",
    author: "ThS. Phạm Văn K, Chuyên gia Vật lý trị liệu",
    category: "Thể dục"
  },
  {
    id: 5,
    title: "Chìa khóa để ngủ ngon: 7 thói quen trước khi đi ngủ",
    description: "Cải thiện chất lượng giấc ngủ với các thói quen đơn giản nhưng hiệu quả mỗi tối.",
    image: "/api/placeholder/300/200",
    date: "01/04/2025",
    author: "TS. BS. Lê Văn L, Chuyên khoa Thần kinh",
    category: "Giấc ngủ"
  }
];

function PatientHealth() {
  const [selectedSection, setSelectedSection] = useState('overview');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showBloodTestDetail, setShowBloodTestDetail] = useState(false);
  const [selectedBloodTest, setSelectedBloodTest] = useState(null);

  // Xử lý xem chi tiết bài viết
  const showArticleDetail = (article) => {
    setSelectedArticle(article);
  };

  // Đóng modal chi tiết bài viết
  const closeArticleModal = () => {
    setSelectedArticle(null);
  };

  // Xử lý xem chi tiết xét nghiệm máu
  const showBloodTestDetailModal = (test) => {
    setSelectedBloodTest(test);
    setShowBloodTestDetail(true);
  };

  // Đóng modal chi tiết xét nghiệm máu
  const closeBloodTestDetailModal = () => {
    setShowBloodTestDetail(false);
    setSelectedBloodTest(null);
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

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-3 text-sm font-medium ${selectedSection === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
              onClick={() => setSelectedSection('overview')}
            >
              Tổng quan
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${selectedSection === 'vitalSigns' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
              onClick={() => setSelectedSection('vitalSigns')}
            >
              Chỉ số sức khỏe
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${selectedSection === 'bloodTests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
              onClick={() => setSelectedSection('bloodTests')}
            >
              Xét nghiệm máu
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${selectedSection === 'vaccinations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
              onClick={() => setSelectedSection('vaccinations')}
            >
              Tiêm chủng
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${selectedSection === 'allergies' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
              onClick={() => setSelectedSection('allergies')}
            >
              Dị ứng
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${selectedSection === 'lifestyle' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
              onClick={() => setSelectedSection('lifestyle')}
            >
              Lối sống
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${selectedSection === 'articles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
              onClick={() => setSelectedSection('articles')}
            >
              Bài viết sức khỏe
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        {/* Tổng quan */}
        {selectedSection === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Thông tin tóm tắt */}
            <div className="col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin sức khỏe tổng quan</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-3">Chỉ số quan trọng gần nhất</h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Huyết áp:</span>
                        <span className="text-sm font-medium text-gray-800">{healthRecords.vitalSigns[0].bloodPressure} mmHg</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Nhịp tim:</span>
                        <span className="text-sm font-medium text-gray-800">{healthRecords.vitalSigns[0].heartRate} bpm</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Đường huyết:</span>
                        <span className="text-sm font-medium text-gray-800">{healthRecords.vitalSigns[0].bloodSugar} mmol/L</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Cân nặng:</span>
                        <span className="text-sm font-medium text-gray-800">{healthRecords.vitalSigns[0].weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">BMI:</span>
                        <span className="text-sm font-medium text-gray-800">{healthRecords.vitalSigns[0].bmi}</span>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">Cập nhật: {healthRecords.vitalSigns[0].date}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-3">Yếu tố nguy cơ</h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                      {healthRecords.riskFactors.map((factor) => (
                        <div key={factor.id} className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">{factor.factor}:</span>
                            <span className={`text-sm font-medium ${factor.status.includes('kiểm soát') ? 'text-green-600' : 'text-yellow-600'}`}>
                              {factor.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{factor.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-700 mb-3">Khuyến nghị từ bác sĩ</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    {healthRecords.recommendations.map((rec) => (
                      <div key={rec.id} className="mb-3 pb-3 border-b border-blue-100 last:border-0 last:mb-0 last:pb-0">
                        <div className="flex items-start">
                          <div className="mr-3">
                            {rec.category === 'Chế độ ăn' ? (
                              <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            ) : rec.category === 'Tập thể dục' ? (
                              <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-800">{rec.category}</h4>
                            <p className="text-sm text-gray-600 mt-1">{rec.detail}</p>
                            <div className="mt-1 text-xs text-gray-500">Bác sĩ: {rec.doctor} - {rec.date}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Lịch sử đo lường</h2>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3">Ngày</th>
                        <th scope="col" className="px-4 py-3">Huyết áp</th>
                        <th scope="col" className="px-4 py-3">Nhịp tim</th>
                        <th scope="col" className="px-4 py-3">Đường huyết</th>
                        <th scope="col" className="px-4 py-3">Cân nặng</th>
                        <th scope="col" className="px-4 py-3">BMI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthRecords.vitalSigns.map((record) => (
                        <tr key={record.id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{record.date}</td>
                          <td className="px-4 py-3">{record.bloodPressure} mmHg</td>
                          <td className="px-4 py-3">{record.heartRate} bpm</td>
                          <td className="px-4 py-3">{record.bloodSugar} mmol/L</td>
                          <td className="px-4 py-3">{record.weight} kg</td>
                          <td className="px-4 py-3">{record.bmi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-md font-medium text-gray-700 mb-3">Tiêm chủng sắp tới</h3>
                <div className="space-y-3">
                  {healthRecords.vaccinations.map((vac) => (
                    <div key={vac.id} className="bg-blue-50 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-gray-800">{vac.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Hạn tiêm nhắc: {vac.dueDate}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-md font-medium text-gray-700 mb-3">Lối sống</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Hút thuốc: {healthRecords.lifestyle.smoking}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Rượu bia: {healthRecords.lifestyle.alcohol}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Tập thể dục: {healthRecords.lifestyle.exercise}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Chế độ ăn: {healthRecords.lifestyle.diet}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Giấc ngủ: {healthRecords.lifestyle.sleep}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-md font-medium text-gray-700 mb-3">Dị ứng</h3>
                {healthRecords.allergies.length > 0 ? (
                  <div className="space-y-3">
                    {healthRecords.allergies.map((allergy) => (
                      <div key={allergy.id} className="bg-red-50 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-red-700">{allergy.allergen}</h4>
                        <p className="text-xs text-gray-700 mt-1">Mức độ: {allergy.severity}</p>
                        <p className="text-xs text-gray-700">Phản ứng: {allergy.reaction}</p>
                        <p className="text-xs text-gray-500 mt-1">{allergy.notes}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Không có dị ứng nào được ghi nhận</p>
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-md font-medium text-gray-700 mb-3">Bài viết đề xuất</h3>
                <div className="space-y-3">
                  {healthArticles.slice(0, 2).map((article) => (
                    <div key={article.id} 
                         className="bg-blue-50 rounded-lg p-3 cursor-pointer hover:bg-blue-100 transition"
                         onClick={() => showArticleDetail(article)}>
                      <h4 className="text-sm font-medium text-gray-800">{article.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">Danh mục: {article.category}</p>
                    </div>
                  ))}
                  <button
                    onClick={() => setSelectedSection('articles')}
                    className="text-sm text-blue-600 font-medium hover:text-blue-800 transition"
                  >
                    Xem tất cả bài viết →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chỉ số sức khỏe */}
        {selectedSection === 'vitalSigns' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Chỉ số sức khỏe</h2>
            
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-700 mb-4">Ghi chép chỉ số sức khỏe mới</h3>
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="blood-pressure" className="block text-sm font-medium text-gray-700 mb-1">
                      Huyết áp (mmHg)
                    </label>
                    <input
                      type="text"
                      id="blood-pressure"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="120/80"
                    />
                  </div>
                  <div>
                    <label htmlFor="heart-rate" className="block text-sm font-medium text-gray-700 mb-1">
                      Nhịp tim (bpm)
                    </label>
                    <input
                      type="number"
                      id="heart-rate"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="70"
                    />
                  </div>
                  <div>
                    <label htmlFor="body-temperature" className="block text-sm font-medium text-gray-700 mb-1">
                      Nhiệt độ cơ thể (°C)
                    </label>
                    <input
                      type="number"
                      id="body-temperature"
                      step="0.1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="36.5"
                    />
                  </div>
                  <div>
                    <label htmlFor="blood-sugar" className="block text-sm font-medium text-gray-700 mb-1">
                      Đường huyết (mmol/L)
                    </label>
                    <input
                      type="number"
                      id="blood-sugar"
                      step="0.1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="5.5"
                    />
                  </div>
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                      Cân nặng (kg)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      step="0.1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="68"
                    />
                  </div>
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                      Chiều cao (cm)
                    </label>
                    <input
                      type="number"
                      id="height"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="172"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    id="notes"
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Ghi chú về tình trạng sức khỏe, triệu chứng, hoặc các thông tin khác"
                  ></textarea>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    Lưu thông tin
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">Lịch sử chỉ số sức khỏe</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Huyết áp (mmHg)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nhịp tim (bpm)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nhiệt độ (°C)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đường huyết (mmol/L)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cân nặng (kg)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        BMI
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ghi chú
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {healthRecords.vitalSigns.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.bloodPressure}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.heartRate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.bodyTemperature}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.bloodSugar}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.weight}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.bmi}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {record.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Xét nghiệm máu */}
        {selectedSection === 'bloodTests' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Kết quả xét nghiệm máu</h2>
            
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {healthRecords.bloodTests.map((test) => (
                  <div 
                    key={test.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer"
                    onClick={() => showBloodTestDetailModal(test)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-md font-medium text-gray-800">Xét nghiệm máu - {test.date}</h3>
                        {test.complete ? (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Đã hoàn thành
                            </span>
                            
                            <div className="mt-3 grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500">Cholesterol tổng:</p>
                                <p className={`text-sm font-medium ${parseInt(test.results.totalCholesterol.value) < 200 ? 'text-green-600' : 'text-red-600'}`}>
                                  {test.results.totalCholesterol.value} {test.results.totalCholesterol.unit}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Đường huyết:</p>
                                <p className={`text-sm font-medium ${parseInt(test.results.glucose.value) <= 100 ? 'text-green-600' : 'text-red-600'}`}>
                                  {test.results.glucose.value} {test.results.glucose.unit}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Đang xử lý
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <button className="text-blue-600 text-sm hover:text-blue-800">
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button className="bg-blue-100 text-blue-600 text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-200 transition mr-2">
                Tải lên kết quả mới
              </button>
              <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Đặt lịch xét nghiệm
              </button>
            </div>
          </div>
        )}

        {/* Tiêm chủng */}
        {selectedSection === 'vaccinations' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Lịch sử tiêm chủng</h2>
            
            <div className="mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vắc-xin
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tiêm
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người thực hiện
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hạn tiêm nhắc
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ghi chú
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {healthRecords.vaccinations.map((vac) => (
                      <tr key={vac.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vac.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vac.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vac.provider}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vac.dueDate}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {vac.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Đặt lịch tiêm chủng
              </button>
            </div>
          </div>
        )}

        {/* Dị ứng */}
        {selectedSection === 'allergies' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Thông tin dị ứng</h2>
            
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-700 mb-4">Thêm thông tin dị ứng mới</h3>
              <div className="bg-red-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="allergen" className="block text-sm font-medium text-gray-700 mb-1">
                      Chất gây dị ứng
                    </label>
                    <input
                      type="text"
                      id="allergen"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Ví dụ: Penicillin, hải sản, phấn hoa..."
                    />
                  </div>
                  <div>
                    <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                      Mức độ nghiêm trọng
                    </label>
                    <select
                      id="severity"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option>Nhẹ</option>
                      <option>Trung bình</option>
                      <option>Nặng</option>
                      <option>Nguy hiểm đến tính mạng</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="reaction" className="block text-sm font-medium text-gray-700 mb-1">
                      Phản ứng
                    </label>
                    <input
                      type="text"
                      id="reaction"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Ví dụ: Phát ban, khó thở, sưng..."
                    />
                  </div>
                  <div>
                    <label htmlFor="diagnosed" className="block text-sm font-medium text-gray-700 mb-1">
                      Năm phát hiện
                    </label>
                    <input
                      type="text"
                      id="diagnosed"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Ví dụ: 2020"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="allergy-notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    id="allergy-notes"
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Ghi chú về phản ứng dị ứng, thuốc điều trị, hoặc các thông tin khác"
                  ></textarea>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    Lưu thông tin
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">Danh sách dị ứng đã ghi nhận</h3>
              {healthRecords.allergies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {healthRecords.allergies.map((allergy) => (
                    <div key={allergy.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-800">{allergy.allergen}</h4>
                      <div className="mt-2 space-y-1">
                        <div className="flex">
                          <span className="text-sm text-gray-500 w-36">Mức độ:</span>
                          <span className="text-sm text-gray-800">{allergy.severity}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-500 w-36">Phản ứng:</span>
                          <span className="text-sm text-gray-800">{allergy.reaction}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-500 w-36">Năm phát hiện:</span>
                          <span className="text-sm text-gray-800">{allergy.diagnosed}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-500 w-36">Ghi chú:</span>
                          <span className="text-sm text-gray-800">{allergy.notes}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button className="text-blue-600 text-sm hover:text-blue-800 mr-2">
                          Chỉnh sửa
                        </button>
                        <button className="text-red-600 text-sm hover:text-red-800">
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Không có dị ứng nào được ghi nhận</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lối sống */}
        {selectedSection === 'lifestyle' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Thông tin lối sống</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-md font-medium text-gray-700 mb-4">Thông tin hiện tại</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Hút thuốc</h4>
                      <p className="text-sm text-gray-600 mt-1">{healthRecords.lifestyle.smoking}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Rượu bia</h4>
                      <p className="text-sm text-gray-600 mt-1">{healthRecords.lifestyle.alcohol}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Tập thể dục</h4>
                      <p className="text-sm text-gray-600 mt-1">{healthRecords.lifestyle.exercise}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Chế độ ăn</h4>
                      <p className="text-sm text-gray-600 mt-1">{healthRecords.lifestyle.diet}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Giấc ngủ</h4>
                      <p className="text-sm text-gray-600 mt-1">{healthRecords.lifestyle.sleep}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition">
                      Cập nhật
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-md font-medium text-gray-700 mb-4">Yếu tố nguy cơ</h3>
                  {healthRecords.riskFactors.length > 0 ? (
                    <div className="space-y-4">
                      {healthRecords.riskFactors.map((risk) => (
                        <div key={risk.id}>
                          <h4 className="text-sm font-medium text-gray-700">{risk.factor}</h4>
                          <p className="text-sm text-gray-600 mt-1">Trạng thái: {risk.status}</p>
                          <p className="text-sm text-gray-600 mt-1">Ghi chú: {risk.notes}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Không có yếu tố nguy cơ nào được ghi nhận</p>
                  )}
                </div>

                <div className="bg-blue-50 rounded-lg p-6 mt-6">
                  <h3 className="text-md font-medium text-gray-700 mb-4">Khuyến nghị từ bác sĩ</h3>
                  <div className="space-y-4">
                    {healthRecords.recommendations.map((rec) => (
                      <div key={rec.id}>
                        <h4 className="text-sm font-medium text-gray-700">{rec.category}</h4>
                        <p className="text-sm text-gray-600 mt-1">{rec.detail}</p>
                        <p className="text-xs text-gray-500 mt-1">Bác sĩ: {rec.doctor} - {rec.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bài viết sức khỏe */}
        {selectedSection === 'articles' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Bài viết sức khỏe</h2>
            
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-md font-medium text-gray-700">Bài viết mới nhất</h3>
                </div>
                <div className="relative max-w-xs w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Tìm kiếm bài viết..."
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {healthArticles.map((article) => (
                <div 
                  key={article.id} 
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"
                  onClick={() => showArticleDetail(article)}
                >
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-40 object-cover" 
                  />
                  <div className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                      {article.category}
                    </span>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{article.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{article.date}</span>
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                        Đọc thêm
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chi tiết bài viết (Modal) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-90vh overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title} 
                className="w-full h-64 object-cover"
              />
              <button 
                onClick={closeArticleModal} 
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedArticle.category}
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">{selectedArticle.title}</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-600">{selectedArticle.author}</p>
                <p className="text-sm text-gray-600">{selectedArticle.date}</p>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-800 mb-4">
                  {selectedArticle.description}
                </p>
                
                {/* Nội dung bài viết mẫu */}
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Giới thiệu</h3>
                <p className="text-gray-800 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquet nisl, eget aliquet nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquet nisl, eget aliquet nisl nisl vel nisl.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Nội dung chính</h3>
                <p className="text-gray-800 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquet nisl, eget aliquet nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquet nisl, eget aliquet nisl nisl vel nisl.
                </p>
                <p className="text-gray-800 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquet nisl, eget aliquet nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquet nisl, eget aliquet nisl nisl vel nisl.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Lời khuyên</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li className="text-gray-800 mb-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </li>
                  <li className="text-gray-800 mb-2">
                    Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquet nisl.
                  </li>
                  <li className="text-gray-800 mb-2">
                    Eget aliquet nisl nisl vel nisl. Sed euismod.
                  </li>
                  <li className="text-gray-800 mb-2">
                    Nisl vel ultricies lacinia, nisl nisl aliquet nisl.
                  </li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Kết luận</h3>
                <p className="text-gray-800 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquet nisl, eget aliquet nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquet nisl, eget aliquet nisl nisl vel nisl.
                </p>
              </div>
              
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Bài viết liên quan</h3>
                  </div>
                  <div>
                    <button 
                      onClick={closeArticleModal}
                      className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {healthArticles.filter(a => a.id !== selectedArticle.id).slice(0, 3).map((article) => (
                    <div 
                      key={article.id} 
                      className="border border-gray-200 rounded-lg p-3 hover:bg-blue-50 transition cursor-pointer"
                      onClick={() => {
                        closeArticleModal();
                        setTimeout(() => showArticleDetail(article), 100);
                      }}
                    >
                      <h4 className="text-sm font-medium text-gray-800">{article.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{article.category} • {article.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chi tiết xét nghiệm máu (Modal) */}
      {showBloodTestDetail && selectedBloodTest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-90vh overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Chi tiết xét nghiệm máu</h2>
                  <p className="text-sm text-gray-500">Ngày: {selectedBloodTest.date}</p>
                </div>
                <button 
                  onClick={closeBloodTestDetailModal} 
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {selectedBloodTest.complete ? (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Kết quả xét nghiệm</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Chỉ số
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Kết quả
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Đơn vị
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Phạm vi bình thường
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Đánh giá
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Hematocrit
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.hematocrit.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.hematocrit.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.hematocrit.normal}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                parseInt(selectedBloodTest.results.hematocrit.value) >= parseInt(selectedBloodTest.results.hematocrit.normal.split('-')[0]) && 
                                parseInt(selectedBloodTest.results.hematocrit.value) <= parseInt(selectedBloodTest.results.hematocrit.normal.split('-')[1])
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {parseInt(selectedBloodTest.results.hematocrit.value) >= parseInt(selectedBloodTest.results.hematocrit.normal.split('-')[0]) && 
                                parseInt(selectedBloodTest.results.hematocrit.value) <= parseInt(selectedBloodTest.results.hematocrit.normal.split('-')[1])
                                  ? 'Bình thường'
                                  : 'Bất thường'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Hemoglobin
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.hemoglobin.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.hemoglobin.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.hemoglobin.normal}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                parseFloat(selectedBloodTest.results.hemoglobin.value) >= parseFloat(selectedBloodTest.results.hemoglobin.normal.split('-')[0]) && 
                                parseFloat(selectedBloodTest.results.hemoglobin.value) <= parseFloat(selectedBloodTest.results.hemoglobin.normal.split('-')[1])
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {parseFloat(selectedBloodTest.results.hemoglobin.value) >= parseFloat(selectedBloodTest.results.hemoglobin.normal.split('-')[0]) && 
                                parseFloat(selectedBloodTest.results.hemoglobin.value) <= parseFloat(selectedBloodTest.results.hemoglobin.normal.split('-')[1])
                                  ? 'Bình thường'
                                  : 'Bất thường'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Tiểu cầu (Platelets)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.platelets.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.platelets.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.platelets.normal}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                parseInt(selectedBloodTest.results.platelets.value) >= parseInt(selectedBloodTest.results.platelets.normal.split('-')[0]) && 
                                parseInt(selectedBloodTest.results.platelets.value) <= parseInt(selectedBloodTest.results.platelets.normal.split('-')[1])
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {parseInt(selectedBloodTest.results.platelets.value) >= parseInt(selectedBloodTest.results.platelets.normal.split('-')[0]) && 
                                parseInt(selectedBloodTest.results.platelets.value) <= parseInt(selectedBloodTest.results.platelets.normal.split('-')[1])
                                  ? 'Bình thường'
                                  : 'Bất thường'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Bạch cầu (WBC)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.wbc.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.wbc.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.wbc.normal}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                parseFloat(selectedBloodTest.results.wbc.value) >= parseFloat(selectedBloodTest.results.wbc.normal.split('-')[0]) && 
                                parseFloat(selectedBloodTest.results.wbc.value) <= parseFloat(selectedBloodTest.results.wbc.normal.split('-')[1])
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {parseFloat(selectedBloodTest.results.wbc.value) >= parseFloat(selectedBloodTest.results.wbc.normal.split('-')[0]) && 
                                parseFloat(selectedBloodTest.results.wbc.value) <= parseFloat(selectedBloodTest.results.wbc.normal.split('-')[1])
                                  ? 'Bình thường'
                                  : 'Bất thường'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Hồng cầu (RBC)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.rbc.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.rbc.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.rbc.normal}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                parseFloat(selectedBloodTest.results.rbc.value) >= parseFloat(selectedBloodTest.results.rbc.normal.split('-')[0]) && 
                                parseFloat(selectedBloodTest.results.rbc.value) <= parseFloat(selectedBloodTest.results.rbc.normal.split('-')[1])
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {parseFloat(selectedBloodTest.results.rbc.value) >= parseFloat(selectedBloodTest.results.rbc.normal.split('-')[0]) && 
                                parseFloat(selectedBloodTest.results.rbc.value) <= parseFloat(selectedBloodTest.results.rbc.normal.split('-')[1])
                                  ? 'Bình thường'
                                  : 'Bất thường'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Cholesterol toàn phần
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.totalCholesterol.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.totalCholesterol.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.totalCholesterol.normal}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                parseInt(selectedBloodTest.results.totalCholesterol.value) < 200
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {parseInt(selectedBloodTest.results.totalCholesterol.value) < 200
                                  ? 'Bình thường'
                                  : 'Cao'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              LDL Cholesterol
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.ldl.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.ldl.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.ldl.normal}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                parseInt(selectedBloodTest.results.ldl.value) < 130
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {parseInt(selectedBloodTest.results.ldl.value) < 130
                                  ? 'Bình thường'
                                  : 'Cao'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              HDL Cholesterol
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.hdl.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.hdl.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.hdl.normal}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                parseInt(selectedBloodTest.results.hdl.value) > 40
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {parseInt(selectedBloodTest.results.hdl.value) > 40
                                  ? 'Bình thường'
                                  : 'Thấp'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Triglycerides
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.triglycerides.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.triglycerides.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.triglycerides.normal}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                parseInt(selectedBloodTest.results.triglycerides.value) < 150
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {parseInt(selectedBloodTest.results.triglycerides.value) < 150
                                  ? 'Bình thường'
                                  : 'Cao'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Đường huyết
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.glucose.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.glucose.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedBloodTest.results.glucose.normal}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                parseInt(selectedBloodTest.results.glucose.value) >= 70 && 
                                parseInt(selectedBloodTest.results.glucose.value) <= 100
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {parseInt(selectedBloodTest.results.glucose.value) >= 70 && 
                                parseInt(selectedBloodTest.results.glucose.value) <= 100
                                  ? 'Bình thường'
                                  : parseInt(selectedBloodTest.results.glucose.value) > 100
                                    ? 'Cao'
                                    : 'Thấp'}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Diễn giải kết quả</h3>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700 mb-2">
                          Phần lớn các chỉ số xét nghiệm máu của bạn đều nằm trong giới hạn bình thường. Tuy nhiên, có một số điểm cần lưu ý:
                        </p>
                        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                          {parseInt(selectedBloodTest.results.totalCholesterol.value) >= 200 && (
                            <li>
                              Cholesterol toàn phần ({selectedBloodTest.results.totalCholesterol.value} {selectedBloodTest.results.totalCholesterol.unit}) cao hơn mức khuyến nghị (&lt;200 {selectedBloodTest.results.totalCholesterol.unit}).
                            </li>
                          )}
                          {parseInt(selectedBloodTest.results.ldl.value) >= 130 && (
                            <li>
                              LDL Cholesterol ({selectedBloodTest.results.ldl.value} {selectedBloodTest.results.ldl.unit}) cao hơn mức khuyến nghị (&lt;130 {selectedBloodTest.results.ldl.unit}).
                            </li>
                          )}
                          {parseInt(selectedBloodTest.results.hdl.value) <= 40 && (
                            <li>
                              HDL Cholesterol ({selectedBloodTest.results.hdl.value} {selectedBloodTest.results.hdl.unit}) thấp hơn mức khuyến nghị (&gt;40 {selectedBloodTest.results.hdl.unit}).
                            </li>
                          )}
                          {parseInt(selectedBloodTest.results.triglycerides.value) >= 150 && (
                            <li>
                              Triglycerides ({selectedBloodTest.results.triglycerides.value} {selectedBloodTest.results.triglycerides.unit}) cao hơn mức khuyến nghị (&lt;150 {selectedBloodTest.results.triglycerides.unit}).
                            </li>
                          )}
                          {parseInt(selectedBloodTest.results.glucose.value) > 100 && (
                            <li>
                              Đường huyết ({selectedBloodTest.results.glucose.value} {selectedBloodTest.results.glucose.unit}) cao hơn mức khuyến nghị (70-100 {selectedBloodTest.results.glucose.unit}).
                            </li>
                          )}
                          {parseInt(selectedBloodTest.results.glucose.value) < 70 && (
                            <li>
                              Đường huyết ({selectedBloodTest.results.glucose.value} {selectedBloodTest.results.glucose.unit}) thấp hơn mức khuyến nghị (70-100 {selectedBloodTest.results.glucose.unit}).
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Khuyến nghị từ bác sĩ</h3>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700">
                          Dựa trên kết quả xét nghiệm, bác sĩ khuyến nghị:
                        </p>
                        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 mt-2">
                          {parseInt(selectedBloodTest.results.totalCholesterol.value) >= 200 || 
                           parseInt(selectedBloodTest.results.ldl.value) >= 130 || 
                           parseInt(selectedBloodTest.results.hdl.value) <= 40 || 
                           parseInt(selectedBloodTest.results.triglycerides.value) >= 150 ? (
                            <>
                              <li>Điều chỉnh chế độ ăn giảm chất béo bão hòa, tăng cường rau xanh và trái cây</li>
                              <li>Tăng cường hoạt động thể chất, tập thể dục đều đặn</li>
                              <li>Tái khám sau 3 tháng để đánh giá lại chỉ số lipid máu</li>
                            </>
                           ) : null}
                          {parseInt(selectedBloodTest.results.glucose.value) > 100 ? (
                            <>
                              <li>Hạn chế đường và carbohydrate tinh chế</li>
                              <li>Giữ cân nặng ở mức hợp lý</li>
                              <li>Xét nghiệm đánh giá nguy cơ tiểu đường</li>
                            </>
                          ) : null}
                          {parseInt(selectedBloodTest.results.glucose.value) < 70 ? (
                            <>
                              <li>Kiểm tra đường huyết thường xuyên</li>
                              <li>Đảm bảo ăn đủ bữa, không bỏ bữa</li>
                              <li>Cần đánh giá thêm về nguyên nhân hạ đường huyết</li>
                            </>
                          ) : null}
                          {(parseInt(selectedBloodTest.results.totalCholesterol.value) < 200 && 
                            parseInt(selectedBloodTest.results.ldl.value) < 130 && 
                            parseInt(selectedBloodTest.results.hdl.value) > 40 && 
                            parseInt(selectedBloodTest.results.triglycerides.value) < 150 && 
                            parseInt(selectedBloodTest.results.glucose.value) >= 70 && 
                            parseInt(selectedBloodTest.results.glucose.value) <= 100) ? (
                              <>
                                <li>Duy trì chế độ ăn uống lành mạnh hiện tại</li>
                                <li>Tiếp tục tập thể dục đều đặn</li>
                                <li>Tái khám định kỳ sau 6-12 tháng</li>
                              </>
                            ) : null}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-pulse inline-block">
                    <svg className="h-12 w-12 text-yellow-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Đang chờ kết quả</h3>
                  <p className="mt-1 text-gray-500">
                    Kết quả xét nghiệm của bạn đang được xử lý. Vui lòng kiểm tra lại sau.
                  </p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end rounded-b-lg">
              <button
                onClick={closeBloodTestDetailModal}
                className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition mr-2"
              >
                Đóng
              </button>
              <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Tải xuống PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientHealth;