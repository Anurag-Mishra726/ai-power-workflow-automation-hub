import { motion } from 'framer-motion';

const ErrorState = () => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, x: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        x: [0, -10, 10, -10, 0] // Shake effect
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        x: {
          duration: 0.8,
          times: [0, 0.2, 0.4, 0.6, 1],
          ease: "easeInOut"
        }
      }}
      style={{ 
        textAlign: 'center', 
        padding: '2rem', 
       // background: '#1f1f1f', 
        borderRadius: '12px',
        border: '2px solid #ef4444',
        maxWidth: '400px',
        margin: '0 auto'
      }}
    >
      <h3 style={{ 
        color: '#f87171', 
        fontSize: '1.5rem', 
        marginBottom: '1rem' 
      }}>
        Something went wrong!
      </h3>
      <p style={{ color: '#f3f4f6', marginBottom: '1.5rem' }}>
        Please try again or refresh the page.
      </p>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: '0.6rem 1.5rem',
          background: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '1.2rem',
          cursor: 'pointer',
          fontWeight: '500'
        }}
        onClick={() => window.location.reload()}
      >
        Retry
      </motion.button>
    </motion.div>
  );
};

export default ErrorState;
