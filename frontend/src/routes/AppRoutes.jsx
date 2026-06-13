import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Chat from '../pages/Chat';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from '../context/AuthContext';

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/chat" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/chat" /> : <Signup />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<Chat />} />
        {/* Redirect root to chat if logged in */}
        <Route path="/" element={<Navigate to="/chat" />} />
      </Route>

      {/* Catch all unmapped routes */}
      <Route path="*" element={<Navigate to={user ? "/chat" : "/login"} />} />
    </Routes>
  );
};

export default AppRoutes;
