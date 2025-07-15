import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/common/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Fridge from './pages/Fridge';
import AddFood from './pages/AddFood';
import MyItems from './pages/MyItems';
import FoodDetails from './pages/FoodDetails';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="fridge" element={<Fridge />} />
              <Route path="food/:id" element={<FoodDetails />} />
              <Route path="add-food" element={
                <PrivateRoute>
                  <AddFood />
                </PrivateRoute>
              } />
              <Route path="my-items" element={
                <PrivateRoute>
                  <MyItems />
                </PrivateRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;