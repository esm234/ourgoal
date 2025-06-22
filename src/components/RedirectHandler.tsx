import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a redirect path from 404.html
    const redirectPath = sessionStorage.getItem('redirectPath');
    
    if (redirectPath && redirectPath !== '/') {
      // Clear the stored path
      sessionStorage.removeItem('redirectPath');
      
      // Navigate to the intended path
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default RedirectHandler;
