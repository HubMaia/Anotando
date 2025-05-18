# Anotando - Sistema de Registro de Atividades

Um sistema web para registro e acompanhamento de atividades, desenvolvido com React, Node.js e MySQL.

## 🚀 Tecnologias Utilizadas

### Frontend

- React.js
- Material-UI
- React Router DOM
- Axios

### Backend

- Node.js
- Express
- MySQL
- JWT para autenticação

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 8.0 ou superior)
- NPM ou Yarn

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/HubMaia/system-Anotando.git
cd system-Anotando
```

2. Instale as dependências do backend:

```bash
cd backend
npm install
```

3. Instale as dependências do frontend:

```bash
cd ../frontend
npm install
```

4. Configure o banco de dados:

- Crie um banco de dados MySQL chamado `anotando`
- Execute os scripts SQL fornecidos na pasta `backend/database`

5. Configure as variáveis de ambiente:

- Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=anotando
JWT_SECRET=sua_chave_secreta
```

## 🚀 Executando o Projeto

1. Inicie o servidor backend:

```bash
cd backend
npm start
```

2. Em outro terminal, inicie o frontend:

```bash
cd frontend
npm start
```

O frontend estará disponível em `http://localhost:3000` e o backend em `http://localhost:5000`.

## 📝 Funcionalidades

- Autenticação de usuários
- Registro de atividades
- Visualização de histórico
- Interface responsiva
- Proteção de rotas

## 🔐 Estrutura do Banco de Dados

### Tabela de Usuários

```sql
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  senha VARCHAR(255)
);
```

### Tabela de Registros

```sql
CREATE TABLE registros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  data DATE,
  horario ENUM('Café - Antes', 'Café - Depois', 'Almoço - Antes', 'Almoço - Depois', 'Janta - Antes', 'Janta - Depois'),
  valor_glicemia INT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

## 👥 Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit de suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✒️ Autores

- **Maia** - _Desenvolvimento_ - [HubMaia](https://github.com/HubMaia)

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no GitHub.
