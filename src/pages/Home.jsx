// src/pages/Home/index.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Giả lập dữ liệu
const recentImages = [
  { id: 1, name: 'Mẫu mô phổi', patientId: 'BN-2023-001', date: '25/04/2025', status: 'Đã phân tích', image: '/api/placeholder/300/200' },
  { id: 2, name: 'Mẫu mô gan', patientId: 'BN-2023-005', date: '26/04/2025', status: 'Đang xử lý', image: '/api/placeholder/300/200' },
  { id: 3, name: 'Mẫu mô tuyến giáp', patientId: 'BN-2023-012', date: '28/04/2025', status: 'Chờ phân tích', image: '/api/placeholder/300/200' },
];

const featuredTools = [
  { id: 1, title: 'Phân tích mô học', description: 'Công cụ phân tích mô học tự động bằng AI', icon: '🔬' },
  { id: 2, title: 'Quản lý mẫu', description: 'Quản lý, tìm kiếm và theo dõi mẫu mô học', icon: '📊' },
  { id: 3, title: 'Lưu trữ và chia sẻ', description: 'Lưu trữ ảnh mô học và chia sẻ với đồng nghiệp', icon: '🔄' },
];

function Home() {
  const [activeTab, setActiveTab] = useState('recent');

  return (
    <div className="bg-blue-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Hệ thống quản lý và phân tích ảnh mô học</h1>
              <p className="text-lg mb-6">Giải pháp hiện đại giúp bác sĩ và nhà nghiên cứu quản lý, phân tích và chia sẻ ảnh mô học một cách hiệu quả.</p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-100 transition">
                  Tải lên ảnh mô học
                </button>
                <button className="bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg border border-white hover:bg-blue-800 transition">
                  Xem hướng dẫn
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img src="/api/placeholder/500/300" alt="Minh họa phân tích mô học" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        {/* Tab Selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'recent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab('recent')}
            >
              Ảnh mô học gần đây
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'tools' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab('tools')}
            >
              Công cụ phân tích
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'faq' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab('faq')}
            >
              Hướng dẫn và FAQ
            </button>
          </div>
        </div>

        {/* Content based on selected tab */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'recent' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Ảnh mô học gần đây</h2>
                <Link to="/images" className="text-blue-600 hover:text-blue-800">
                  Xem tất cả →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentImages.map((image) => (
                  <div key={image.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                    <img src={image.image} alt={image.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{image.name}</h3>
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Mã BN:</span> {image.patientId}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Ngày:</span> {image.date}
                      </div>
                      <div className="text-sm mb-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          image.status === 'Đã phân tích' 
                            ? 'bg-green-100 text-green-800' 
                            : image.status === 'Đang xử lý' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {image.status}
                        </span>
                      </div>
                      <button className="w-full bg-blue-50 text-blue-600 font-medium py-1 rounded hover:bg-blue-100 transition">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                  Tải lên ảnh mô học mới
                </button>
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Công cụ phân tích mô học</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredTools.map((tool) => (
                  <div key={tool.id} className="bg-blue-50 p-6 rounded-lg hover:shadow-md transition">
                    <div className="text-3xl mb-4">{tool.icon}</div>
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">{tool.title}</h3>
                    <p className="text-gray-600 mb-4">{tool.description}</p>
                    <Link to={`/tools/${tool.id}`} className="text-blue-600 hover:text-blue-800">
                      Sử dụng công cụ →
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Cải tiến công cụ phân tích</h3>
                <p className="text-gray-600 mb-4">
                  Hệ thống của chúng tôi liên tục được cập nhật với các thuật toán AI mới nhất để cải thiện độ chính xác trong phân tích mô học.
                </p>
                <Link to="/technology" className="text-blue-600 hover:text-blue-800">
                  Tìm hiểu về công nghệ →
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Câu hỏi thường gặp</h2>
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-blue-600 mb-2">Tôi có thể tải lên ảnh mô học ở định dạng nào?</h3>
                  <p className="text-gray-600">
                    Hệ thống hỗ trợ các định dạng ảnh phổ biến như JPEG, PNG, TIFF, và cả các định dạng chuyên biệt cho ảnh y tế như DICOM.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-blue-600 mb-2">Làm thế nào để chia sẻ kết quả phân tích với đồng nghiệp?</h3>
                  <p className="text-gray-600">
                    Bạn có thể chia sẻ kết quả bằng cách tạo liên kết chia sẻ, xuất báo cáo PDF, hoặc thêm đồng nghiệp vào dự án của bạn.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-blue-600 mb-2">Dữ liệu của tôi có được bảo mật không?</h3>
                  <p className="text-gray-600">
                    Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt theo tiêu chuẩn y tế (HIPAA, GDPR). Mọi dữ liệu đều được mã hóa và lưu trữ an toàn.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-blue-600 mb-2">Tôi có thể tích hợp hệ thống này với phần mềm quản lý bệnh viện không?</h3>
                  <p className="text-gray-600">
                    Có, chúng tôi cung cấp API để tích hợp với các hệ thống HIS/LIS và PACS. Liên hệ đội ngũ hỗ trợ để được tư vấn về tích hợp.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Link to="/support" className="text-blue-600 hover:text-blue-800 font-medium">
                  Xem tất cả câu hỏi thường gặp →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-10 mt-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Hệ thống của chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="bg-blue-700 rounded-lg p-6">
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Ảnh mô học đã phân tích</div>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Độ chính xác phân tích</div>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-blue-100">Bác sĩ sử dụng hệ thống</div>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Bệnh viện và phòng lab</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Bắt đầu sử dụng ngay hôm nay</h2>
          <p className="text-gray-600 mb-6">
            Đăng ký tài khoản để trải nghiệm hệ thống quản lý và phân tích ảnh mô học tiên tiến.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition">
              Đăng ký
            </Link>
            <Link to="/demo" className="bg-blue-100 text-blue-600 font-medium py-2 px-6 rounded-lg hover:bg-blue-200 transition">
              Yêu cầu demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;