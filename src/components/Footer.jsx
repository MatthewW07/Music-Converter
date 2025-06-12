import React from 'react';

function Footer() {
  const styles = {
    footer: {
      backgroundColor: '#1f2937',
      color: 'white',
      marginTop: 'auto',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1.5rem 1rem'
    },
    flexRow: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    flexRowMd: {
      '@media (minWidth: 768px)': {
        flexDirection: 'row',
        marginBottom: '0',
      }
    },
    leftSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    leftSectionMd: {
      '@media (minWidth: 768px)': {
        alignItems: 'flex-start',
        marginBottom: '0',
      }
    },
    heading: {
      fontSize: '1.125rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
    },
    description: {
      color: '#9ca3af', // text-gray-400
      fontSize: '0.875rem',
      textAlign: 'center',
    },
    descriptionMd: {
      '@media (minWidth: 768px)': {
        textAlign: 'left',
      }
    },
    centerSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    centerSectionMd: {
      '@media (minWidth: 768px)': {
        marginBottom: '0',
      }
    },
    featuresHeading: {
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.5rem',
      color: '#d1d5db', // text-gray-300
    },
    featuresContainer: {
      display: 'flex',
      gap: '1rem',
      fontSize: '0.75rem',
      color: '#9ca3af', // text-gray-400
    },
    rightSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    rightSectionMd: {
      '@media (minWidth: 768px)': {
        alignItems: 'flex-end',
      }
    },
    statusContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0.5rem',
    },
    statusDot: {
      width: '0.5rem',
      height: '0.5rem',
      backgroundColor: '#10b981', // bg-green-500
      borderRadius: '9999px',
      marginRight: '0.5rem',
    },
    statusText: {
      fontSize: '0.75rem',
      color: '#9ca3af', // text-gray-400
    },
    versionText: {
      fontSize: '0.75rem',
      color: '#6b7280', // text-gray-500
    },
    bottomSection: {
      borderTop: '1px solid #374151', // border-t border-gray-700
      marginTop: '1rem',
      paddingTop: '1rem',
      textAlign: 'center',
    },
    copyright: {
      fontSize: '0.75rem',
      color: '#6b7280', // text-gray-500
    }
  };

  // Apply media query styles manually since inline styles don't support media queries
  const applyMediaStyles = (baseStyle, mediaStyle) => {
    if (window.innerWidth >= 768) {
      return { ...baseStyle, ...mediaStyle };
    }
    return baseStyle;
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.flexRow}>
          {/* Left section - App info */}
          <div style={applyMediaStyles(styles.leftSection, styles.leftSectionMd)}>
            <h3 style={styles.heading}>Matthew Wang</h3>
            <p style={applyMediaStyles(styles.description, styles.descriptionMd)}>
              Convert your piano compositions to alto saxophone notation with ease
            </p>
          </div>
          
          {/* Center section - Features */}
          <div style={applyMediaStyles(styles.centerSection, styles.centerSectionMd)}>
            <h4 style={styles.featuresHeading}>Features</h4>
            <div style={styles.featuresContainer}>
              <span>Visual Editor</span>
              <span>•</span>
              <span>Real-time Conversion</span>
              <span>•</span>
              <span>Export Options</span>
            </div>
          </div>
          
          {/* Right section - Status and version */}
          <div style={applyMediaStyles(styles.rightSection, styles.rightSectionMd)}>
            <div style={styles.statusContainer}>
              <div style={styles.statusDot}></div>
              <span style={styles.statusText}>Ready</span>
            </div>
            <p style={styles.versionText}>Version 1.0.0</p>
          </div>
        </div>
        
        {/* Bottom section - Copyright */}
        <div style={styles.bottomSection}>
          <p style={styles.copyright}>
            © 2025 Piano to Alto Sax Converter. Built with VexFlow and React.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
