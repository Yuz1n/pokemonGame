$(document).ready(function () {
    $('#chkavl').click(function (event) {
        event.preventDefault();

        const username = $('#username').val();

        // Verifique se o campo de entrada está vazio
        if (username.trim() === '') {
            $('#usernameAvailability').text('*Digite um nome de usuário.*');
            $('#usernameConfirmation2').show();
            $('#usernameError').show();
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/verificar-usuario',
            data: { username: username },
            success: function (response) {
                console.log(response)
                if (response.disponivel) {
                    $('#usernameAvailability').text('');
                    $('#usernameConfirmation').show(); // Mostrar o ícone de confirmação
                    $('#usernameConfirmation2').hide();
                } else {
                    $('#usernameAvailability').text('Esse usuário já existe.');
                    $('#usernameConfirmation2').show(); // Ocultar o ícone de confirmação
                    $('#usernameConfirmation').hide();
                }
            },
            error: function (error) {
                console.error('Erro ao verificar nome de usuário:', error);
            },
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('form');
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const emailField = document.getElementById('email');
    const retypePasswordField = document.getElementById('retypepassword');
    const passwordError = document.getElementById('passwordError');
    const nullsubmit = document.getElementById('nullsubmit');
    const submitButton = document.getElementById('submitform');

    function validateForm() {
        const usernameValue = usernameField.value;
        const passwordValue = passwordField.value;
        const retypePasswordValue = retypePasswordField.value;
        const emailValue = emailField.value;

        // Verifique se os campos estão preenchidos
        if (usernameValue.trim() === '' || passwordValue.trim() === '' || retypePasswordValue.trim() === '' || emailValue.trim() === '') {
            nullsubmit.textContent = 'Por favor, preencha todos os campos.';
            submitButton.disabled = true;
        } else if (passwordValue !== retypePasswordValue) {
            passwordError.textContent = 'As senhas precisam ser iguais.';
            submitButton.disabled = true;
        } else {
            passwordError.textContent = ''; // Limpa a mensagem de erro
            submitButton.disabled = false;
        }
    }

    if (registrationForm && usernameField && passwordField && retypePasswordField && passwordError && submitButton) {
        // Adicione um ouvinte de evento ao envio do formulário
        registrationForm.addEventListener('submit', function (event) {
            validateForm();
            event.preventDefault();
            const usernameValue = usernameField.value.trim();
            if (usernameValue === '') {
                return;
              }
              $.ajax({
                type: 'POST',
                url: '/verificar-usuario', // Endpoint no servidor para verificar o usuário
                data: { username: usernameValue },
                success: function (response) {
                  if (!response.disponivel) {
                    // Nome de usuário já existe, exiba uma mensagem de erro
                    nullsubmit.textContent = 'Nome de usuário já cadastrado, insira um novo!';
                  } else {
                    // Nome de usuário está disponível, permita o envio do formulário
                    registrationForm.submit();
                  }
                },
                error: function (error) {
                  console.error('Erro ao verificar nome de usuário:', error);
                },
              });
        });

        // Adicione um ouvinte de evento a todos os campos
        usernameField.addEventListener('input', function () {
            validateForm();
            if (usernameField.value.trim() !== '') {
                nullsubmit.textContent = ''; // Limpa a mensagem de erro
                submitButton.disabled = false;
            }
        });
        passwordField.addEventListener('input', function () {
            validateForm();
            if (passwordField.value.trim() !== '') {
                nullsubmit.textContent = ''; // Limpa a mensagem de erro
                submitButton.disabled = false;
            }
        });
        retypePasswordField.addEventListener('input', function () {
            validateForm();
            if (retypePasswordField.value.trim() !== '') {
                nullsubmit.textContent = ''; // Limpa a mensagem de erro
                submitButton.disabled = false;
            }
        });
        emailField.addEventListener('input', function () {
            validateForm();
            if (emailField.value.trim() !== '') {
                nullsubmit.textContent = ''; // Limpa a mensagem de erro
                submitButton.disabled = false;
            }
          });
    } else {
        console.error('Elementos não encontrados.');
    }
});







