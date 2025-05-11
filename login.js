
// 初始化 Firestore
const db = firebase.firestore();
const auth = firebase.auth();


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginToggle = document.getElementById('loginToggle');
    const registerToggle = document.getElementById('registerToggle');
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');

    // Toggle between login and register forms
    loginToggle.addEventListener('click', () => {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginToggle.classList.add('active');
        registerToggle.classList.remove('active');
        loginError.textContent = '';
        registerError.textContent = '';
    });

    registerToggle.addEventListener('click', () => {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        registerToggle.classList.add('active');
        loginToggle.classList.remove('active');
        loginError.textContent = '';
        registerError.textContent = '';
    });

    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        // Primero buscar el email correspondiente al username
        db.collection('users').where('username', '==', username).get()
            .then(querySnapshot => {
                if (querySnapshot.empty) {
                    throw new Error('Usuario no encontrado');
                }

                // Obtener el primer email encontrado
                const userData = querySnapshot.docs[0].data();
                const email = userData.email;

                // Iniciar sesión con Firebase Auth
                return auth.signInWithEmailAndPassword(email, password)
                    .then(() => {
                        // Guardar info en localStorage para compatibilidad con index.html
                        localStorage.setItem('currentUser', JSON.stringify({
                            username: userData.username,
                            email: userData.email
                        }));
                        window.location.href = 'index.html';
                    });
            })
            .catch((error) => {
                loginError.textContent = error.message;
            });
    });


    // Handle register form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validar contraseñas
        if (password !== confirmPassword) {
            registerError.textContent = 'Las contraseñas no coinciden';
            return;
        }

        // Crear usuario en Firebase Auth
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                // Guardar información adicional en Firestore
                return db.collection('users').doc(user.uid).set({
                    username: username,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            })
            .then(() => {
                registerError.textContent = 'Registro exitoso. Por favor, inicia sesión.';
                registerForm.reset();

                // Cambiar al formulario de login
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
                loginToggle.classList.add('active');
                registerToggle.classList.remove('active');
            })
            .catch((error) => {
                registerError.textContent = error.message;
            });
    });

});