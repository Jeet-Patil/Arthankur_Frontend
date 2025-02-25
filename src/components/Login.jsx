const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store token and user type
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', data.userType);

        // Redirect based on user type
        navigate('/dashboard');
        
    } catch (error) {
        console.error('Login error:', error);
        toast.error(error.message || 'Login failed');
    }
}; 