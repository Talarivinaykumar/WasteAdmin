import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const useAdminAuth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const login = async (email, password) => {
        setError('');
        setLoading(true);
        setSuccess(false);

        try {
            const { data } = await api.post('/auth/login', { email, password });

            if (data.role !== 'admin') {
                throw new Error('Not authorized as admin');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setSuccess(true);
            navigate('/dashboard');
            return data.token;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    return { loading, error, success, login, logout };
};

const useChangePassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const changePassword = async (oldPassword, newPassword) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await api.put('/auth/profile', { password: newPassword });
            setSuccess(true);
            alert('Password changed successfully');
            navigate('/dashboard');
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { changePassword, isLoading, error, success };
};

export { useAdminAuth, useChangePassword };

//   register: async (userData) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//       });

//       if (!response.ok) {
//         throw new Error('Registration failed');
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Registration error:', error);
//       throw error;
//     }
//   },

//   logout: () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   },

//   getCurrentUser: () => {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user) : null;
//   },

//   isAuthenticated: () => {
//     return !!localStorage.getItem('token');
//   },

//   getToken: () => {
//     return localStorage.getItem('token');
//   }
// };
