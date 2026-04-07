<script setup>
import { onMounted, ref } from 'vue';

const autor = ref({
	nome: '',
});

const enviando = ref(false);
const carregandoAutores = ref(false);
const autores = ref([]);

const getHeaders = () => ({
	'Content-Type': 'application/json',
	'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
});

const buscarAutores = async () => {
	try {
		carregandoAutores.value = true;

		const response = await fetch('http://127.0.0.1:8080/autores', {
			method: 'GET',
			headers: getHeaders(),
		});

		if (!response.ok) {
			throw new Error('Erro ao buscar autores.');
		}

		const data = await response.json();
		autores.value = Array.isArray(data) ? data : data?.data || [];
	} catch (error) {
		Toastify({
			text: error.message || 'Falha ao carregar autores.',
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
		carregandoAutores.value = false;
	}
};

const enviarAutor = async () => {
	try {
		enviando.value = true;

		const response = await fetch('http://127.0.0.1:8080/autores', {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify(autor.value),
		});

		if (!response.ok) {
			throw new Error('Erro ao cadastrar autor.');
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

		autor.value.nome = '';
		await buscarAutores();
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

	onMounted(() => {
		buscarAutores();
	});
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

			<div class="autores-lista">
				<div class="lista-topo">
					<h2>Autores cadastrados</h2>
					<button class="refresh" type="button" @click="buscarAutores" :disabled="carregandoAutores">
						{{ carregandoAutores ? 'Atualizando...' : 'Atualizar' }}
					</button>
				</div>

				<p v-if="carregandoAutores" class="lista-info">Carregando autores...</p>
				<p v-else-if="autores.length === 0" class="lista-info">Nenhum autor encontrado.</p>

				<div v-else class="table-wrap">
					<table>
						<thead>
							<tr>
								<th>ID</th>
								<th>Nome</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in autores" :key="item.id">
								<td>{{ item.id }}</td>
								<td>{{ item.nome }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
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

.autores-lista {
	margin-top: 1.25rem;
	padding-top: 1rem;
	border-top: 1px dashed rgba(69, 96, 99, 0.35);
}

.lista-topo {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.6rem;
	margin-bottom: 0.55rem;
}

.lista-topo h2 {
	font-size: 1.05rem;
	margin: 0;
	color: var(--text);
}

.refresh {
	padding: 0.42rem 0.7rem;
	font-size: 0.82rem;
	font-weight: 700;
	border-radius: 8px;
	border: 1px solid #c8d2df;
	background: #fff;
	cursor: pointer;
}

.refresh:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.lista-info {
	margin: 0.45rem 0;
	font-size: 0.9rem;
	color: #475569;
}

.table-wrap {
	overflow-x: auto;
}

table {
	width: 100%;
	border-collapse: collapse;
	font-size: 0.9rem;
}

th,
td {
	padding: 0.52rem 0.48rem;
	border-bottom: 1px solid #e4e7eb;
	text-align: left;
}

th {
	font-size: 0.8rem;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: #526173;
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
