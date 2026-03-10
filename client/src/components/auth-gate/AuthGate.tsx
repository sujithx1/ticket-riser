import { useEffect, useState } from 'react';
import { UseGetSession } from '../../api/auth.api';
import { useAuth } from "./AuthContext";

export const SSO_LOGIN_URL = `${import.meta.env.VITE_AUTH_URL}/api/login?client_id=${import.meta.env.VITE_CLIENT_ID}`;

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const  {login}=useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionIdFromUrl = params.get('app_session_id');

    if (sessionIdFromUrl) {

      console.log('sessionIdFromUrl', sessionIdFromUrl);
      localStorage.setItem('app_session_id', sessionIdFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
      setToken(sessionIdFromUrl);
      return;
    }

    const storedToken = localStorage.getItem('app_session_id');
    console.log('storedToken', storedToken);  
    if (!storedToken) {
      console.log('no token');
      const returnUrl = encodeURIComponent(window.location.origin);
      window.location.href = `${SSO_LOGIN_URL}&redirect_uri=${returnUrl}`;
    } else {
      setToken(storedToken);
    }
  }, []);

  const { data, isLoading,error } = UseGetSession({
    enabled: !!token,
  });
  
  console.log('error', error);

  useEffect(() => {
    if (data) {
      login(data.user);
      // localStorage.setItem('user', JSON.stringify(data));
    }
  }, [data,login]);

  if (!token || isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGate;
