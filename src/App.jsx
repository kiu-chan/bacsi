// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import DefaultLayout from './components/Layout/DefaultLayout';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
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

            // Ngược lại sử dụng DefaultLayout
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;