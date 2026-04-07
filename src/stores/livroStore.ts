import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Livro, LivroFormData } from '../types'

export const useLivroStore = defineStore('livro', () => {
  const livros = ref<Livro[]>([

  ])

  let nextId = ref(3)

  const totalLivros = computed(() => livros.value.length)
  const livrosDisponiveis = computed(() => livros.value.filter(l => l.sn_locado === 'N'))
  const livrosLocados = computed(() => livros.value.filter(l => l.sn_locado === 'S'))

  const adicionarLivro = (dados: LivroFormData) => {
    const novoLivro: Livro = {
      cd_livro: nextId.value++,
      ...dados,
      sn_locado: 'N'
    }
    livros.value.push(novoLivro)
    return novoLivro
  }

  const cadastrarLivroNaApi = async (dados: LivroFormData) => {
    const payload = {
      nm_livro: dados.nm_livro,
      cd_bibliotecario: dados.cd_bibliotecario,
      categoria: dados.cd_categoria,
      cd_autor: dados.cd_autor,
      sn_locado: 'N'
    }

    const response = await fetch('http://127.0.0.1:8080/livro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('Erro ao cadastrar livro na API.')
    }

    return response
  }

  const deletarLivroNaApi = async (id: number) => {
    const response = await fetch(`http://127.0.0.1:8080/livro/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Erro ao deletar livro na API.')
    }

    return response
  }

  const obterLivros = () => livros.value

  const obterLivroPorId = (id: number) => {
    return livros.value.find(l => l.cd_livro === id)
  }

  const atualizarLivro = (id: number, dados: LivroFormData) => {
    const index = livros.value.findIndex(l => l.cd_livro === id)
    if (index !== -1) {
      const livroAtual = livros.value[index]
      if (!livroAtual) {
        return null
      }

      livros.value[index] = { cd_livro: id, ...dados, sn_locado: livroAtual.sn_locado }
      return livros.value[index]
    }
    return null
  }

  const deletarLivro = (id: number) => {
    const index = livros.value.findIndex(l => l.cd_livro === id)
    if (index !== -1) {
      const deletado = livros.value[index]
      livros.value.splice(index, 1)
      return deletado
    }
    return null
  }

  return {
    livros,
    totalLivros,
    livrosDisponiveis,
    livrosLocados,
    adicionarLivro,
    cadastrarLivroNaApi,
    deletarLivroNaApi,
    obterLivros,
    obterLivroPorId,
    atualizarLivro,
    deletarLivro
  }
})

