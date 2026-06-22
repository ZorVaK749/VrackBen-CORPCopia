import React from 'react';

export default function Pago({ isDarkMode }) {
  const bgColor = isDarkMode ? '#1e1e1e' : '#f9f9f9';
  const textColor = isDarkMode ? '#fff' : '#333';

  return (
    <div style={{ padding: '40px', backgroundColor: bgColor, color: textColor, minHeight: '80vh' }}>
      <h1>Checkout y Pago</h1>
      <p>Aquí se procesará el pago de los repuestos y servicios del carrito.</p>
    </div>
  );
}
