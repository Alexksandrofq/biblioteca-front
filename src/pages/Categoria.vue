<script setup>
import { ref } from 'vue';

const livro = ref({
	nm_livro: '',
	cd_bibliotecario: 0,
	categoria: 0,
	cd_autor: 0,
	sn_locado: 'N',
});

const enviando = ref(false);

const enviarLivro = async () => {
	try {
		enviando.value = true;

		const response = await fetch('http://127.0.0.1:8080/livro', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(livro.value),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data?.message || 'Erro ao cadastrar livro.');
		}

		Toastify({
			text: 'Livro cadastrado com sucesso!',
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
	<main>
		<section>
			<h1>Novo Livro</h1>

			<input class="item" type="text" v-model="livro.nm_livro" placeholder="Nome do livro" />
			<input class="item" type="number" v-model.number="livro.cd_bibliotecario" placeholder="Codigo bibliotecario" />
			<input class="item" type="number" v-model.number="livro.categoria" placeholder="Categoria" />
			<input class="item" type="number" v-model.number="livro.cd_autor" placeholder="Codigo autor" />
			<select class="item" v-model="livro.sn_locado">
				<option value="N">N</option>
				<option value="S">S</option>
			</select>

			<button class="send" @click="enviarLivro" :disabled="enviando">
				{{ enviando ? 'Enviando...' : 'Enviar livro' }}
			</button>
		</section>
	</main>
</template>

<style scoped>
main {
	min-height: 100vh;
	display: grid;
	place-items: center;
	padding: 1rem;
}

section {
	width: min(100%, 26rem);
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

h1 {
	margin: 0 0 0.5rem;
}

.item,
.send {
	padding: 0.7rem 0.9rem;
	border: 1px solid #cbd5e1;
	border-radius: 0.5rem;
}

.send {
	cursor: pointer;
}

.send:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}
</style>
