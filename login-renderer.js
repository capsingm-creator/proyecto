const loginForm = document.getElementById('login-form');
const messageDiv = document.getElementById('login-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const credentials = Object.fromEntries(formData.entries());
    
    messageDiv.innerHTML = '<p>Verificando credenciales...</p>';
    try {
        const result = await window.apiAuth.attemptLogin(credentials);
        if (result.status === 'success') {
            messageDiv.innerHTML = '<p style="color: green;">Success! System starting...</p>';
            window.apiAuth.loginSuccess(result.user); 
        } else {
            messageDiv.innerHTML = `<p style="color: red;">${result.message || 'Error en el login'}</p>`;
        }
    } catch (err) {
        messageDiv.innerHTML = '<p style="color: red;">Error</p>';
    }
});
