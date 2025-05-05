// src/routes/index.jsx
import Home from '../pages/Home';
import Login from '../pages/Login';
import Unauthorized from '../pages/Unauthorized';
import DoctorDashboard from '../pages/DoctorDashboard';
import PatientDashboard from '../pages/PatientDashboard';
import PatientList from '../pages/DoctorDashboard/patient/patientList.jsx';

import SampleList from '../pages/DoctorDashboard/sample/sampleList.jsx';
import SampleDetail from '../pages/DoctorDashboard/sample/sampleDetail.jsx';

import NewPatient from '../pages/DoctorDashboard/patient/newPatient.jsx';
import LinkPatient from '../pages/DoctorDashboard/patient/linkPatient.jsx';
import PatientDetail from '../pages/DoctorDashboard/patient/patientDetail.jsx';
import PrescribeMedication from '../pages/DoctorDashboard/prescription/prescribeMedication.jsx';
import PrescriptionList from '../pages/DoctorDashboard/prescription/prescriptionList.jsx';
import PrescriptionDetail from '../pages/DoctorDashboard/prescription/prescriptionDetail.jsx';
import DoctorLayout from '../components/DoctorLayout';
import PatientLayout from '../components/PatientLayout';
import PatientTestResults from '../pages/PatientDashboard/patientTestResults.jsx';
import PatientAppointments from '../pages/PatientDashboard/patientAppointments.jsx';
import PatientMedications from '../pages/PatientDashboard/patientMedications.jsx';
import PatientProfile from '../pages/PatientDashboard/patientProfile.jsx';
import PatientMessages from '../pages/PatientDashboard/patientMessages.jsx';
import PatientHealth from '../pages/PatientDashboard/patientHealth.jsx';

// Các routes công khai - không yêu cầu đăng nhập
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/unauthorized', component: Unauthorized },
];

// Routes cho Bác sĩ
const doctorRoutes = [
    { 
        path: '/doctor', 
        component: DoctorDashboard,
        layout: DoctorLayout 
    },
    { 
        path: '/doctor/patients', 
        component: PatientList,
        layout: DoctorLayout 
    },
    { 
        path: '/doctor/patients/new', 
        component: NewPatient,
        layout: DoctorLayout 
    },
    { 
        path: '/doctor/patients/link', 
        component: LinkPatient,
        layout: DoctorLayout 
    },
    {
        path: '/doctor/patients/:patientId',
        component: PatientDetail,
        layout: DoctorLayout
    },
    // Thêm routes mới cho kê đơn thuốc
    {
        path: '/doctor/patients/:patientId/prescribe',
        component: PrescribeMedication,
        layout: DoctorLayout
    },
    {
        path: '/doctor/patients/:patientId/prescriptions',
        component: PrescriptionList,
        layout: DoctorLayout
    },
    {
        path: '/doctor/patients/:patientId/prescriptions/:prescriptionId',
        component: PrescriptionDetail,
        layout: DoctorLayout
    },
    { 
        path: '/doctor/samples', 
        component: SampleList,
        layout: DoctorLayout 
    },
    {
      path: '/doctor/samples/:sampleId',
      component: SampleDetail,
      layout: DoctorLayout
    },
];

// Routes cho Bệnh nhân
const patientRoutes = [
    { 
        path: '/patient', 
        component: PatientDashboard,
        layout: PatientLayout 
    },
    { 
        path: '/patient/results', 
        component: PatientTestResults,
        layout: PatientLayout 
    },
    { 
        path: '/patient/appointments', 
        component: PatientAppointments,
        layout: PatientLayout 
    },
    { 
        path: '/patient/medications', 
        component: PatientMedications,
        layout: PatientLayout 
    },
    { 
        path: '/patient/profile', 
        component: PatientProfile,
        layout: PatientLayout 
    },
    { 
        path: '/patient/messages', 
        component: PatientMessages,
        layout: PatientLayout 
    },
    { 
        path: '/patient/health', 
        component: PatientHealth,
        layout: PatientLayout 
    },
];

export { publicRoutes, doctorRoutes, patientRoutes };