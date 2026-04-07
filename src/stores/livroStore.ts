import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Livro, LivroFormData } from '../types'

export const useLivroStore = defineStore('livro', () => {
  const livros = ref<Livro[]>([
    {
      cd_livro: 1,
      nm_livro: 'Clean Code',
      cd_bibliotecario: 1,
      cd_categoria: 1,
      cd_autor: 1,
      cd_aluno: null,
      cd_professor: null,
      sn_locado: 'N'
    },
    {
      cd_livro: 2,
      nm_livro: 'Design Patterns',
      cd_bibliotecario: 1,
      cd_categoria: 2,
      cd_autor: 2,
      cd_aluno: 1,
      cd_professor: null,
      sn_locado: 'S'
    }
  ])

  let nextId = ref(3)

  const totalLivros = computed(() => livros.value.length)
  const livrosDisponiveis = computed(() => livros.value.filter(l => l.sn_locado === 'N'))
  const livrosLocados = computed(() => livros.value.filter(l => l.sn_locado === 'S'))

  // CREATE
  const adicionarLivro = (dados: LivroFormData) => {
    const novoLivro: Livro = {
      cd_livro: nextId.value++,
      ...dados
    }
    livros.value.push(novoLivro)
    return novoLivro
  }

  // READ
  const obterLivros = () => livros.value

  const obterLivroPorId = (id: number) => {
    return livros.value.find(l => l.cd_livro === id)
  }

  // UPDATE
  const atualizarLivro = (id: number, dados: LivroFormData) => {
    const index = livros.value.findIndex(l => l.cd_livro === id)
    if (index !== -1) {
      livros.value[index] = { cd_livro: id, ...dados }
      return livros.value[index]
    }
    return null
  }

  // DELETE
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
    obterLivros,
    obterLivroPorId,
    atualizarLivro,
    deletarLivro
  }
})

