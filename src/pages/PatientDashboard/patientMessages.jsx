// src/pages/PatientMessages/index.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Dữ liệu giả
const patientInfo = {
  id: "BN-2023-045",
  name: "Nguyễn Văn A",
  age: 45,
  gender: "Nam",
  avatar: "N" // Chữ cái đầu của tên để hiển thị trong avatar
};

// Danh sách các bác sĩ và nhân viên y tế
const contacts = [
  {
    id: 1,
    name: "TS. BS. Trần Văn B",
    department: "Khoa Ung bướu",
    avatar: "T",
    role: "Bác sĩ phụ trách",
    isOnline: true,
    lastActive: "Vừa xong"
  },
  {
    id: 2,
    name: "BS. Lê Thị C",
    department: "Khoa Nội soi",
    avatar: "L",
    role: "Bác sĩ nội soi",
    isOnline: false,
    lastActive: "15 phút trước"
  },
  {
    id: 3,
    name: "PGS. TS. Nguyễn Thị D",
    department: "Khoa Huyết học",
    avatar: "N",
    role: "Tư vấn khám máu",
    isOnline: false,
    lastActive: "4 giờ trước"
  },
  {
    id: 4,
    name: "Phạm Thị E",
    department: "Phòng dịch vụ khách hàng",
    avatar: "P",
    role: "Nhân viên hỗ trợ",
    isOnline: true,
    lastActive: "Đang hoạt động"
  }
];

// Lịch sử tin nhắn
const messagesHistory = {
  1: [
    {
      id: 1,
      senderId: 1,
      text: "Chào anh Nguyễn Văn A, tôi đã nhận được kết quả xét nghiệm mô phổi của anh.",
      time: "10:30 AM, 25/04/2025",
      isRead: true
    },
    {
      id: 2,
      senderId: "patient",
      text: "Chào bác sĩ, cảm ơn bác sĩ đã thông báo. Kết quả như thế nào ạ?",
      time: "10:35 AM, 25/04/2025",
      isRead: true
    },
    {
      id: 3,
      senderId: 1,
      text: "Tôi đã phát hiện một số bất thường trong mẫu mô. Tôi muốn anh đến gặp tôi vào tuần sau để thảo luận chi tiết về kết quả và các bước tiếp theo.",
      time: "10:40 AM, 25/04/2025",
      isRead: true
    },
    {
      id: 4,
      senderId: "patient",
      text: "Vâng, tôi sẽ sắp xếp thời gian. Anh có thể cho tôi biết khi nào bác sĩ có lịch trống không ạ?",
      time: "10:45 AM, 25/04/2025",
      isRead: true
    },
    {
      id: 5,
      senderId: 1,
      text: "Tôi có lịch trống vào thứ Ba (30/04) lúc 9:00 sáng hoặc thứ Năm (02/05) lúc 14:00 chiều. Anh có thể chọn thời gian nào thuận tiện nhất.",
      time: "10:50 AM, 25/04/2025",
      isRead: true
    },
    {
      id: 6,
      senderId: "patient",
      text: "Tôi sẽ chọn thứ Ba (30/04) lúc 9:00 sáng ạ.",
      time: "10:55 AM, 25/04/2025",
      isRead: true
    },
    {
      id: 7,
      senderId: 1,
      text: "Tốt, tôi đã ghi nhận lịch hẹn của anh vào thứ Ba (30/04) lúc 9:00 sáng. Anh sẽ nhận được thông báo xác nhận qua email và SMS. Nếu có bất kỳ thay đổi hoặc câu hỏi nào, anh có thể liên hệ với tôi qua đây.",
      time: "11:00 AM, 25/04/2025",
      isRead: true
    },
    {
      id: 8,
      senderId: "patient",
      text: "Cảm ơn bác sĩ rất nhiều. Tôi sẽ đến đúng hẹn.",
      time: "11:05 AM, 25/04/2025",
      isRead: true
    }
  ],
  2: [
    {
      id: 1,
      senderId: 2,
      text: "Chào anh Nguyễn Văn A, tôi là bác sĩ Lê Thị C phụ trách về nội soi. Theo lịch hẹn, anh có buổi nội soi phế quản vào ngày 10/05/2025.",
      time: "14:00 PM, 27/04/2025",
      isRead: true
    },
    {
      id: 2,
      senderId: "patient",
      text: "Chào bác sĩ, vâng tôi đã nhận được lịch hẹn. Tôi cần chuẩn bị gì trước khi đến không ạ?",
      time: "14:15 PM, 27/04/2025",
      isRead: true
    },
    {
      id: 3,
      senderId: 2,
      text: "Anh cần nhịn ăn ít nhất 6 giờ trước khi nội soi. Không uống nước trong 2 giờ trước thủ thuật. Nếu anh đang sử dụng thuốc, hãy thông báo cho chúng tôi càng sớm càng tốt. Và nhớ mang theo giấy giới thiệu từ bác sĩ Trần Văn B.",
      time: "14:20 PM, 27/04/2025",
      isRead: true
    },
    {
      id: 4,
      senderId: "patient",
      text: "Vâng, tôi hiểu rồi. Tôi đang dùng thuốc trị tăng huyết áp, điều này có ảnh hưởng gì không ạ?",
      time: "14:25 PM, 27/04/2025",
      isRead: true
    },
    {
      id: 5,
      senderId: 2,
      text: "Thuốc tăng huyết áp có thể vẫn dùng được với một ít nước trước thủ thuật. Tuy nhiên, tôi cần biết chính xác loại thuốc anh đang sử dụng để đảm bảo an toàn. Anh có thể cho tôi biết tên thuốc không?",
      time: "14:30 PM, 27/04/2025",
      isRead: true
    },
    {
      id: 6,
      senderId: "patient",
      text: "Tôi đang sử dụng Amlodipine 5mg, uống mỗi sáng một viên.",
      time: "14:35 PM, 27/04/2025",
      isRead: true
    },
    {
      id: 7,
      senderId: 2,
      text: "Amlodipine 5mg có thể tiếp tục sử dụng bình thường vào buổi sáng của ngày làm thủ thuật. Nhưng hãy chỉ uống với một ngụm nước nhỏ, không uống nhiều. Có gì thắc mắc anh cứ hỏi thêm nhé.",
      time: "14:40 PM, 27/04/2025",
      isRead: false
    }
  ],
  4: [
    {
      id: 1,
      senderId: 4,
      text: "Chào anh Nguyễn Văn A, tôi là Phạm Thị E từ phòng dịch vụ khách hàng. Tôi liên hệ để xác nhận rằng anh đã nhận được toàn bộ tài liệu hướng dẫn chuẩn bị cho các buổi khám sắp tới chưa ạ?",
      time: "09:00 AM, 28/04/2025",
      isRead: true
    },
    {
      id: 2,
      senderId: "patient",
      text: "Chào chị, tôi đã nhận được email về buổi khám ngày 30/04 với bác sĩ Trần Văn B, nhưng chưa thấy thông tin về buổi nội soi ngày 10/05.",
      time: "09:15 AM, 28/04/2025",
      isRead: true
    },
    {
      id: 3,
      senderId: 4,
      text: "Cảm ơn anh đã thông báo. Tôi sẽ kiểm tra và gửi lại thông tin về buổi nội soi ngay lập tức. Ngoài ra, anh có cần hỗ trợ thêm về thủ tục bảo hiểm hoặc chi phí không ạ?",
      time: "09:20 AM, 28/04/2025",
      isRead: true
    },
    {
      id: 4,
      senderId: "patient",
      text: "Tôi muốn biết liệu bảo hiểm y tế của tôi có chi trả cho buổi nội soi không? Và nếu có, tôi cần chuẩn bị những giấy tờ gì?",
      time: "09:25 AM, 28/04/2025",
      isRead: true
    },
    {
      id: 5,
      senderId: 4,
      text: "Bảo hiểm y tế sẽ chi trả một phần chi phí nội soi nếu có chỉ định từ bác sĩ. Anh cần mang theo thẻ BHYT, giấy giới thiệu từ bác sĩ Trần Văn B, và giấy chứng minh nhân dân/căn cước công dân. Tôi sẽ gửi email chi tiết về các giấy tờ cần thiết và tỷ lệ chi trả cụ thể.",
      time: "09:30 AM, 28/04/2025",
      isRead: false
    }
  ]
};

function PatientMessages() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  // Lọc danh sách liên hệ theo từ khóa tìm kiếm
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Khi chọn một liên hệ, tải tin nhắn
  useEffect(() => {
    if (selectedContact) {
      setMessages(messagesHistory[selectedContact.id] || []);
    }
  }, [selectedContact]);

  // Cuộn xuống tin nhắn cuối cùng khi tin nhắn thay đổi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Xử lý gửi tin nhắn mới
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !selectedContact) return;

    const newMsg = {
      id: messages.length + 1,
      senderId: "patient",
      text: newMessage,
      time: new Date().toLocaleString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      isRead: true
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  // Chọn một liên hệ
  const selectContact = (contact) => {
    setSelectedContact(contact);
  };

  return (
    <div className="bg-blue-50 min-h-screen pb-10">
      {/* Patient Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl mr-4">
                {patientInfo.avatar}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{patientInfo.name}</h1>
                <p className="text-sm text-gray-500">
                  Mã BN: {patientInfo.id} | {patientInfo.age} tuổi | {patientInfo.gender}
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

      {/* Chat Interface */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex h-[calc(80vh-100px)]">
            {/* Contacts Sidebar */}
            <div className="w-full md:w-1/3 bg-white border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">Tin nhắn</h2>
                <div className="mt-2 relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-3 top-3 text-gray-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="overflow-y-auto h-[calc(80vh-200px)]">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-4 border-b border-gray-200 hover:bg-blue-50 cursor-pointer ${
                      selectedContact && selectedContact.id === contact.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => selectContact(contact)}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                          {contact.avatar}
                        </div>
                        {contact.isOnline && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">{contact.name}</h3>
                        <p className="text-xs text-gray-500">{contact.department}</p>
                        <p className="text-xs text-gray-500">{contact.role}</p>
                      </div>
                      <div className="ml-auto flex flex-col items-end">
                        <p className="text-xs text-gray-500">{contact.lastActive}</p>
                        {messagesHistory[contact.id] && messagesHistory[contact.id].some(msg => msg.senderId === contact.id && !msg.isRead) && (
                          <span className="mt-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">Mới</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="hidden md:flex md:flex-col md:w-2/3 bg-gray-50">
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                        {selectedContact.avatar}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">{selectedContact.name}</h3>
                        <p className="text-xs text-gray-500">{selectedContact.department} • {selectedContact.role}</p>
                      </div>
                      <div className="ml-auto">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedContact.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedContact.isOnline ? 'Đang trực tuyến' : selectedContact.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages List */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === 'patient' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 ${
                              message.senderId === 'patient'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-800 border border-gray-200'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${message.senderId === 'patient' ? 'text-blue-100' : 'text-gray-500'}`}>
                              {message.time}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <form onSubmit={handleSendMessage} className="flex">
                      <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </form>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <p>Đính kèm file, hình ảnh bằng cách kéo thả hoặc nhấn vào biểu tượng bên dưới</p>
                      <div className="flex space-x-3">
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-full items-center justify-center bg-gray-50 p-4">
                  <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Chưa có cuộc trò chuyện nào được chọn</h3>
                  <p className="mt-1 text-gray-500 text-center">
                    Chọn một người từ danh sách để bắt đầu cuộc trò chuyện hoặc xem lịch sử tin nhắn
                  </p>
                </div>
              )}
            </div>

            {/* Mobile: Show message only when no contact is selected */}
            <div className="flex md:hidden flex-col w-full items-center justify-center bg-gray-50 p-4">
              <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Chọn một cuộc trò chuyện</h3>
              <p className="mt-1 text-gray-500 text-center">
                Nhấn vào một liên hệ để xem tin nhắn chi tiết
              </p>
            </div>
          </div>
        </div>

        {/* Quick Guide */}
        <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-blue-600 text-white">
            <h2 className="text-lg font-medium">Hướng dẫn sử dụng</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="text-md font-medium text-gray-800">Liên hệ với bác sĩ</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Sử dụng tin nhắn để liên hệ trực tiếp với bác sĩ phụ trách hoặc nhân viên y tế về các vấn đề không khẩn cấp.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-md font-medium text-gray-800">Thời gian phản hồi</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Bác sĩ và nhân viên y tế thường phản hồi trong vòng 24 giờ làm việc. Đối với các vấn đề khẩn cấp, vui lòng gọi cho đường dây nóng hoặc đến trực tiếp bệnh viện.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-md font-medium text-gray-800">Chia sẻ thông tin</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Bạn có thể chia sẻ hình ảnh và tài liệu liên quan đến tình trạng sức khỏe của mình với bác sĩ để được tư vấn tốt hơn. Tất cả thông tin được bảo mật theo quy định.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Chat Window (appears when a contact is selected) */}
        {selectedContact && (
          <div className="md:hidden fixed inset-0 z-10 bg-white flex flex-col">
            {/* Mobile Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center">
              <button 
                onClick={() => setSelectedContact(null)}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="flex items-center">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                  {selectedContact.avatar}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{selectedContact.name}</h3>
                  <p className="text-xs text-gray-500">{selectedContact.department}</p>
                </div>
              </div>
              <div className="ml-auto">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  selectedContact.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedContact.isOnline ? 'Đang trực tuyến' : selectedContact.lastActive}
                </span>
              </div>
            </div>

            {/* Mobile Messages List */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'patient' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 ${
                        message.senderId === 'patient'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.senderId === 'patient' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Mobile Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <div className="flex space-x-3">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientMessages;