// src/routes/index.jsx
import Home from '../pages/Home';
import Login from '../pages/Login';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
];

export { publicRoutes };