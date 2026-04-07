<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const usuario = ref('');
const senha = ref('');
const router = useRouter();

const handlerUsuario = () => { usuario.value = usuario.value }
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
    fetch('http://localhost:8080/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: usuario.value,
            senha: senha.value
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                const token = data.token || data.accessToken || data.jwt;
                if (token) {
                    localStorage.setItem('token', token);
                }

                Toastify({
                    text: "Login bem-sucedido!",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "bottom",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "#d1a93c",
                    },
                }).showToast();
                router.push('/livros');
            } else {
                Toastify({
                    text: "Credenciais inválidas!",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "bottom",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "#d1a93c",
                    },
                }).showToast();
            }
        });
}
</script>

<template>
    <main>
        <section class="login-card">
            <p class="kicker">Biblioteca Digital</p>
            <h1>Entrar na conta</h1>
            <p class="subtitle">Acesse para visualizar o catalogo e gerenciar seus livros.</p>

            <input class="login-item" type="text" placeholder="Digite seu email..." name="usuario" v-model="usuario"
                @input="handlerUsuario" autocomplete="off" />
            <input class="login-item" type="password" placeholder="Digite sua senha..." v-model="senha" name="senha"
                @input="handlerSenha" autocomplete="off" />

            <button class="send" @click="handlerLogin">Entrar</button>
            <router-link class="go-cadastro" to="/cadastro">Criar cadastro</router-link>
        </section>
    </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=DM+Sans:wght@400;500;700&display=swap');

:root {
    --bg-deep: #0f172a;
    --bg-soft: #1e293b;
    --accent: #f59e0b;
    --accent-strong: #d97706;
    --surface: rgba(255, 255, 255, 0.1);
    --surface-border: rgba(255, 255, 255, 0.25);
    --text-main: #f8fafc;
    --text-muted: #cbd5e1;
}

main {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1.5rem;
    overflow: hidden;
    background:
        radial-gradient(circle at 15% 20%, #1d4ed8 0%, transparent 35%),
        radial-gradient(circle at 80% 10%, #b45309 0%, transparent 35%),
        linear-gradient(150deg, var(--bg-deep) 0%, var(--bg-soft) 55%, #334155 100%);
}

main::before,
main::after {
    content: '';
    position: absolute;
    width: 18rem;
    height: 18rem;
    border-radius: 999px;
    filter: blur(12px);
    opacity: 0.35;
    pointer-events: none;
}

main::before {
    top: -4rem;
    right: -3rem;
    background: #f59e0b;
}

main::after {
    bottom: -4rem;
    left: -3rem;
    background: #38bdf8;
}

.login-card {
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    width: min(100%, 24rem);
    padding: 2rem;
    border-radius: 1rem;
    background: var(--surface);
    backdrop-filter: blur(8px);
    border: 1px solid var(--surface-border);
    box-shadow: 0 20px 45px rgba(2, 6, 23, 0.35);
    animation: reveal 420ms ease-out;
}

h1 {
    margin: 0;
    font-family: 'Space Grotesk', sans-serif;
    color: var(--text-main);
    font-size: 1.8rem;
    line-height: 1.15;
}

.kicker {
    margin: 0;
    font-family: 'DM Sans', sans-serif;
    color: #fcd34d;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.75rem;
    font-weight: 700;
}

.subtitle {
    margin: 0 0 0.35rem;
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
}

.login-item {
    padding: 0.75rem 0.9rem;
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 0.6rem;
    background: rgba(15, 23, 42, 0.45);
    color: var(--text-main);
    font-family: 'DM Sans', sans-serif;
    transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
}

.login-item::placeholder {
    color: rgba(203, 213, 225, 0.9);
}

.login-item:focus {
    outline: none;
    border-color: #fcd34d;
    box-shadow: 0 0 0 4px rgba(252, 211, 77, 0.2);
    background: rgba(15, 23, 42, 0.6);
}

.send {
    margin-top: 0.25rem;
    padding: 0.75rem 1rem;
    width: 100%;
    cursor: pointer;
    border: 0;
    border-radius: 0.6rem;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    background: linear-gradient(120deg, var(--accent) 0%, var(--accent-strong) 100%);
    color: #111827;
    transition: transform 150ms ease, filter 150ms ease;
}

.send:hover {
    transform: translateY(-1px);
    filter: brightness(1.03);
}

.go-cadastro {
    padding: 0.7rem 1rem;
    width: 100%;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 0.6rem;
    text-decoration: none;
    color: var(--text-main);
    font-family: 'DM Sans', sans-serif;
    background: rgba(15, 23, 42, 0.2);
    transition: background 180ms ease, border-color 180ms ease;
}

.go-cadastro:hover {
    background: rgba(15, 23, 42, 0.45);
    border-color: rgba(255, 255, 255, 0.5);
}

@keyframes reveal {
    from {
        opacity: 0;
        transform: translateY(8px) scale(0.99);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>