import React from 'react';

const LoginLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5' }}>
      <main style={{ width: '100%', maxWidth: 400, padding: 24, background: '#040404ff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {children}
      </main>
    </div>
  );
};

export default LoginLayout;
