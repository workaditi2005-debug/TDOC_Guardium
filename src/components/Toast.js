import React from 'react';

export default function Toast({ message, type = 'error' }) {
  if (!message) return null;

  const styles = {
    error: {
      gradient: 'linear-gradient(135deg, #dc2626, #991b1b)',
      glow: 'rgba(220, 38, 38, 0.4)',
      icon: '✕'
    },
    success: {
      gradient: 'linear-gradient(135deg, #16a34a, #15803d)',
      glow: 'rgba(22, 163, 74, 0.4)',
      icon: '✓'
    },
    warning: {
      gradient: 'linear-gradient(135deg, #ca8a04, #a16207)',
      glow: 'rgba(202, 138, 4, 0.4)',
      icon: '⚠'
    },
    info: {
      gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
      glow: 'rgba(37, 99, 235, 0.4)',
      icon: 'ℹ'
    }
  };

  const currentStyle = styles[type] || styles.error;

  return (
    <div style={containerStyle}>
      <style>{keyframes}</style>
      {/* Toast card */}
      <div style={toastWrapperStyle}>
        {/* Glow effect */}
        <div style={{
          ...glowStyle,
          background: currentStyle.gradient,
          boxShadow: `0 0 30px ${currentStyle.glow}`
        }}></div>
        
        {/* Main content */}
        <div style={{
          ...contentStyle,
          background: currentStyle.gradient
        }}>
          {/* Icon */}
          <div style={iconWrapperStyle}>
            <span style={iconStyle}>{currentStyle.icon}</span>
          </div>
          
          {/* Message */}
          <span style={messageStyle}>{message}</span>
        </div>
        
        {/* Circuit lines decoration */}
        <div style={circuitLeftStyle}></div>
        <div style={circuitRightStyle}></div>
      </div>
    </div>
  );
}

const keyframes = `
  @keyframes slideUp {
    from {
      transform: translate(-50%, 20px);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
`;

const containerStyle = {
  position: 'fixed',
  bottom: '12px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 50,
  animation: 'slideUp 0.3s ease-out',
  pointerEvents: 'none'
};

const toastWrapperStyle = {
  position: 'relative',
  pointerEvents: 'auto'
};

const glowStyle = {
  position: 'absolute',
  inset: '-4px',
  borderRadius: '8px',
  filter: 'blur(12px)',
  opacity: 0.6,
  animation: 'pulse 2s infinite'
};

const contentStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '12px 16px',
  borderRadius: '8px',
  color: 'white',
  fontSize: '14px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  minWidth: '280px',
  maxWidth: '350px'
};

const iconWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  flexShrink: 0
};

const iconStyle = {
  fontSize: '16px',
  fontWeight: 'bold'
};

const messageStyle = {
  flex: 1,
  lineHeight: '1.4',
  fontWeight: '500'
};

const circuitLeftStyle = {
  position: 'absolute',
  left: '-20px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '20px',
  height: '1px',
  background: 'linear-gradient(to left, rgba(255, 255, 255, 0.3), transparent)',
  pointerEvents: 'none'
};

const circuitRightStyle = {
  position: 'absolute',
  right: '-20px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '20px',
  height: '1px',
  background: 'linear-gradient(to right, rgba(255, 255, 255, 0.3), transparent)',
  pointerEvents: 'none'
};
