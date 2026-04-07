<script setup>
import { ref } from 'vue';

const cadastro = ref({
    nmBibliotecario: '',
    cdSenha: '',
    dtNascimento: '',
    tpSexo: '',
    dsEmail: '',
});

const handlerCadastro = () => {
    console.log(cadastro.value);
}
</script>

<template>
    <main>
        <section class="cadastro-card">
            <p class="kicker">Biblioteca Digital</p>
            <h1>Criar cadastro</h1>
            <p class="subtitle">Preencha seus dados para acessar o sistema da biblioteca.</p>

            <input class="cadastro-item" type="text" placeholder="Nome do bibliotecario" name="nmBibliotecario"
                v-model="cadastro.nmBibliotecario" autocomplete="off" />

            <input class="cadastro-item" type="password" placeholder="Senha" name="cdSenha" v-model="cadastro.cdSenha"
                autocomplete="off" />

            <input class="cadastro-item" type="datetime-local" name="dtNascimento"
                :value="cadastro.dtNascimento.slice(0, 16)"
                @input="cadastro.dtNascimento = `${$event.target.value}:00`" />

            <select class="cadastro-item" name="tpSexo" v-model="cadastro.tpSexo">
                <option value="M">M</option>
                <option value="F">F</option>
            </select>

            <input class="cadastro-item" type="email" placeholder="Email" name="dsEmail" v-model="cadastro.dsEmail"
                autocomplete="off" />

            <button class="send" @click="handlerCadastro">Cadastrar</button>
            <router-link class="back-login" to="/login">Ir para login</router-link>
        </section>

    </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=DM+Sans:wght@400;500;700&display=swap');

:root {
    --bg-deep: #111827;
    --bg-soft: #1f2937;
    --accent: #22c55e;
    --accent-strong: #16a34a;
    --surface: rgba(255, 255, 255, 0.11);
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
        radial-gradient(circle at 18% 16%, #0ea5e9 0%, transparent 34%),
        radial-gradient(circle at 82% 12%, #22c55e 0%, transparent 38%),
        linear-gradient(145deg, var(--bg-deep) 0%, var(--bg-soft) 52%, #334155 100%);
}

main::before,
main::after {
    content: '';
    position: absolute;
    width: 17rem;
    height: 17rem;
    border-radius: 999px;
    filter: blur(14px);
    opacity: 0.3;
    pointer-events: none;
}

main::before {
    top: -4rem;
    left: -3rem;
    background: #14b8a6;
}

main::after {
    bottom: -4rem;
    right: -3rem;
    background: #22c55e;
}

.cadastro-card {
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    width: min(100%, 25rem);
    padding: 2rem;
    border-radius: 1rem;
    background: var(--surface);
    backdrop-filter: blur(8px);
    border: 1px solid var(--surface-border);
    box-shadow: 0 18px 42px rgba(2, 6, 23, 0.4);
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
    color: #86efac;
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

.cadastro-item {
    padding: 0.75rem 0.9rem;
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 0.6rem;
    background: rgba(15, 23, 42, 0.45);
    color: var(--text-main);
    font-family: 'DM Sans', sans-serif;
    transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
}

.cadastro-item::placeholder {
    color: rgba(203, 213, 225, 0.95);
}

.cadastro-item:focus {
    outline: none;
    border-color: #86efac;
    box-shadow: 0 0 0 4px rgba(134, 239, 172, 0.2);
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
    color: #0f172a;
    transition: transform 150ms ease, filter 150ms ease;
}

.send:hover {
    transform: translateY(-1px);
    filter: brightness(1.03);
}

.back-login {
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

.back-login:hover {
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