import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routes";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
