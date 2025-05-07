// src/pages/DoctorDashboard/index.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Dữ liệu giả
const recentPatients = [
  { id: 1, name: 'Nguyễn Văn A', age: 45, gender: 'Nam', lastVisit: '25/04/2025', status: 'Đang điều trị' },
  { id: 2, name: 'Trần Thị B', age: 38, gender: 'Nữ', lastVisit: '24/04/2025', status: 'Theo dõi' },
];

const pendingSamples = [
  { id: 101, patientName: 'Nguyễn Văn A', sampleType: 'Mô phổi', dateCollected: '25/04/2025', status: 'Chờ phân tích' },
  { id: 102, patientName: 'Trần Thị B', sampleType: 'Mô gan', dateCollected: '24/04/2025', status: 'Đang xử lý' },
];

const recentAnalyses = [
];

// Dữ liệu thống kê
const statistics = {
  totalPatients: 2,
  pendingAnalyses: 2,
  completedAnalyses: 2,
  abnormalFindings: 1
};

function DoctorDashboard() {
  return (
    <div className="bg-blue-50 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 mt-6">
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tổng số bệnh nhân</p>
                  <p className="text-2xl font-bold text-gray-800">{statistics.totalPatients}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Mẫu chờ phân tích</p>
                  <p className="text-2xl font-bold text-yellow-500">{statistics.pendingAnalyses}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Phân tích đã hoàn thành</p>
                  <p className="text-2xl font-bold text-green-500">{statistics.completedAnalyses}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Phát hiện bất thường</p>
                  <p className="text-2xl font-bold text-red-500">{statistics.abnormalFindings}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Bệnh nhân gần đây</h2>
              <Link to="/doctor/patients" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                Xem tất cả
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
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
                      Khám gần nhất
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
                  {recentPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-blue-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800">
                        BN-{patient.id.toString().padStart(4, '0')}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                        {patient.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {patient.age}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {patient.gender}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {patient.lastVisit}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          patient.status === 'Đang điều trị' 
                            ? 'bg-green-100 text-green-800' 
                            : patient.status === 'Theo dõi' 
                              ? 'bg-blue-100 text-blue-800'
                              : patient.status === 'Mới'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
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
          </div>

          {/* Pending Samples */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Mẫu chờ phân tích</h2>
              <Link to="/doctor/samples" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                Xem tất cả
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã mẫu
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
                      Trạng thái
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingSamples.map((sample) => (
                    <tr key={sample.id} className="hover:bg-blue-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800">
                        MS-{sample.id.toString().padStart(4, '0')}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                        {sample.patientName}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {sample.sampleType}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {sample.dateCollected}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
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
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
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
          </div>

          {/* Recent Analyses */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Phân tích gần đây</h2>
              <Link to="/doctor/analysis" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                Xem tất cả
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="flex items-center p-4 hover:bg-blue-50">
                  <div className="flex-shrink-0 h-16 w-16 mr-4">
                    <img 
                      src={analysis.image} 
                      alt={`Mẫu ${analysis.sampleType}`} 
                      className="h-16 w-16 rounded-md object-cover border border-gray-200" 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {analysis.patientName} - {analysis.sampleType}
                    </p>
                    <p className="text-sm text-gray-500">
                      Phân tích ngày: {analysis.dateAnalyzed}
                    </p>
                    <div className="flex mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        analysis.result === 'Phát hiện bất thường' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {analysis.result}
                      </span>
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Độ tin cậy: {analysis.confidence}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Link to={`/doctor/analysis/${analysis.id}`} className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;