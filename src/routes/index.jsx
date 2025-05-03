// src/routes/index.jsx
import Home from '../pages/Home';
import Login from '../pages/Login';
import DoctorDashboard from '../pages/DoctorDashboard';
import PatientDashboard from '../pages/PatientDashboard';
import PatientList from '../pages/DoctorDashboard/patientList.jsx'; // Import trang danh sách bệnh nhân
import DoctorLayout from '../components/DoctorLayout';
import PatientLayout from '../components/PatientLayout';
import PatientTestResults from '../pages/PatientDashboard/patientTestResults.jsx'; // Import trang kết quả xét nghiệm
import PatientAppointments from '../pages/PatientDashboard/patientAppointments.jsx'; // Import trang lịch hẹn
import PatientMedications from '../pages/PatientDashboard/patientMedications.jsx'; // Import trang đơn thuốc
import PatientProfile from '../pages/PatientDashboard/patientProfile.jsx'; // Import trang hồ sơ cá nhân
import PatientMessages from '../pages/PatientDashboard/patientMessages.jsx'; // Import trang tin nhắn

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/doctor', component: DoctorDashboard, layout: DoctorLayout },
    { path: '/patient', component: PatientDashboard, layout: PatientLayout },
    { path: '/doctor/patients', component: PatientList, layout: DoctorLayout }, // Thêm route cho trang danh sách bệnh nhân
    { path: '/patient/results', component: PatientTestResults, layout: PatientLayout }, // Thêm route cho trang kết quả xét nghiệm
    { path: '/patient/appointments', component: PatientAppointments, layout: PatientLayout }, // Thêm route cho trang lịch hẹn
    { path: '/patient/medications', component: PatientMedications, layout: PatientLayout }, // Thêm route cho trang đơn thuốc
    { path: '/patient/profile', component: PatientProfile, layout: PatientLayout }, // Thêm route cho trang hồ sơ cá nhân
    { path: '/patient/messages', component: PatientMessages, layout: PatientLayout }, // Thêm route cho trang tin nhắn
];

const privateRoutes = [
    // { path: '/doctor', component: DoctorDashboard, layout: DoctorLayout },
    // { path: '/patient', component: PatientDashboard, layout: PatientLayout },
];

export { publicRoutes, privateRoutes };