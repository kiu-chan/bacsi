// Cập nhật file: src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, doctorRoutes, patientRoutes } from './routes';
import DefaultLayout from './components/Layout/DefaultLayout';
import { AuthProvider } from './contexts/AuthContext';
import { DoctorRoute } from './components/RouteGuards/DoctorRoute';
import { PatientRoute } from './components/RouteGuards/PatientRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            {publicRoutes.map((route, index) => {
              const Page = route.component;
              
              // Nếu layout là null thì render component trực tiếp
              if (route.layout === null) {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={<Page />}
                  />
                );
              }

              // Sử dụng layout được chỉ định hoặc mặc định là DefaultLayout
              const Layout = route.layout || DefaultLayout;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}

            {/* Doctor Routes */}
            {doctorRoutes.map((route, index) => {
              const Layout = route.layout || DefaultLayout;
              const Page = route.component;
              
              return (
                <Route
                  key={`doctor-${index}`}
                  path={route.path}
                  element={
                    <Layout>
                      <DoctorRoute>
                        <Page />
                      </DoctorRoute>
                    </Layout>
                  }
                />
              );
            })}

            {/* Patient Routes */}
            {patientRoutes.map((route, index) => {
              const Layout = route.layout || DefaultLayout;
              const Page = route.component;
              
              return (
                <Route
                  key={`patient-${index}`}
                  path={route.path}
                  element={
                    <Layout>
                      <PatientRoute>
                        <Page />
                      </PatientRoute>
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;