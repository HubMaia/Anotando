# Anotando - Aplicativo de Controle de Glicemia

Um aplicativo web para controle e monitoramento de glicemia, desenvolvido com Node.js, React, MySQL e outras tecnologias modernas.

## Funcionalidades

- Cadastro e autenticação de usuários
- Registro de medições de glicemia em diferentes momentos do dia
- Visualização do histórico de registros
- Filtros por período
- Interface responsiva e amigável

## Tecnologias Utilizadas

- **Backend**: Node.js, Express, MySQL
- **Frontend**: React, CSS
- **Autenticação**: JWT (JSON Web Tokens)
- **Banco de Dados**: MySQL

## Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)
- npm ou yarn

## Configuração do Banco de Dados

1. Crie um banco de dados MySQL chamado `anotandodb`:

```sql
CREATE DATABASE anotandodb;
```

2. Use o banco de dados:

```sql
USE anotandodb;
```

3. Execute os seguintes comandos SQL para criar as tabelas necessárias:

```sql
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  senha VARCHAR(255)
);

CREATE TABLE registros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  data DATE,
  horario ENUM('Café - Antes', 'Café - Depois', 'Almoço - Antes', 'Almoço - Depois', 'Janta - Antes', 'Janta - Depois'),
  valor_glicemia INT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

## Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd anotando
```

2. Instale as dependências do backend e frontend:

```bash
npm run install-all
```

3. Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente:

```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas configurações locais (credenciais do banco, etc.)

## Executando a Aplicação

1. Para executar o backend e frontend simultaneamente:

```bash
npm run dev
```

2. Para executar apenas o backend:

```bash
npm run server
```

3. Para executar apenas o frontend:

```bash
npm run client
```

A aplicação estará disponível em:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Rotas da API

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/me` - Obter dados do usuário autenticado

### Registros de Glicemia

- `GET /api/registros` - Listar todos os registros do usuário
- `GET /api/registros/:id` - Obter um registro específico
- `POST /api/registros` - Criar novo registro
- `PUT /api/registros/:id` - Atualizar um registro
- `DELETE /api/registros/:id` - Excluir um registro
- `GET /api/registros/periodo/:dataInicio/:dataFim` - Buscar registros por período

## Licença

Este projeto está licenciado sob a licença MIT.
