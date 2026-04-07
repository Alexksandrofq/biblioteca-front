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
	<main>
		<section>
			<h1>Novo Autor</h1>

			<input class="item" type="text" v-model="autor.nome" placeholder="Nome do autor" />

			<button class="send" @click="enviarAutor" :disabled="enviando">
				{{ enviando ? 'Enviando...' : 'Enviar autor' }}
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
	width: min(100%, 24rem);
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
