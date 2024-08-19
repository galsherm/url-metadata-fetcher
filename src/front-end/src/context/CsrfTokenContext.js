import React, { createContext, useState, useContext, useEffect } from 'react';
import config from '../config'; // Import the configuration

const CsrfTokenContext = createContext();

export const CsrfTokenProvider = ({ children }) => {
    const [csrfToken, setCsrfToken] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch(config.buildUrl(config.csrfTokenPath), {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch CSRF token');
                }

                const data = await response.json();
                setCsrfToken(data.csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
                setCsrfToken('');
            } finally {
                setLoading(false); // Set loading to false once done
            }
        };

        fetchCsrfToken();
    }, []);

    return (
        <CsrfTokenContext.Provider value={{ csrfToken, loading }}>
            {children}
        </CsrfTokenContext.Provider>
    );
};

export const useCsrfToken = () => useContext(CsrfTokenContext);
