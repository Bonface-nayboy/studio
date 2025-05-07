import { FC } from 'react';

export const Logo: FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 0, overflow: 'hidden', width: 150, height: 80 }}>
    <img
      src="/rees logo.png"
      alt="Rees Logo"
      style={{ objectFit: 'fill', width: '100%', height: '100%' }}
    />
  </div>
);
