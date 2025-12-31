import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import LoginLayout from '../layouts/LoginLayout';

// Importação das páginas (criaremos depois)
// import Home from '../pages/Home';
// import Post from '../pages/Post';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <LoginLayout>
          <Login />
        </LoginLayout>
      } />
      {/* Exemplo de rota, substitua pelos componentes reais depois */}
      {/* <Route path="/" element={<Home />} /> */}
      {/* <Route path="/post/:id" element={<Post />} /> */}
    </Routes>
  );
};

export default AppRoutes;
