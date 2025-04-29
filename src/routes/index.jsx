// src/routes/index.jsx
import Home from '../pages/Home';
import Login from '../pages/Login';
import DoctorDashboard from '../pages/DoctorDashboard';
import PatientDashboard from '../pages/PatientDashboard';
import DoctorLayout from '../components/DoctorLayout';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/doctor', component: DoctorDashboard, layout: DoctorLayout },
];

const privateRoutes = [
    // { path: '/doctor', component: DoctorDashboard, layout: DoctorLayout },
    { path: '/patient', component: PatientDashboard },
];

export { publicRoutes, privateRoutes };