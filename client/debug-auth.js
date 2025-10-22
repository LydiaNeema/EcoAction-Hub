// Debug version of auth service
const API_BASE = 'http://localhost:5000/api';

console.log('API_BASE:', API_BASE);

async function debugRegister() {
    console.log('Starting debug register...');
    
    const testData = {
        full_name: 'Debug User',
        email: 'debug' + Date.now() + '@example.com',
        password: 'password123'
    };
    
    console.log('Test data:', testData);
    console.log('Making request to:', `${API_BASE}/auth/register`);
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', [...response.headers.entries()]);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Success! Response data:', data);
        return data;
        
    } catch (error) {
        console.error('Error occurred:', error);
        console.error('Error type:', typeof error);
        console.error('Error message:', error.message);
        throw error;
    }
}

// Test it
debugRegister().then(result => {
    console.log('Final result:', result);
}).catch(error => {
    console.error('Final error:', error);
});
