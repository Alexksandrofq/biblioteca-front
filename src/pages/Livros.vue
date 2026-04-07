<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useLivroStore } from '../stores/livroStore'

type LivroApi = {
	id?: number
	nome?: string
	categoria?: number
	autor?: number
	bibliotecario?: number
	cd_livro?: number
	nm_livro?: string
	cd_bibliotecario?: number
	cd_categoria?: number
	cd_autor?: number
}

type LivroExibicao = {
	id: number
	nome: string
	categoria: number
	autor: number
	bibliotecario: number
}

type LivroForm = {
	nm_livro: string
	cd_bibliotecario: number
	cd_categoria: number
	cd_autor: number
}

const API_URL = 'http://127.0.0.1:8080/livro'
const store = useLivroStore()

const livros = ref<LivroExibicao[]>([])
const loading = ref(false)
const salvando = ref(false)

const formulario = ref<LivroForm>({
	nm_livro: '',
	cd_bibliotecario: 0,
	cd_categoria: 0,
	cd_autor: 0
})

const totalLivros = computed(() => livros.value.length)

const getHeaders = () => {
	const token = localStorage.getItem('token')
	return {
		'Content-Type': 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {})
	}
}

const normalizarLivro = (livro: LivroApi): LivroExibicao => {
	return {
		id: livro.id ?? livro.cd_livro ?? 0,
		nome: livro.nome ?? livro.nm_livro ?? '',
		categoria: livro.categoria ?? livro.cd_categoria ?? 0,
		autor: livro.autor ?? livro.cd_autor ?? 0,
		bibliotecario: livro.bibliotecario ?? livro.cd_bibliotecario ?? 0
	}
}

const carregarLivros = async () => {
	loading.value = true
	try {
		const response = await fetch(API_URL, {
			method: 'GET',
			headers: getHeaders()
		})

		if (!response.ok) {
			throw new Error('Erro ao buscar livros.')
		}

		const data = await response.json()
		const lista = Array.isArray(data) ? data : data?.data ?? []
		livros.value = lista.map((item: LivroApi) => normalizarLivro(item))
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Falha ao buscar livros.'
		alert(message)
	} finally {
		loading.value = false
	}
}

const limparFormulario = () => {
	formulario.value = {
		nm_livro: '',
		cd_bibliotecario: 10,
		cd_categoria: 5,
		cd_autor: 5
	}
}

const montarPayload = () => ({
	nm_livro: formulario.value.nm_livro,
	cd_bibliotecario: Number(formulario.value.cd_bibliotecario),
	categoria: Number(formulario.value.cd_categoria),
	cd_autor: Number(formulario.value.cd_autor)
})

const salvarLivro = async () => {
	if (!formulario.value.nm_livro.trim()) {
		alert('Preencha o nome do livro.')
		return
	}

	salvando.value = true
	try {
		const payload = montarPayload()

		const response = await fetch(API_URL, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify(payload)
		})

		if (!response.ok) {
			throw new Error('Erro ao cadastrar livro.')
		}

		await carregarLivros()
		limparFormulario()
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Falha na operacao.'
		alert(message)
	} finally {
		salvando.value = false
	}
}

const excluirLivro = async (id: number) => {
	if (!confirm('Deseja remover este livro?')) {
		return
	}

	try {
		await store.deletarLivroNaApi(id)

		await carregarLivros()
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Falha ao remover livro.'
		alert(message)
	}
}

onMounted(() => {
	carregarLivros()
})
</script>

<template>
	<main class="container">
		<section class="card">
			<div class="topo">
				<h1>CRUD de Livros</h1>
				<button class="btn-outline" type="button" @click="carregarLivros" :disabled="loading">
					{{ loading ? 'Atualizando...' : 'Atualizar Lista' }}
				</button>
			</div>

			<p class="info">Total de livros: {{ totalLivros }}</p>

			<form class="formulario" @submit.prevent="salvarLivro">
				<div class="campo-full">
					<label for="nm_livro">Nome do livro</label>
					<input id="nm_livro" v-model="formulario.nm_livro" type="text" required />
				</div>

				<div class="row">
					<div>
						<label for="cd_bibliotecario">Cd. bibliotecario</label>
						<input id="cd_bibliotecario" v-model.number="formulario.cd_bibliotecario" type="number" min="1" required />
					</div>
					<div>
						<label for="cd_categoria">Categoria</label>
						<input id="cd_categoria" v-model.number="formulario.cd_categoria" type="number" min="1" required />
					</div>
					<div>
						<label for="cd_autor">Cd. autor</label>
						<input id="cd_autor" v-model.number="formulario.cd_autor" type="number" min="1" required />
					</div>
				</div>

				<div class="acoes-form">
					<button class="btn-primary" type="submit" :disabled="salvando">
						{{ salvando ? 'Salvando...' : 'Cadastrar Livro' }}
					</button>
					<button class="btn-outline" type="button" @click="limparFormulario">
						Limpar
					</button>
				</div>
			</form>
		</section>

		<section class="card">
			<h2>Lista</h2>
			<p v-if="loading" class="info">Carregando livros...</p>
			<p v-else-if="livros.length === 0" class="info">Nenhum livro encontrado.</p>

			<div v-else class="tabela-wrap">
				<table>
					<thead>
						<tr>
							<th>Nome</th>
							<th>Bibliotecario</th>
							<th>Categoria</th>
							<th>Autor</th>
							<th>Acoes</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="livro in livros" :key="livro.id">
							<td>{{ livro.nome }}</td>
							<td>{{ livro.bibliotecario }}</td>
							<td>{{ livro.categoria }}</td>
							<td>{{ livro.autor }}</td>
							<td class="acoes-grid">
								<button class="btn-mini danger" type="button" @click="excluirLivro(livro.id)">Excluir</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>
	</main>
</template>

<style scoped>
.container {
	width: min(1100px, 92%);
	margin: 1.2rem auto 2rem;
	display: grid;
	gap: 1rem;
}

.card {
	background: #ffffff;
	border: 1px solid #e2e8f0;
	border-radius: 12px;
	padding: 1rem;
}

.topo {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 0.8rem;
}

h1,
h2 {
	margin: 0;
}

.info {
	margin: 0.6rem 0;
	color: #475569;
}

.formulario {
	display: grid;
	gap: 0.8rem;
}

.campo-full,
.row > div {
	display: grid;
	gap: 0.35rem;
}

.row {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 0.8rem;
}

label {
	font-size: 0.9rem;
	color: #334155;
}

input {
	border: 1px solid #cbd5e1;
	border-radius: 8px;
	padding: 0.58rem 0.7rem;
}

.acoes-form {
	display: flex;
	gap: 0.6rem;
}

button {
	border: 1px solid #cbd5e1;
	border-radius: 8px;
	padding: 0.58rem 0.85rem;
	cursor: pointer;
}

.btn-primary {
	background: #0f766e;
	color: #fff;
	border-color: #0f766e;
}

.btn-outline {
	background: #fff;
	color: #0f172a;
}

.tabela-wrap {
	overflow-x: auto;
}

table {
	width: 100%;
	border-collapse: collapse;
}

th,
td {
	padding: 0.65rem 0.55rem;
	border-bottom: 1px solid #e2e8f0;
	text-align: left;
}

.acoes-grid {
	display: flex;
	gap: 0.5rem;
}

.btn-mini {
	padding: 0.38rem 0.62rem;
	font-size: 0.85rem;
}

.danger {
	background: #b91c1c;
	color: #fff;
	border-color: #b91c1c;
}

@media (max-width: 820px) {
	.row {
		grid-template-columns: 1fr;
	}
}
</style>
