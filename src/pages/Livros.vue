<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useLivroStore } from '../stores/livroStore'
import type { AutorOption } from '@/types/AutorOption'
import type { AutorApi } from '@/types/AutorApi'
import type { LivroExibicao } from '@/types/LivroExibicao'
import type { BibliotecarioOption } from '@/types/BibliotecarioOption'
import type { CategoriaOption } from '@/types/CategoriaOption'
import type { LivroForm } from '@/types/LivroForm'
import type { LivroApi } from '@/types/LivroApi'
import type { BibliotecarioApi } from '@/types/BibliotecarioApi'
import type { CategoriaApi } from '@/types/CategoriaApi'



const API_URL = 'http://127.0.0.1:8080/livro'
const BIBLIOTECARIOS_URL = 'http://127.0.0.1:8080/bibliotecarios'
const CATEGORIAS_URL = 'http://127.0.0.1:8080/categorias'
const AUTORES_URL = 'http://127.0.0.1:8080/autores'
const store = useLivroStore()

const livros = ref<LivroExibicao[]>([])
const bibliotecarios = ref<BibliotecarioOption[]>([])
const categorias = ref<CategoriaOption[]>([])
const autores = ref<AutorOption[]>([])
const loading = ref(false)
const salvando = ref(false)

const formulario = ref<LivroForm>({
	nm_livro: '',
	cd_bibliotecario: 0,
	cd_categoria: 0,
	cd_autor: 0
})

const totalLivros = computed(() => livros.value.length)

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
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token') ?? ''}`
			}
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

const carregarBibliotecarios = async () => {
	try {
		const response = await fetch(BIBLIOTECARIOS_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token') ?? ''}`
			}
		})

		if (!response.ok) {
			throw new Error('Erro ao buscar bibliotecarios.')
		}

		const data = await response.json()
		const lista = Array.isArray(data) ? data : data?.data ?? []

		bibliotecarios.value = lista
			.map((item: BibliotecarioApi) => ({
				id: Number(item.id ?? 0),
				nome: item.nome ?? ''
			}))
			.filter((item: BibliotecarioOption) => item.id > 0)

		if (formulario.value.cd_bibliotecario === 0 && bibliotecarios.value.length > 0) {
			formulario.value.cd_bibliotecario = bibliotecarios.value[0]?.id ?? 0
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Falha ao buscar bibliotecarios.'
		alert(message)
	}
}

const carregarCategorias = async () => {
	try {
		const response = await fetch(CATEGORIAS_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token') ?? ''}`
			}
		})

		if (!response.ok) {
			throw new Error('Erro ao buscar categorias.')
		}

		const data = await response.json()
		const lista = Array.isArray(data) ? data : data?.data ?? []

		categorias.value = lista
			.map((item: CategoriaApi) => ({
				id: Number(item.id ?? 0),
				nome: item.nome ?? ''
			}))
			.filter((item: CategoriaOption) => item.id > 0)

		if (formulario.value.cd_categoria === 0 && categorias.value.length > 0) {
			formulario.value.cd_categoria = categorias.value[0]?.id ?? 0
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Falha ao buscar categorias.'
		alert(message)
	}
}

const carregarAutores = async () => {
	try {
		const response = await fetch(AUTORES_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token') ?? ''}`
			}
		})

		if (!response.ok) {
			throw new Error('Erro ao buscar autores.')
		}

		const data = await response.json()
		const lista = Array.isArray(data) ? data : data?.data ?? []

		autores.value = lista
			.map((item: AutorApi) => ({
				id: Number(item.id ?? 0),
				nome: item.nome ?? ''
			}))
			.filter((item: AutorOption) => item.id > 0)

		if (formulario.value.cd_autor === 0 && autores.value.length > 0) {
			formulario.value.cd_autor = autores.value[0]?.id ?? 0
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Falha ao buscar autores.'
		alert(message)
	}
}

const limparFormulario = () => {
	formulario.value = {
		nm_livro: '',
		cd_bibliotecario: bibliotecarios.value[0]?.id ?? 0,
		cd_categoria: categorias.value[0]?.id ?? 0,
		cd_autor: autores.value[0]?.id ?? 0
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
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token') ?? ''}`
			},
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
	carregarBibliotecarios()
	carregarCategorias()
	carregarAutores()
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
						<select id="cd_bibliotecario" v-model.number="formulario.cd_bibliotecario" required>
							<option :value="0" disabled>Selecione um bibliotecario</option>
							<option v-for="bibliotecario in bibliotecarios" :key="bibliotecario.id"
								:value="bibliotecario.id">
								{{ bibliotecario.nome }} (ID: {{ bibliotecario.id }})
							</option>
						</select>
					</div>
					<div>
						<label for="cd_categoria">Categoria</label>
						<select id="cd_categoria" v-model.number="formulario.cd_categoria" required>
							<option :value="0" disabled>Selecione uma categoria</option>
							<option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
								{{ categoria.nome }} (ID: {{ categoria.id }})
							</option>
						</select>
					</div>
					<div>
						<label for="cd_autor">Cd. autor</label>
						<select id="cd_autor" v-model.number="formulario.cd_autor" required>
							<option :value="0" disabled>Selecione um autor</option>
							<option v-for="autor in autores" :key="autor.id" :value="autor.id">
								{{ autor.nome }} (ID: {{ autor.id }})
							</option>
						</select>
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
								<button class="btn-mini danger" type="button"
									@click="excluirLivro(livro.id)">Excluir</button>
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
.row>div {
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

input,
select {
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
