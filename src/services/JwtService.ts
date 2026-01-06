import { jwtDecode } from 'jwt-decode';
import { User } from '../entities/User';

const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

const getUserRoles = (): string[] => {
  const accessToken = getAccessToken();
  if (!accessToken) return [];
  
  try {
    const decoded = jwtDecode<User>(accessToken);
    return decoded.roles || [];
  } catch (error) {
    console.error('Error decoding token:', error);
    return [];
  }
};

const getUserEmail = (): string => {
  const accessToken = getAccessToken();
  if (!accessToken) return "";
  
  try {
    const decoded = jwtDecode<User>(accessToken);
    return decoded.email || "";
  } catch (error) {
    return "";
  }
};

const getUsername = (): string => {
  const accessToken = getAccessToken();
  if (!accessToken) return "";
  
  try {
    const decoded = jwtDecode<User>(accessToken);
    return decoded.username || "";
  } catch (error) {
    return "";
  }
};

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<any>(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

const verifyToken = (): boolean => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken && !refreshToken) {
    return false;
  }
  
  if (accessToken && !isTokenExpired(accessToken)) {
    return true;
  }
  
  if (refreshToken && !isTokenExpired(refreshToken)) {
    // add refresh api later
    return false;
  }

  return false;
};

const logOut = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export { verifyToken, getUserEmail, getUserRoles, getUsername, logOut, isTokenExpired };