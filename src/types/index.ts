export interface Livro {
  cd_livro: number
  nm_livro: string
  cd_bibliotecario: number
  cd_categoria: number
  cd_autor: number
  cd_aluno: number | null
  cd_professor: number | null
  sn_locado: string
}

export interface LivroFormData {
  nm_livro: string
  cd_bibliotecario: number
  cd_categoria: number
  cd_autor: number
  cd_aluno: number | null
  cd_professor: number | null
  sn_locado: string
}
