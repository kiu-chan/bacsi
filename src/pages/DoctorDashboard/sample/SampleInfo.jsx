import React from 'react';

function SampleInfo({ sample }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg text-gray-800">Thông tin mẫu mô học</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Mã mẫu</h3>
              <p className="mt-1 text-base font-medium text-gray-800">MS-{sample.id.toString().padStart(4, '0')}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Bệnh nhân</h3>
              <p className="mt-1 text-base font-medium text-gray-800">{sample.patientName}</p>
              <p className="text-sm text-gray-500">{sample.patientId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Loại mẫu</h3>
              <p className="mt-1 text-base font-medium text-gray-800">{sample.sampleType}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ngày lấy mẫu</h3>
              <p className="mt-1 text-base font-medium text-gray-800">{sample.dateCollected}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                sample.status === 'Chờ phân tích' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : sample.status === 'Đang xử lý' 
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
              }`}>
                {sample.status}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tên file</h3>
              <p className="mt-1 text-base font-medium text-gray-800">{sample.fileName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SampleInfo;