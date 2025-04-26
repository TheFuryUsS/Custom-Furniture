import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import './App.css'
import TestApi from './components/TestApi';

import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';

import DesignsPage from './pages/DesignsPage';
import EditorPage from './pages/EditorPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route path="/editor" element={
          <PrivateRoute>
            <AuthLayout />
          </PrivateRoute>
        }>
          <Route index element={<EditorPage />} />
          <Route path="designs" element={<DesignsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}