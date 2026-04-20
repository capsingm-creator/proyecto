window.electronAPI.onNavigate(async (page) => {
    console.log('Navegando a:', page);
    window.currentPage = page; // Guardamos la página actual para usarla en las validaciones
    const container = document.getElementById('content');
    
    if (!container) {
        console.error('The element doesnt exit');
        return;
    }
    
    try {
        const response = await fetch(`./views/${page}.html`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const html = await response.text();
        container.innerHTML = html;

        // Solo restringimos si es usuario común Y NO estamos en la página de perfil
        if (window.currentUserRole && window.currentUserRole.toLowerCase() === 'user' && page !== 'userPerfil') {
            restringirAcceso();
        }

        if (page === 'stockManage') {
            setupStockManage();
        } else if (page === 'invoices') {
            setupInvoices();
        } else if (page === 'clients'){
            setupInvoicesClient();
        } else if (page === 'userManagment'){
            setupUserManage();
        }else if (page=== 'userPerfil'){
            setupUserPerfil();
        }
    } catch (error) {
        console.error('Error cargando la vista:', error);
        container.innerHTML = "<h1>Error 404</h1><p>No se pudo cargar la vista.</p>";
    }
});

function setupStockManage() {
    
    // Get elements
    const productForm = document.getElementById('manage-form');
    const messageDiv = document.getElementById('message');
    const createBtn = document.getElementById('create');
    const searchBtn = document.getElementById('search');
    const saveBtn = document.getElementById('save');

    // DOM
    if (!productForm || !createBtn) {
        console.error("No se encontró el formulario o el botón en el HTML");
        return;
    }
    //create 
    createBtn.addEventListener('click', async (event) => {
        event.preventDefault();
  
        const formData = new FormData(productForm);
        const datasend = Object.fromEntries(formData.entries());

        console.log("Enviando a la API:", datasend);

        try {
            const result = await window.apiProduct.createProduct(datasend);

            if(result.status === 'success') {
                messageDiv.innerHTML = `<p style="color: green;">${result.message}</p>`;
                productForm.reset();
            } else {
                messageDiv.innerHTML = `<p style="color: red;">${result.message}</p>`;
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            messageDiv.innerHTML = `<p style="color: red">Error de red o servidor.</p>`;
        }
    });
    //search
    searchBtn.addEventListener('click', async (event) => {
        event.preventDefault();
  
        const formData = new FormData(productForm);
        const datasend = Object.fromEntries(formData.entries());

        console.log("Enviando a la API:", datasend);

        try {
            const result = await window.apiProduct.searchProduct(datasend);

            if(result.status === 'success') {
                messageDiv.innerHTML = `<p style="color: green;">User founded.</p>`;
                // Populate the form with the received data
                console.log(result.product);
                for (const key in result.product) {
                    if (Object.prototype.hasOwnProperty.call(result.product, key)) {
                        const formElement = productForm.elements[key];
                        if (formElement) {
                            formElement.value = result.product[key];
                        }
                    }
                }
            } else {
                messageDiv.innerHTML = `<p style="color: red;">${result.message}</p>`;
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            messageDiv.innerHTML = `<p style="color: red">Error red.</p>`;
        }
    });
    //save
    saveBtn.addEventListener('click', async (event) => {
        event.preventDefault();
  
        const formData = new FormData(productForm);
        const datasend = Object.fromEntries(formData.entries());

        console.log("Enviando a la API:", datasend);

        try {
            const result = await window.apiProduct.saveProduct(datasend);

            if(result.status === 'success') {
                messageDiv.innerHTML = `<p style="color: green;">${result.message}</p>`;
                productForm.reset();
            } else {
                messageDiv.innerHTML = `<p style="color: red;">${result.message}</p>`;
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            messageDiv.innerHTML = `<p style="color: red">Error de red o servidor.</p>`;
        }
    });

    
}

function setupInvoices() {
    const searchForm = document.getElementById('invoice-search-form');
    const invoicesBody = document.getElementById('invoices-body');
    const totalSum = document.getElementById('total-sum');
    const messageDiv = document.getElementById('invoice-message');
   

    if (!searchForm) return;

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(searchForm);
        const datasend = Object.fromEntries(formData.entries());
        console.log("Enviando a la API:", datasend);

        try {
            
            const result = await window.apiInvoice.searchInvoices(datasend);
            console.log("Respuesta de la API:", result); // Esto te ayudará a ver la estructura real en la consola

            if (result.status === 'success' && Array.isArray(result.invoices)) {
                invoicesBody.innerHTML = '';
                let total = 0;

                result.invoices.forEach(inv => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${inv.lpa_inv_date}</td>
                        <td>${inv.lpa_inv_client_name}</td>
                        <td>$${parseFloat(inv.lpa_inv_amount).toFixed(2)}</td>
                    `;
                    invoicesBody.appendChild(row);
                    total += parseFloat(inv.lpa_inv_amount);
                });

                totalSum.innerText = `$${total.toFixed(2)}`;
            } else if (result.status === 'success' && (!result.invoices || result.invoices.length === 0)) {
                invoicesBody.innerHTML = '<tr><td colspan="3">No se encontraron facturas.</td></tr>';
                totalSum.innerText = `$0.00`;
            } else {
                messageDiv.innerHTML = `<p style="color: red;">${result.message}</p>`;
            }
        } catch (error) {
            console.error('Search error:', error);
            messageDiv.innerHTML = `<p style="color: red">Conection error.</p>`;
        }
    });
}

function setupInvoicesClient() {
    const searchForm = document.getElementById('invoice-search-form');
    const invoicesBody = document.getElementById('invoices-body');
    const totalSum = document.getElementById('total-sum');
    const messageDiv = document.getElementById('invoice-message');
   

    if (!searchForm) return;

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(searchForm);
        const datasend = Object.fromEntries(formData.entries());
        console.log("Enviando a la API:", datasend);

        try {
            
            const result = await window.apiInvoice.searchInvoicesClient(datasend);
            console.log("Respuesta de la API:", result); // Esto te ayudará a ver la estructura real en la consola

            if (result.status === 'success' && Array.isArray(result.invoices)) {
                invoicesBody.innerHTML = '';
                let total = 0;

                result.invoices.forEach(inv => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${inv.lpa_inv_date}</td>
                        <td>${inv.lpa_inv_client_name}</td>
                        <td>$${parseFloat(inv.lpa_inv_amount).toFixed(2)}</td>
                    `;
                    invoicesBody.appendChild(row);
                    total += parseFloat(inv.lpa_inv_amount);
                });

                totalSum.innerText = `$${total.toFixed(2)}`;
            } else if (result.status === 'success' && (!result.invoices || result.invoices.length === 0)) {
                invoicesBody.innerHTML = '<tr><td colspan="3">No se encontraron facturas.</td></tr>';
                totalSum.innerText = `$0.00`;
            } else {
                messageDiv.innerHTML = `<p style="color: red;">${result.message}</p>`;
            }
        } catch (error) {
            console.error('Search error:', error);
            messageDiv.innerHTML = `<p style="color: red">Conection error.</p>`;
        }
    });
}

function setupUserManage() {
    
    // Get elements
    const userForm = document.getElementById('manage-form');
    const messageDiv = document.getElementById('message');
    const createBtn = document.getElementById('create');
    const searchBtn = document.getElementById('find');
    const saveBtn = document.getElementById('save');

    //create 
    createBtn.addEventListener('click', async (event) => {
        event.preventDefault();
  
        const formData = new FormData(userForm);
        const datasend = Object.fromEntries(formData.entries());

        console.log("Enviando a la API:", datasend);

        try {
            const result = await window.apiUser.createUser(datasend);

            if(result.status === 'success') {
                messageDiv.innerHTML = `<p style="color: green;">${result.message}</p>`;
            } else {
                messageDiv.innerHTML = `<p style="color: red;">${result.message}</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.innerHTML = `<p style="color: red">Error in the servis.</p>`;
        }
    });
    //search
    searchBtn.addEventListener('click', async (event) => {
        event.preventDefault();
  
        const formData = new FormData(userForm);
        const datasend = Object.fromEntries(formData.entries());

        console.log("Enviando a la API:", datasend);

        try {
            const result = await window.apiUser.searchUser(datasend);

            if(result.status === 'success') {
                messageDiv.innerHTML = `<p style="color: green;">Product founded.</p>`;
                // Populate the form with the received data
                console.log(result.user);
                for (const key in result.user) {
                    if (Object.prototype.hasOwnProperty.call(result.user, key)) {
                        const formElement = userForm.elements[key];
                        if (formElement) {
                            formElement.value = result.user[key];
                        }
                    }
                }
            } else {
                messageDiv.innerHTML = `<p style="color: red;">${result.message}</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.innerHTML = `<p style="color: red">Error red.</p>`;
        }
    });
    //save
    saveBtn.addEventListener('click', async (event) => {
        event.preventDefault();
  
        const formData = new FormData(userForm);
        const datasend = Object.fromEntries(formData.entries());

        console.log("Enviando a la API:", datasend);

        try {
            const result = await window.apiUser.saveUser(datasend);

            if(result.status === 'success') {
                messageDiv.innerHTML = `<p style="color: green;">${result.message}</p>`;
                userForm.reset();
            } else {
                messageDiv.innerHTML = `<p style="color: red;">${result.message}</p>`;
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            messageDiv.innerHTML = `<p style="color: red">Error in the service.</p>`;
        }
    });

    
}

function setupUserPerfil(){
    const userForm = document.getElementById('manage-form');
    const messageDiv = document.getElementById('message');
    const saveBtn = document.getElementById('save');

    if (!userForm || !window.currentUserData) return;

    
    for (const key in window.currentUserData) {
        if (Object.prototype.hasOwnProperty.call(window.currentUserData, key)) {
            const formElement = userForm.elements[key];
            if (formElement) {
                formElement.value = window.currentUserData[key];
            }
        }
    }

    saveBtn.addEventListener('click', async (event) => {
        event.preventDefault();
  
        const formData = new FormData(userForm);
        const datasend = Object.fromEntries(formData.entries());

        console.log("Enviando a la API:", datasend);

        try {
            const result = await window.apiUser.saveUser(datasend);

            if(result.status === 'success') {
                messageDiv.innerHTML = `<p style="color: green;">${result.message}</p>`;
                userForm.reset();
            } else {
                messageDiv.innerHTML = `<p style="color: red;">${result.message}</p>`;
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            messageDiv.innerHTML = `<p style="color: red">Error in the service.</p>`;
        }

})
};
window.apiAuth.onPermissionsSet((userData) => {
    console.log("sesion with:", userData.lpa_user_username, "Group:", userData.lpa_user_group);
    window.currentUserRole = userData.lpa_user_group;
    window.currentUserData = userData; 
    // Añadimos la misma validación aquí para evitar bloqueos accidentales al recibir permisos
    if (window.currentUserRole && window.currentUserRole.toLowerCase() === 'user' && window.currentPage !== 'userPerfil') {
        restringirAcceso();
    }
});

function restringirAcceso() {
    const btnCreate = document.getElementById('create');
    const btnSave = document.getElementById('save');
    
    if(btnCreate) btnCreate.style.display = 'none';
    if(btnSave) btnSave.style.display = 'none';

    const inputs = document.querySelectorAll('#manage-form input');
    inputs.forEach(input => {
        if(input.id !== 'stockID' && input.id !== 'userID') { 
            input.disabled = true;
        }
    });

    const mensaje = document.getElementById('message') || document.getElementById('invoice-message');
    if (mensaje) {
        mensaje.innerHTML = "<p style='color: orange;'>Mode: read only</p>";
    }
}
