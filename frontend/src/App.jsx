import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';

import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import EditorLayout from './layouts/EditorLayout';

import DesignsPage from './pages/DesignsPage';
import EditorPage from './pages/EditorPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MobileImageUpload from './pages/MobileImageUpload';


function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>


        <Route element={<PrivateRoute><AuthLayout /></PrivateRoute>}>
          <Route path="/designs" element={<DesignsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>


        <Route element={<PrivateRoute><EditorLayout /></PrivateRoute>}>
          <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="/upload/:designId" element={<MobileImageUpload />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}