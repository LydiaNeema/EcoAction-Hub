"use client";
import { useState } from 'react';

export default function TestAPIPage() {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const testBasicAPI = async () => {
        setLoading(true);
        setResult('Testing basic API connection...');
        
        try {
            const response = await fetch('http://localhost:5000/', {
                method: 'GET',
            });
            
            if (response.ok) {
                const data = await response.json();
                setResult(`Basic API Success!\n${JSON.stringify(data, null, 2)}`);
            } else {
                setResult(`Basic API Error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            setResult(`Basic API Network Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const testAuthAPI = async () => {
        setLoading(true);
        setResult('Testing auth API...');
        
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';
        console.log('API_BASE from env:', API_BASE);
        
        try {
            const testData = {
                full_name: 'Test User',
                email: `test${Date.now()}@example.com`,
                password: 'password123'
            };
            
            console.log('Making request to:', `${API_BASE}/auth/register`);
            console.log('Request data:', testData);
            
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData)
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            const data = await response.json();
            console.log('Response data:', data);
            
            if (response.ok) {
                setResult(`Auth API Success!\n${JSON.stringify(data, null, 2)}`);
            } else {
                setResult(`Auth API Error: ${response.status}\n${JSON.stringify(data, null, 2)}`);
            }
        } catch (error) {
            console.error('Auth API Error:', error);
            setResult(`Auth API Network Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const testEnvVars = () => {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE;
        setResult(`Environment Variables:
NEXT_PUBLIC_API_BASE: ${apiBase}
Default fallback: http://localhost:5000/api
Current window location: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">API Connection Test</h1>
                
                <div className="space-y-4 mb-8">
                    <button 
                        onClick={testEnvVars}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={loading}
                    >
                        Check Environment Variables
                    </button>
                    
                    <button 
                        onClick={testBasicAPI}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        disabled={loading}
                    >
                        Test Basic API (/)
                    </button>
                    
                    <button 
                        onClick={testAuthAPI}
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                        disabled={loading}
                    >
                        Test Auth API (/api/auth/register)
                    </button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Result:</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                        {loading ? 'Loading...' : result || 'Click a button to test'}
                    </pre>
                </div>
            </div>
        </div>
    );
}
