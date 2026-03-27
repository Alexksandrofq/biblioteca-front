<script setup>
import { ref } from 'vue';

const usuario = ref('');
const senha = ref('');

const handlerUsuario = () => { usuario.value = usuario.value.toUpperCase() }
const handlerSenha = () => { senha.value = senha.value.toUpperCase(); }
const handlerLogin = () => {
    if (!usuario.value || !senha.value) {
        Toastify({
            text: "Preencha todos os campos!",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "bottom", 
            position: "right", 
            stopOnFocus: true, 
            style: {
                background: "#d1a93c",
            },
        }).showToast();
        return;
    }
    console.log(usuario.value, senha.value);
}

</script>

<template>
    <main>
        <h1>Login</h1>
        <section>
            <input class="login-item" type="text" placeholder="Digite seu usuario..." name="usuario" v-model="usuario"
                @input="handlerUsuario" autocomplete="off" />
            <input class="login-item" type="password" placeholder="Digite sua senha..." v-model="senha" name="senha"
                @input="handlerSenha" autocomplete="off" />
            <button class="send" @click="handlerLogin">Entrar</button>
        </section>
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1em;
    min-height: 100vh;
}

section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1em;
    padding: 2em;
    width: 20rem;
}

.login-item {
    padding: 0.5em 1em;
    min-width: 100%;
    border: 1px solid #ccc;

}

.send {
    padding: 0.5em 1em;
    min-width: 100%;
    cursor: pointer;
    border: 1px solid #ccc;
}
</style>