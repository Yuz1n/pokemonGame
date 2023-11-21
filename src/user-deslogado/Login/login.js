document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('formLogin'); // Suponha que o formulário tenha o ID 'loginForm'
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const btnlogin = document.getElementById('btn-login');
    const nullsubmit = document.getElementById('nullsubmit');
    const storedToken = sessionStorage.getItem('token');
    console.log("TOKEN INVALIDO",storedToken)
    
    // Desabilite o botão de login inicialmente
    btnlogin.disabled = true;

    // Adicione um ouvinte de evento 'input' para os campos de entrada
    usernameInput.addEventListener('input', checkInputs);
    passwordInput.addEventListener('input', checkInputs);

    function checkInputs() {
        // Verifique se ambos os campos de entrada têm valores não vazios
        if (usernameInput.value.trim() !== '' && passwordInput.value.trim() !== '') {
            // Se ambos estiverem preenchidos, habilite o botão de login
            btnlogin.disabled = false;
        } else {
            // Caso contrário, desabilite o botão de login
            btnlogin.disabled = true;
        }
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que o formulário seja enviado normalmente

        const username = usernameInput.value;
        const password = passwordInput.value;

        fetch('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    // Se a autenticação for bem-sucedida, redirecione para a rota '/maps'
                    window.location.href = '/maps';
                } else {
                    console.log(data)
                    // Trate o caso em que a autenticação falhou (por exemplo, exiba uma mensagem de erro)
                    if (data.mensagem === 'Credenciais inválidas') {
                        // Informe que as credenciais estão incorretas
                        nullsubmit.textContent = 'Usuário ou senha incorretos. Por favor, tente novamente.';
                    } else if (username.trim() === '' || password.trim() === '') {
                        // Informe que os campos devem ser preenchidos
                        nullsubmit.textContent = 'Por favor, preencha todos os campos.';
                    }
                }
            })
            .catch((error) => {
                console.error('Erro na solicitação de autenticação:', error);
            });
    });
});
