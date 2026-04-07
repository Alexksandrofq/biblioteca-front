<script setup>
import { ref } from 'vue';

const autor = ref({
	nome: '',
});

const enviando = ref(false);

const enviarAutor = async () => {
	try {
		enviando.value = true;

		const response = await fetch('http://127.0.0.1:8080/autores', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(autor.value),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data?.message || 'Erro ao cadastrar autor.');
		}

		Toastify({
			text: 'Autor cadastrado com sucesso!',
			duration: 3000,
			close: true,
			gravity: 'bottom',
			position: 'right',
			stopOnFocus: true,
			style: {
				background: '#16a34a',
			},
		}).showToast();

		console.log('Resposta da API:', data);
		autor.value.nome = '';
	} catch (error) {
		Toastify({
			text: error.message || 'Falha na requisicao.',
			duration: 3000,
			close: true,
			gravity: 'bottom',
			position: 'right',
			stopOnFocus: true,
			style: {
				background: '#dc2626',
			},
		}).showToast();
	} finally {
		enviando.value = false;
	}
};
</script>

<template>
	<main class="autor-page">
		<div class="shape shape-1"></div>
		<div class="shape shape-2"></div>

		<section class="autor-card">
			<p class="kicker">Acervo</p>
			<h1>Novo Autor</h1>
			<p class="description">Cadastre um autor para organizar melhor as obras da biblioteca.</p>

			<label for="autorNome">Nome do autor</label>
			<input id="autorNome" class="item" type="text" v-model="autor.nome" placeholder="Ex.: Machado de Assis" />

			<button class="send" @click="enviarAutor" :disabled="enviando">
				{{ enviando ? 'Enviando...' : 'Enviar autor' }}
			</button>
		</section>
	</main>
</template>

<style scoped>
.autor-page {
	--bg: #eaf4f4;
	--card: #fcffff;
	--text: #153335;
	--muted: #456063;
	--line: #bad2d4;
	--accent: #0f766e;
	--accent-strong: #0b4e49;

	min-height: calc(100vh - 4.1rem);
	display: grid;
	place-items: center;
	padding: clamp(1rem, 3.2vw, 2.25rem);
	position: relative;
	overflow: hidden;
	background:
		radial-gradient(circle at 12% 18%, rgba(33, 158, 151, 0.2), transparent 50%),
		radial-gradient(circle at 88% 82%, rgba(244, 162, 97, 0.22), transparent 45%),
		linear-gradient(145deg, #dceef0 0%, var(--bg) 62%);
}

.shape {
	position: absolute;
	border-radius: 999px;
	filter: blur(36px);
	opacity: 0.45;
	pointer-events: none;
}

.shape-1 {
	top: 30px;
	left: -90px;
	width: 250px;
	height: 250px;
	background: #3bb3aa;
}

.shape-2 {
	right: -90px;
	bottom: 36px;
	width: 270px;
	height: 270px;
	background: #f4a261;
}

.autor-card {
	width: min(100%, 30rem);
	display: flex;
	flex-direction: column;
	gap: 0.55rem;
	padding: clamp(1.2rem, 3.8vw, 2rem);
	border-radius: 20px;
	border: 1px solid rgba(15, 118, 110, 0.22);
	background: linear-gradient(160deg, rgba(255, 255, 255, 0.9), var(--card));
	box-shadow: 0 18px 42px rgba(20, 70, 80, 0.16);
	backdrop-filter: blur(2px);
}

h1 {
	margin: 0.1rem 0 0.35rem;
	font-size: clamp(1.5rem, 4vw, 2.1rem);
	line-height: 1.15;
	color: var(--text);
}

.kicker {
	font-size: 0.78rem;
	font-weight: 800;
	letter-spacing: 0.15em;
	text-transform: uppercase;
	color: var(--accent);
}

.description {
	font-size: 0.95rem;
	line-height: 1.5;
	color: var(--muted);
	margin-bottom: 0.65rem;
}

label {
	font-size: 0.88rem;
	font-weight: 700;
	letter-spacing: 0.02em;
	color: #214547;
}

.item {
	padding: 0.75rem 0.85rem;
	border: 1px solid var(--line);
	border-radius: 10px;
	font-size: 0.95rem;
	outline: none;
	transition: border-color 160ms ease, box-shadow 160ms ease;
}

.item:focus {
	border-color: rgba(15, 118, 110, 0.75);
	box-shadow: 0 0 0 3px rgba(102, 186, 181, 0.28);
}

.send {
	margin-top: 1rem;
	padding: 0.78rem 1rem;
	border: none;
	border-radius: 10px;
	font-size: 0.94rem;
	font-weight: 700;
	letter-spacing: 0.02em;
	color: #ffffff;
	background: linear-gradient(135deg, var(--accent), var(--accent-strong));
	cursor: pointer;
	transition: transform 150ms ease, filter 150ms ease, opacity 150ms ease;
}

.send:hover:not(:disabled) {
	transform: translateY(-1px);
	filter: brightness(1.06);
}

.send:active:not(:disabled) {
	transform: translateY(0);
}

.send:disabled {
	opacity: 0.68;
	cursor: not-allowed;
}

@media (max-width: 640px) {
	.autor-page {
		min-height: calc(100vh - 4.8rem);
		padding: 0.9rem;
	}

	.autor-card {
		border-radius: 14px;
		padding: 1rem;
	}

	.shape {
		filter: blur(30px);
		opacity: 0.35;
	}
}
</style>
