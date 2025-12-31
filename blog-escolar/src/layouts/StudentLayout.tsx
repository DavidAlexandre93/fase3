import React from 'react';

const StudentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <header style={{ background: '#1976d2', color: '#fff', padding: '1rem' }}>
        <h2>Área do Estudante</h2>
      </header>
      <main>{children}</main>
      <footer style={{ background: '#eee', padding: '0.5rem', textAlign: 'center' }}>
        <small>© 2025 Blog Escolar - Estudante</small>
      </footer>
    </div>
  );
};

export default StudentLayout;
