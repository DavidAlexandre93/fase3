import React, { useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const NightModeToggle: React.FC = () => {
  const [night, setNight] = useState(() => {
    // Preferência do usuário
    return localStorage.getItem('nightMode') === 'true';
  });

  React.useEffect(() => {
    if (night) {
      document.body.classList.add('night-mode');
    } else {
      document.body.classList.remove('night-mode');
    }
    localStorage.setItem('nightMode', night ? 'true' : 'false');
  }, [night]);

  return (
    <button
      title={night ? 'Desativar modo noturno' : 'Ativar modo noturno'}
      onClick={() => setNight(n => !n)}
      style={{ background: night ? '#222' : undefined, color: night ? '#ffd700' : undefined, marginLeft: 8, display: 'flex', alignItems: 'center', gap: 6 }}
    >
      {night ? <FaSun /> : <FaMoon />}
      <span style={{ fontSize: 14, marginLeft: 2 }}>Modo noturno</span>
    </button>
  );
};

export default NightModeToggle;
