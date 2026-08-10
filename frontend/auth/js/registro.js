const API = CONFIG.API;

document
.getElementById('registroForm')
.addEventListener(
'submit',
async(e)=>{

    e.preventDefault();

    const nome =
    document.getElementById('nombre').value.trim();

    const email =
    document.getElementById('email').value.trim();

    const password =
    document.getElementById('password').value;

    const repetirPassword =
    document.getElementById('repetirPassword').value;

    if(password !== repetirPassword){

        alert('Las contraseñas no coinciden.');
        return;

    }

    const response =
    await fetch(
        `${API}/usuarios`,
        {

            method:'POST',

            headers:{
                'Content-Type':'application/json'
            },

            body:JSON.stringify({

                nome,
                email,
                password

            })

        }
    );

    const data =
    await response.json();

    if(!response.ok){

        alert(data.mensaje);
        return;

    }

    alert('Cuenta creada correctamente.');

    window.location.href = '/auth/login.html';

});