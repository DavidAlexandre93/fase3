import React from 'react';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      {/* Aqui você pode colocar header, footer, menu, etc */}
      <header>
        <h2>Blog Escolar</h2>
      </header>
      <main>{children}</main>
      <footer>
        <small>© 2025 Blog Escolar</small>
      </footer>
    </div>
  );
};

export default MainLayout;
