<script setup lang="ts">
import { ref } from 'vue'
import { useLivroStore } from '../stores/livroStore'
import type { LivroFormData, Livro } from '../types'

const store = useLivroStore()
const mostraFormulario = ref(false)
const editandoId = ref<number | null>(null)

const formulario = ref<LivroFormData>({
  nm_livro: '',
  cd_bibliotecario: 1,
  cd_categoria: 1,
  cd_autor: 1,
  cd_aluno: null,
  cd_professor: null,
  sn_locado: 'N'
})

const resetarFormulario = () => {
  formulario.value = {
    nm_livro: '',
    cd_bibliotecario: 1,
    cd_categoria: 1,
    cd_autor: 1,
    cd_aluno: null,
    cd_professor: null,
    sn_locado: 'N'
  }
  editandoId.value = null
  mostraFormulario.value = false
}

const salvar = () => {
  if (!formulario.value.nm_livro) {
    alert('Preencha o nome do livro!')
    return
  }

  if (editandoId.value) {
    store.atualizarLivro(editandoId.value, formulario.value)
  } else {
    store.adicionarLivro(formulario.value)
  }

  resetarFormulario()
}

const editar = (livro: Livro) => {
  formulario.value = { ...livro }
  editandoId.value = livro.cd_livro
  mostraFormulario.value = true
}

const deletar = (id: number) => {
  if (confirm('Tem certeza que deseja deletar este livro?')) {
    store.deletarLivro(id)
  }
}

const abrirFormularioCriacao = () => {
  resetarFormulario()
  mostraFormulario.value = true
}
</script>

<template>
  <main class="container">
    <div class="header">
      <h1>📚 Gerenciamento de Livros</h1>
      <button @click="abrirFormularioCriacao" class="btn-primary">
        ➕ Adicionar Livro
      </button>
    </div>

    <!-- Formulário -->
    <div v-if="mostraFormulario" class="formulario">
      <h2>{{ editandoId ? 'Editar Livro' : 'Novo Livro' }}</h2>
      <form @submit.prevent="salvar">
        <div class="form-group">
          <label for="nm_livro">Nome do Livro *</label>
          <input
            v-model="formulario.nm_livro"
            id="nm_livro"
            type="text"
            placeholder="Digite o nome do livro"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="cd_categoria">Categoria</label>
            <input
              v-model.number="formulario.cd_categoria"
              id="cd_categoria"
              type="number"
              min="1"
            />
          </div>

          <div class="form-group">
            <label for="cd_autor">Autor</label>
            <input
              v-model.number="formulario.cd_autor"
              id="cd_autor"
              type="number"
              min="1"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="cd_bibliotecario">Bibliotecário</label>
            <input
              v-model.number="formulario.cd_bibliotecario"
              id="cd_bibliotecario"
              type="number"
              min="1"
            />
          </div>

          <div class="form-group">
            <label for="sn_locado">Status</label>
            <select v-model="formulario.sn_locado" id="sn_locado">
              <option value="N">Disponível</option>
              <option value="S">Locado</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="cd_aluno">ID do Aluno</label>
            <input
              v-model.number="formulario.cd_aluno"
              id="cd_aluno"
              type="number"
              min="1"
              placeholder="Deixe em branco se não aplicável"
            />
          </div>

          <div class="form-group">
            <label for="cd_professor">ID do Professor</label>
            <input
              v-model.number="formulario.cd_professor"
              id="cd_professor"
              type="number"
              min="1"
              placeholder="Deixe em branco se não aplicável"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">
            {{ editandoId ? '✏️ Atualizar' : '➕ Adicionar' }}
          </button>
          <button type="button" @click="resetarFormulario" class="btn-secondary">
            ✖️ Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Estatísticas -->
    <div class="stats">
      <div class="stat-card">
        <span class="stat-label">Total de Livros</span>
        <span class="stat-value">{{ store.totalLivros }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Disponíveis</span>
        <span class="stat-value">{{ store.livrosDisponiveis.length }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Locados</span>
        <span class="stat-value">{{ store.livrosLocados.length }}</span>
      </div>
    </div>

    <!-- Lista de Livros -->
    <div class="lista">
      <h2>Lista de Livros</h2>
      <div v-if="store.livros.length === 0" class="vazio">
        <p>Nenhum livro cadastrado ainda.</p>
      </div>
      <div v-else class="tabela-responsive">
        <table class="tabela">
          <thead>
            <tr>
              <th>Nome do Livro</th>
              <th>Categoria</th>
              <th>Autor</th>
              <th>Bibliotecário</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="livro in store.livros" :key="livro.cd_livro">
              <td>{{ livro.nm_livro }}</td>
              <td>#{{ livro.cd_categoria }}</td>
              <td>#{{ livro.cd_autor }}</td>
              <td>#{{ livro.cd_bibliotecario }}</td>
              <td>
                <span :class="['status', livro.sn_locado === 'N' ? 'disponivel' : 'indisponivel']">
                  {{ livro.sn_locado === 'N' ? '✓ Disponível' : '✗ Locado' }}
                </span>
              </td>
              <td class="acoes">
                <button @click="editar(livro)" class="btn-edit" title="Editar">
                  ✏️
                </button>
                <button @click="deletar(livro.cd_livro)" class="btn-delete" title="Deletar">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.header h1 {
  color: #2c3e50;
  font-size: 2.5em;
  margin: 0;
}

/* Formulário */
.formulario {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.formulario h2 {
  margin-bottom: 20px;
  font-size: 1.8em;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 1em;
}

input[type='text'],
input[type='number'] {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  background: rgba(255, 255, 255, 0.95);
  color: #2c3e50;
  transition: all 0.3s;
}

select {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  background: rgba(255, 255, 255, 0.95);
  color: #2c3e50;
  transition: all 0.3s;
  cursor: pointer;
}

input[type='text']:focus,
input[type='number']:focus,
select:focus {
  outline: none;
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.form-group.checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-group.checkbox input[type='checkbox'] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.form-group.checkbox label {
  margin-bottom: 0;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Estatísticas */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  color: #667eea;
  font-size: 2.5em;
  font-weight: bold;
}

/* Lista */
.lista {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.lista h2 {
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.8em;
}

.vazio {
  text-align: center;
  padding: 40px 20px;
  color: #95a5a6;
  font-size: 1.1em;
}

.tabela-responsive {
  overflow-x: auto;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.tabela thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.tabela th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85em;
  letter-spacing: 0.5px;
}

.tabela td {
  padding: 15px;
  border-bottom: 1px solid #ecf0f1;
  color: #2c3e50;
}

.tabela tbody tr {
  transition: background-color 0.3s;
}

.tabela tbody tr:hover {
  background-color: #f8f9fa;
}

.status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
}

.status.disponivel {
  background: #d4edda;
  color: #155724;
}

.status.indisponivel {
  background: #f8d7da;
  color: #721c24;
}

.acoes {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
  border: 1px solid #ecf0f1;
}

.btn-edit:hover {
  background: #e3f2fd;
  border-color: #667eea;
}

.btn-delete:hover {
  background: #ffebee;
  border-color: #e74c3c;
}

/* Responsive */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header h1 {
    font-size: 1.8em;
  }

  .header button {
    width: 100%;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .tabela {
    font-size: 0.9em;
  }

  .tabela th,
  .tabela td {
    padding: 10px;
  }

  .acoes {
    gap: 4px;
  }

  .btn-edit,
  .btn-delete {
    padding: 6px 10px;
    font-size: 0.9em;
  }
}
</style>