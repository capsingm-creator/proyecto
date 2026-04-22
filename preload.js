const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onNavigate: (callback) => {
        ipcRenderer.removeAllListeners('navigation'); // Limpia listeners previos
        ipcRenderer.on('navigation', (event, page) => callback(page));
    }
});

contextBridge.exposeInMainWorld('apiAuth', {
    attemptLogin: async (credentials) => {
        console.log(credentials);   
        const response = await fetch('http://localhost/Proyectocamilo/api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        return await response.json();
    },

    loginSuccess: (userData) => {
        ipcRenderer.send('login-success', userData);
    },

    onPermissionsSet: (callback) => {
        ipcRenderer.on('set-user-permissions', (event, credentials) => callback(credentials))
    }
});

contextBridge.exposeInMainWorld('apiProduct', {
    createProduct: async (formData) => {
        console.log(formData);
        const response = await fetch('http://localhost/Proyectocamilo/api/create_product.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        return await response.json();
    },
    searchProduct: async(formData)=>{
        const response = await fetch('http://localhost/Proyectocamilo/api/search_product.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        return await response.json();
    },
    saveProduct: async (formData) => {
        console.log(formData);
        const response = await fetch('http://localhost/Proyectocamilo/api/save_product.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        return await response.json();
    }
});

contextBridge.exposeInMainWorld('apiInvoice', {

    searchInvoices: async (formData) => {
        console.log(formData);
        const response = await fetch('http://localhost/Proyectocamilo/api/search_invoice.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        return await response.json();
    },

    searchInvoicesClient:async (formData) => {
        console.log(formData);
        const response = await fetch('http://localhost/Proyectocamilo/api/search_invoice_client.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        return await response.json();
    }


});

contextBridge.exposeInMainWorld('apiUser', {
    createUser: async (formData) => {
        console.log(formData);
        const response = await fetch('http://localhost/Proyectocamilo/api/create_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        return await response.json();
    },
    searchUser: async(formData)=>{
        const response = await fetch('http://localhost/Proyectocamilo/api/search_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        return await response.json();
    },
    saveUser: async (formData) => {
        console.log(formData);
        const response = await fetch('http://localhost/Proyectocamilo/api/save_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        return await response.json();
    }
});