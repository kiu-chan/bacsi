// src/pages/Unauthorized/index.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Unauthorized() {
  const { isDoctor, isPatient, userProfile } = useAuth();
  
  // Xác định trang dashboard phù hợp
  const getDashboardLink = () => {
    if (isDoctor) return '/doctor';
    if (isPatient) return '/patient';
    return '/';
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col justify-center items-center">
      <div className="max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Truy cập bị từ chối</h1>
        <p className="text-gray-600 mb-6 text-center">
          Bạn không có quyền truy cập vào trang này.
        </p>
        
        <div className="space-y-3">
          <Link 
            to={getDashboardLink()}
            className="block text-center w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Về trang chính của bạn
          </Link>
          
          <Link 
            to="/"
            className="block text-center w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Về trang chủ
          </Link>
        </div>
        
        {userProfile && (
          <div className="mt-6 p-3 bg-blue-50 rounded text-sm text-gray-600">
            Bạn đang đăng nhập với vai trò: <span className="font-medium">{isDoctor ? 'Bác sĩ' : isPatient ? 'Bệnh nhân' : 'Chưa xác định'}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Unauthorized;