<template>
	<section class="categoria-page">
		<div class="page-glow page-glow-left"></div>
		<div class="page-glow page-glow-right"></div>

		<div class="categoria-card">
			<p class="eyebrow">Biblioteca</p>
			<h1>Cadastro de Categoria</h1>
			<p class="subtitle">Preencha os dados e envie para a API com seu token de autenticacao.</p>

			<form class="categoria-form" @submit.prevent="enviarCategoria">
				<label for="nome">Nome</label>
				<input id="nome" v-model="form.nome" type="text" required placeholder="Ex.: Romance" />

				<label for="descricao">Descricao</label>
				<input id="descricao" v-model="form.descricao" type="text" placeholder="Descricao curta da categoria" />

				<button type="submit" :disabled="carregando">
					{{ carregando ? 'Enviando...' : 'Salvar Categoria' }}
				</button>
			</form>

			<p v-if="mensagem" class="feedback" :class="sucesso ? 'ok' : 'erro'">{{ mensagem }}</p>
		</div>
	</section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

type CategoriaPayload = {
	nome: string
	descricao: string
}

const form = reactive<CategoriaPayload>({
	nome: 'Romance',
	descricao: ''
})

const carregando = ref(false)
const mensagem = ref('')
const sucesso = ref(false)

const enviarCategoria = async () => {
	carregando.value = true
	mensagem.value = ''

	try {
		const token = localStorage.getItem('token')

		if (!token) {
			throw new Error('Token nao encontrado no localStorage.')
		}

		const response = await fetch('http://127.0.0.1:8080/categorias', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				nome: form.nome,
				descricao: form.descricao
			})
		})

		if (!response.ok) {
			const textoErro = await response.text()
			throw new Error(textoErro || 'Falha ao cadastrar categoria.')
		}

		sucesso.value = true
		mensagem.value = 'Categoria cadastrada com sucesso.'
	} catch (error) {
		sucesso.value = false
		mensagem.value = error instanceof Error ? error.message : 'Erro inesperado.'
	} finally {
		carregando.value = false
	}
}
</script>

<style scoped>
.categoria-page {
	--bg-main: #f7f4ee;
	--bg-card: #fffdf8;
	--text-main: #1f2937;
	--text-soft: #5b6472;
	--line: #d7d9de;
	--accent: #bf5f2f;
	--accent-strong: #94411b;
	--ok: #1f7a3f;
	--ok-bg: #e9f8ef;
	--erro: #b42318;
	--erro-bg: #feeceb;

	position: relative;
	overflow: hidden;
	min-height: calc(100vh - 4.1rem);
	padding: clamp(1rem, 3vw, 2.5rem);
	background:
		radial-gradient(circle at 10% 20%, rgba(221, 176, 129, 0.2), transparent 50%),
		radial-gradient(circle at 92% 75%, rgba(81, 137, 194, 0.18), transparent 46%),
		linear-gradient(140deg, #f3f0e8 0%, var(--bg-main) 60%);
	display: grid;
	place-items: center;
}

.page-glow {
	position: absolute;
	width: 280px;
	height: 280px;
	filter: blur(42px);
	opacity: 0.45;
	pointer-events: none;
}

.page-glow-left {
	left: -90px;
	top: 30px;
	background: #f4c389;
}

.page-glow-right {
	right: -100px;
	bottom: 30px;
	background: #82b6e7;
}

.categoria-card {
	position: relative;
	width: min(560px, 100%);
	padding: clamp(1.2rem, 3.6vw, 2rem);
	border: 1px solid rgba(191, 95, 47, 0.18);
	border-radius: 18px;
	background: linear-gradient(165deg, rgba(255, 255, 255, 0.95), var(--bg-card));
	box-shadow: 0 20px 40px rgba(42, 59, 84, 0.12);
	backdrop-filter: blur(2px);
}

.eyebrow {
	font-size: 0.78rem;
	text-transform: uppercase;
	letter-spacing: 0.15em;
	font-weight: 700;
	color: var(--accent);
	margin-bottom: 0.35rem;
}

h1 {
	font-size: clamp(1.5rem, 3.8vw, 2.05rem);
	line-height: 1.15;
	color: var(--text-main);
	margin-bottom: 0.5rem;
}

.subtitle {
	font-size: 0.95rem;
	line-height: 1.55;
	color: var(--text-soft);
	margin-bottom: 1.35rem;
}

.categoria-form {
	display: flex;
	flex-direction: column;
	gap: 0.45rem;
}

.categoria-form label {
	font-size: 0.87rem;
	font-weight: 700;
	letter-spacing: 0.02em;
	color: #384354;
	margin-top: 0.75rem;
}

.categoria-form input {
	padding: 0.75rem 0.85rem;
	font-size: 0.95rem;
	border-radius: 10px;
	border: 1px solid var(--line);
	background: #ffffff;
	outline: none;
	transition: border-color 180ms ease, box-shadow 180ms ease;
}

.categoria-form input:focus {
	border-color: rgba(86, 145, 203, 0.75);
	box-shadow: 0 0 0 3px rgba(130, 182, 231, 0.25);
}

.categoria-form button {
	margin-top: 1rem;
	padding: 0.78rem 1rem;
	font-size: 0.94rem;
	font-weight: 700;
	letter-spacing: 0.02em;
	border: none;
	border-radius: 10px;
	color: #fff;
	background: linear-gradient(135deg, var(--accent), var(--accent-strong));
	cursor: pointer;
	transition: transform 150ms ease, filter 150ms ease, opacity 150ms ease;
}

.categoria-form button:hover:not(:disabled) {
	transform: translateY(-1px);
	filter: brightness(1.05);
}

.categoria-form button:active:not(:disabled) {
	transform: translateY(0);
}

.categoria-form button:disabled {
	opacity: 0.65;
	cursor: not-allowed;
}

.feedback {
	margin-top: 0.95rem;
	padding: 0.7rem 0.8rem;
	font-size: 0.9rem;
	border-radius: 10px;
	border: 1px solid transparent;
}

.ok {
	color: var(--ok);
	background: var(--ok-bg);
	border-color: rgba(31, 122, 63, 0.25);
}

.erro {
	color: var(--erro);
	background: var(--erro-bg);
	border-color: rgba(180, 35, 24, 0.25);
}

@media (max-width: 640px) {
	.categoria-page {
		min-height: calc(100vh - 4.8rem);
		padding: 0.9rem;
	}

	.categoria-card {
		border-radius: 14px;
		padding: 1rem;
	}

	.page-glow {
		width: 220px;
		height: 220px;
	}
}
</style>
