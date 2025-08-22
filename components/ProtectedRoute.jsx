// components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../src/firebase'; // Adjust path to your Firebase config
import { onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser); // Debug log
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <div className="text-xl text-cyan-400 font-mono">
            Authenticating...
          </div>
        </div>
      </div>
    );
  }

  console.log('User state:', user); // Debug log
  console.log('Redirecting to signin:', !user); // Debug log

  // Fixed: Changed from "/login" to "/signin" to match your routes
  return user ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;