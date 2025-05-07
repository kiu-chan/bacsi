// src/components/Layout/DefaultLayout/index.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

function DefaultLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-2">
                  M
                </div>
                <span className="text-xl font-semibold text-blue-600">MoHist</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Trang chủ
              </Link>
              <Link to="/upload" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                Tải lên
              </Link>
              <Link to="/analysis" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                Phân tích
              </Link>
              <Link to="/samples" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                Mẫu mô học
              </Link>
              <Link to="/reports" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                Báo cáo
              </Link>
              <Link to="/guide" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                Hướng dẫn
              </Link>
            </nav>

            {/* Login/Register Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/login" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Đăng nhập
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-500 hover:text-blue-600 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-2 border-t border-gray-100">
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Trang chủ
                </Link>
                <Link
                  to="/upload"
                  className="text-gray-600 hover:text-blue-600 text-sm font-medium py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tải lên
                </Link>
                <Link
                  to="/analysis"
                  className="text-gray-600 hover:text-blue-600 text-sm font-medium py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Phân tích
                </Link>
                <Link
                  to="/samples"
                  className="text-gray-600 hover:text-blue-600 text-sm font-medium py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mẫu mô học
                </Link>
                <Link
                  to="/reports"
                  className="text-gray-600 hover:text-blue-600 text-sm font-medium py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Báo cáo
                </Link>
                <Link
                  to="/guide"
                  className="text-gray-600 hover:text-blue-600 text-sm font-medium py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hướng dẫn
                </Link>
                <div className="flex space-x-3 pt-2">
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <Link to="/" className="flex items-center mb-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
                  M
                </div>
                <span className="text-base font-semibold text-blue-600">MoHist</span>
              </Link>
              <p className="text-gray-600 text-sm">
                Hệ thống quản lý và phân tích ảnh mô học sử dụng công nghệ AI tiên tiến.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Liên kết</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-blue-600 text-sm">
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="text-gray-600 hover:text-blue-600 text-sm">
                    Tính năng
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-600 hover:text-blue-600 text-sm">
                    Bảng giá
                  </Link>
                </li>
                <li>
                  <Link to="/guide" className="text-gray-600 hover:text-blue-600 text-sm">
                    Hướng dẫn sử dụng
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Hỗ trợ</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-blue-600 text-sm">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-600 hover:text-blue-600 text-sm">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-gray-600 hover:text-blue-600 text-sm">
                    Trung tâm hỗ trợ
                  </Link>
                </li>
                <li>
                  <Link to="/training" className="text-gray-600 hover:text-blue-600 text-sm">
                    Đào tạo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Liên hệ</h3>
              <address className="not-italic text-sm text-gray-600">
                <p className="mb-1">Viện Nghiên cứu Y học</p>
                <p className="mb-1">Email: contact@mohist.vn</p>
                <p>Hotline: (024) 3456 7890</p>
              </address>
              <div className="mt-3 flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <span className="sr-only">Email</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} MoHist. Bản quyền thuộc về Viện Nghiên cứu Y học.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DefaultLayout;