import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function CallbackTokenLogin() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);
            navigate('/');
        } else {
            console.error('Token not found in URL');
            // Optionally redirect to an error page or show a message
        }
    }, [navigate]);

    return <div>Processing login...</div>;
}

export default CallbackTokenLogin;
