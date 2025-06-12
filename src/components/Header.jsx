import React from 'react';

function Header() {
  const styles = {
    header: {
      backgroundColor: '#2563eb',
      color: 'white',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      alignItems: 'center',
    },
    container: {
      maxWidth: '1200px',
      alignItems: 'center',
      margin: '0 auto',
      padding: '1 1.5rem',
    },
    flexBetween: {
      display: 'flex',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      height: '4rem',
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      marginRight: '0.75rem',
    },
    logoWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    svg: {
      width: '2rem',
      height: '2rem',
      fill: 'currentColor',
    },
    svgSmall: {
      width: '1.5rem',
      height: '1.5rem',
      fill: 'currentColor',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.flexBetween}>
          {/* Logo and Title */}
          <div style={styles.logoContainer}>
            <div style={styles.logoWrapper}>
              <svg style={styles.svg} viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              <h1 style={styles.title}>Piano to Alto Sax Converter</h1>
              <svg style={styles.svgSmall} viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
