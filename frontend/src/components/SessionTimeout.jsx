import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut } from 'lucide-react';
import { isTokenExpired } from '../utils/security';

const SessionTimeout = () => {
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const checkSession = setInterval(() => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        clearInterval(checkSession);
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000;
        const now = Date.now();
        const remaining = expiryTime - now;
        
        // Show warning 5 minutes before expiry
        if (remaining < 5 * 60 * 1000 && remaining > 0) {
          setShowWarning(true);
          setTimeLeft(Math.floor(remaining / 1000 / 60));
        } else if (remaining <= 0) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      } catch (err) {
        console.error('Error checking session:', err);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkSession);
  }, [navigate]);

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg shadow-lg p-4 max-w-sm z-50 animate-bounce">
      <div className="flex items-start gap-3">
        <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-yellow-900 mb-1">
            Session Expiring Soon
          </h4>
          <p className="text-sm text-yellow-800">
            Your session will expire in approximately {timeLeft} minute{timeLeft !== 1 ? 's' : ''}. 
            Please save your work.
          </p>
        </div>
        <button
          onClick={() => setShowWarning(false)}
          className="text-yellow-600 hover:text-yellow-800"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default SessionTimeout;