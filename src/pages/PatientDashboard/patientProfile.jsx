// src/pages/PatientProfile/index.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Dữ liệu giả
const patientInfo = {
  id: "BN-2023-045",
  name: "Nguyễn Văn A",
  age: 45,
  birthDate: "15/05/1980",
  gender: "Nam",
  phone: "0901234567",
  email: "nguyenvana@email.com",
  address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
  idCard: "079123456789",
  insuranceNumber: "SH23456789",
  occupation: "Kỹ sư phần mềm",
  bloodType: "O+",
  height: 172,
  weight: 68,
  allergies: "Penicillin",
  emergencyContact: {
    name: "Nguyễn Thị B",
    relationship: "Vợ",
    phone: "0912345678"
  },
  medicalHistory: [
    {
      condition: "Viêm phổi",
      diagnosedDate: "03/2024",
      status: "Đã khỏi",
      notes: "Điều trị thành công với kháng sinh"
    },
    {
      condition: "Tăng huyết áp",
      diagnosedDate: "10/2023",
      status: "Đang theo dõi",
      notes: "Kiểm soát tốt với thuốc hiện tại"
    },
    {
      condition: "Gãy xương tay phải",
      diagnosedDate: "05/2022",
      status: "Đã khỏi",
      notes: "Phục hồi hoàn toàn"
    }
  ],
  familyHistory: [
    {
      relationship: "Cha",
      condition: "Tiểu đường type 2",
      onsetAge: 60
    },
    {
      relationship: "Bà nội",
      condition: "Ung thư phổi",
      onsetAge: 65
    }
  ],
  doctorName: "TS. BS. Trần Văn B",
  department: "Khoa Ung bướu",
  registrationDate: "05/03/2025"
};

function PatientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: patientInfo.name,
    birthDate: patientInfo.birthDate,
    gender: patientInfo.gender,
    phone: patientInfo.phone,
    email: patientInfo.email,
    address: patientInfo.address,
    idCard: patientInfo.idCard,
    insuranceNumber: patientInfo.insuranceNumber,
    occupation: patientInfo.occupation,
    bloodType: patientInfo.bloodType,
    height: patientInfo.height,
    weight: patientInfo.weight,
    allergies: patientInfo.allergies,
    emergencyContactName: patientInfo.emergencyContact.name,
    emergencyContactRelationship: patientInfo.emergencyContact.relationship,
    emergencyContactPhone: patientInfo.emergencyContact.phone
  });

  // Toggle chế độ chỉnh sửa
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Xử lý thay đổi dữ liệu form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Xử lý khi nhấn nút Lưu thay đổi
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ở đây sẽ gửi dữ liệu lên server
    console.log('Form data submitted:', formData);
    // Sau khi lưu thành công, tắt chế độ chỉnh sửa
    setIsEditing(false);
  };

  // Xử lý khi nhấn nút Hủy
  const handleCancel = () => {
    // Reset lại dữ liệu form và tắt chế độ chỉnh sửa
    setFormData({
      name: patientInfo.name,
      birthDate: patientInfo.birthDate,
      gender: patientInfo.gender,
      phone: patientInfo.phone,
      email: patientInfo.email,
      address: patientInfo.address,
      idCard: patientInfo.idCard,
      insuranceNumber: patientInfo.insuranceNumber,
      occupation: patientInfo.occupation,
      bloodType: patientInfo.bloodType,
      height: patientInfo.height,
      weight: patientInfo.weight,
      allergies: patientInfo.allergies,
      emergencyContactName: patientInfo.emergencyContact.name,
      emergencyContactRelationship: patientInfo.emergencyContact.relationship,
      emergencyContactPhone: patientInfo.emergencyContact.phone
    });
    setIsEditing(false);
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
              {!isEditing && (
                <button 
                  onClick={toggleEdit}
                  className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-700 transition flex items-center"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-blue-600 text-white">
            <h2 className="text-lg font-medium">Hồ sơ cá nhân</h2>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-800">Thông tin cá nhân</h3>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                      Ngày sinh
                    </label>
                    <input
                      type="text"
                      name="birthDate"
                      id="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Giới tính
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option>Nam</option>
                      <option>Nữ</option>
                      <option>Khác</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Địa chỉ
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="idCard" className="block text-sm font-medium text-gray-700">
                      CMND/CCCD
                    </label>
                    <input
                      type="text"
                      name="idCard"
                      id="idCard"
                      value={formData.idCard}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="insuranceNumber" className="block text-sm font-medium text-gray-700">
                      Số BHYT
                    </label>
                    <input
                      type="text"
                      name="insuranceNumber"
                      id="insuranceNumber"
                      value={formData.insuranceNumber}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                      Nghề nghiệp
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      id="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-800">Thông tin y tế</h3>

                  <div>
                    <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                      Nhóm máu
                    </label>
                    <select
                      id="bloodType"
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                      <option>O+</option>
                      <option>O-</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                      Chiều cao (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      id="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                      Cân nặng (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                      Dị ứng
                    </label>
                    <input
                      type="text"
                      name="allergies"
                      id="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: Penicillin, hải sản, phấn hoa..."
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <h3 className="text-lg font-medium text-gray-800 pt-4">Thông tin liên hệ khẩn cấp</h3>

                  <div>
                    <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700">
                      Họ tên
                    </label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="emergencyContactRelationship" className="block text-sm font-medium text-gray-700">
                      Mối quan hệ
                    </label>
                    <input
                      type="text"
                      name="emergencyContactRelationship"
                      id="emergencyContactRelationship"
                      value={formData.emergencyContactRelationship}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      name="emergencyContactPhone"
                      id="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-800">Thông tin cá nhân</h3>
                  
                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-500">Họ và tên</p>
                    <p className="mt-1 text-sm text-gray-900">{patientInfo.name}</p>
                  </div>

                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
                    <p className="mt-1 text-sm text-gray-900">{patientInfo.birthDate} ({patientInfo.age} tuổi)</p>
                  </div>

                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-500">Giới tính</p>
                    <p className="mt-1 text-sm text-gray-900">{patientInfo.gender}</p>
                  </div>

                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                    <p className="mt-1 text-sm text-gray-900">{patientInfo.phone}</p>
                  </div>

                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-sm text-gray-900">{patientInfo.email}</p>
                  </div>

                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                    <p className="mt-1 text-sm text-gray-900">{patientInfo.address}</p>
                  </div>

                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-500">CMND/CCCD</p>
                    <p className="mt-1 text-sm text-gray-900">{patientInfo.idCard}</p>
                  </div>

                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-500">Số BHYT</p>
                    <p className="mt-1 text-sm text-gray-900">{patientInfo.insuranceNumber}</p>
                  </div>

                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-500">Nghề nghiệp</p>
                    <p className="mt-1 text-sm text-gray-900">{patientInfo.occupation}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-800">Thông tin y tế</h3>

                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-500">Nhóm máu</p>
                    <p className="mt-1 text-sm text-gray-900">{patientInfo.bloodType}</p>
                  </div>

                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-500">Chiều cao</p>
                    <p className="mt-1 text-sm text-gray-900">{patientInfo.height} cm</p>
                  </div>

                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-500">Cân nặng</p>
                    <p className="mt-1 text-sm text-gray-900">{patientInfo.weight} kg</p>
                  </div>

                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-500">Dị ứng</p>
                    <p className="mt-1 text-sm text-gray-900">{patientInfo.allergies || "Không có"}</p>
                  </div>

                  <h3 className="text-lg font-medium text-gray-800 pt-4">Thông tin liên hệ khẩn cấp</h3>

                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-500">Họ tên</p>
                    <p className="mt-1 text-sm text-gray-900">{patientInfo.emergencyContact.name}</p>
                  </div>

                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-500">Mối quan hệ</p>
                    <p className="mt-1 text-sm text-gray-900">{patientInfo.emergencyContact.relationship}</p>
                  </div>

                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                    <p className="mt-1 text-sm text-gray-900">{patientInfo.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-blue-600 text-white">
            <h2 className="text-lg font-medium">Tiền sử bệnh</h2>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Tiền sử bệnh cá nhân</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bệnh/Tình trạng
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày chẩn đoán
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ghi chú
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patientInfo.medicalHistory.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.condition}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {item.diagnosedDate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'Đã khỏi' 
                            ? 'bg-green-100 text-green-800' 
                            : item.status === 'Đang theo dõi'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {item.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-gray-800 mb-4 mt-8">Tiền sử bệnh gia đình</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quan hệ
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bệnh/Tình trạng
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tuổi khởi phát
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patientInfo.familyHistory.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.relationship}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {item.condition}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {item.onsetAge}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Thông tin đăng ký</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Ngày đăng ký:</span> {patientInfo.registrationDate}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-medium">Bác sĩ phụ trách:</span> {patientInfo.doctorName}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-medium">Khoa:</span> {patientInfo.department}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-blue-600 text-white">
            <h2 className="text-lg font-medium">Cài đặt tài khoản</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Đổi mật khẩu</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Thiết lập thông báo</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="emailNotifications"
                          name="emailNotifications"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                          Thông báo qua email
                        </label>
                        <p className="text-gray-500">Nhận thông báo về lịch hẹn, đơn thuốc và kết quả xét nghiệm qua email</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="smsNotifications"
                          name="smsNotifications"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="smsNotifications" className="font-medium text-gray-700">
                          Thông báo qua SMS
                        </label>
                        <p className="text-gray-500">Nhận thông báo về lịch hẹn, đơn thuốc và kết quả xét nghiệm qua SMS</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="appointmentReminders"
                          name="appointmentReminders"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="appointmentReminders" className="font-medium text-gray-700">
                          Nhắc nhở lịch hẹn
                        </label>
                        <p className="text-gray-500">Nhận thông báo nhắc nhở trước khi đến lịch hẹn</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="medicationReminders"
                          name="medicationReminders"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="medicationReminders" className="font-medium text-gray-700">
                          Nhắc nhở uống thuốc
                        </label>
                        <p className="text-gray-500">Nhận thông báo nhắc nhở uống thuốc theo lịch trình</p>
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Lưu thiết lập
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Quyền riêng tư</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="dataSharing"
                          name="dataSharing"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="dataSharing" className="font-medium text-gray-700">
                          Chia sẻ dữ liệu y tế
                        </label>
                        <p className="text-gray-500">Cho phép các bác sĩ và nhân viên y tế trong hệ thống truy cập thông tin y tế của bạn</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="researchConsent"
                          name="researchConsent"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="researchConsent" className="font-medium text-gray-700">
                          Đồng ý tham gia nghiên cứu
                        </label>
                        <p className="text-gray-500">Cho phép sử dụng dữ liệu y tế của bạn cho mục đích nghiên cứu (đã ẩn danh)</p>
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Lưu thiết lập
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;