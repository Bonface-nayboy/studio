import { FC, useEffect, useState } from 'react';

export const Logo: FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind sm breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        width: 150,
        height: 80,
      }}
    >
      <img
        src={isMobile ? '/andlogo.png' : '/andlogo.png'}
        alt="Rees Logo"
        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
      />
    </div>
  );
};
