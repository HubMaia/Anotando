# Anotando - Sistema de Controle de Glicemia

Um sistema web para controle e monitoramento de glicemia, desenvolvido com React, Node.js e MySQL.

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

1. **Node.js e NPM**

   - Acesse [nodejs.org](https://nodejs.org)
   - Baixe e instale a versão LTS (Long Term Support)
   - Para verificar se a instalação foi bem-sucedida, abra o terminal e digite:
     ```bash
     node --version
     npm --version
     ```

2. **MySQL**

   - Acesse [mysql.com](https://mysql.com)
   - Baixe e instale o MySQL Community Server
   - Durante a instalação, anote a senha do usuário root
   - Para verificar se a instalação foi bem-sucedida, abra o terminal e digite:
     ```bash
     mysql --version
     ```

3. **Git**
   - Acesse [git-scm.com](https://git-scm.com)
   - Baixe e instale o Git para seu sistema operacional
   - Para verificar se a instalação foi bem-sucedida, abra o terminal e digite:
     ```bash
     git --version
     ```

## 🔧 Configuração do Ambiente

### 1. Clone o Repositório

Abra o terminal e execute:

```bash
git clone https://github.com/HubMaia/Anotando.git
cd Anotando
```

### 2. Configure o Banco de Dados

1. Abra o MySQL Workbench ou o terminal do MySQL
2. Execute os seguintes comandos:

```sql
-- Criar o banco de dados
CREATE DATABASE anotandodb;

-- Usar o banco de dados
USE anotandodb;

-- Criar a tabela de usuários
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  senha VARCHAR(255)
);

-- Criar a tabela de registros
CREATE TABLE registros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  data DATE,
  horario ENUM('Café - Antes', 'Café - Depois', 'Almoço - Antes', 'Almoço - Depois', 'Janta - Antes', 'Janta - Depois'),
  valor_glicemia INT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

### 3. Configure as Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo chamado `.env`
2. Adicione as seguintes linhas (substitua com suas informações):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=anotandodb
JWT_SECRET=uma_chave_secreta_qualquer
```

### 4. Instale as Dependências

1. Instale as dependências do backend:

```bash
cd backend
npm install
```

Este comando instalará automaticamente todas as dependências necessárias listadas no package.json, incluindo:

- express
- mysql2
- cors
- dotenv
- bcryptjs
- jsonwebtoken

2. Instale as dependências do frontend:

```bash
cd ../frontend
npm install
```

Este comando instalará automaticamente todas as dependências necessárias listadas no package.json, incluindo:

- react-router-dom
- axios
- @mui/material
- @emotion/react
- @emotion/styled
- @mui/icons-material

## 🚀 Executando o Projeto

### 1. Inicie o Backend

Em um terminal, na pasta do projeto:

```bash
cd backend
npm start
```

O servidor backend iniciará na porta 5000. Você verá uma mensagem indicando que o servidor está rodando.

### 2. Inicie o Frontend

Em outro terminal, na pasta do projeto:

```bash
cd frontend
npm start
```

O frontend iniciará na porta 3000 e seu navegador abrirá automaticamente com a aplicação.

## 📱 Usando a Aplicação

1. **Criar uma Conta**

   - Acesse http://localhost:3000
   - Clique em "Registrar"
   - Preencha seus dados

2. **Fazer Login**

   - Use seu email e senha para acessar

3. **Registrar Medições**

   - Após o login, você verá o formulário de registro
   - Selecione a data
   - Escolha o horário da refeição
   - Digite o valor da glicemia
   - Clique em "Salvar"

4. **Ver Histórico**
   - Na página inicial, você verá seu histórico de medições
   - Use os filtros para buscar por período

## 🛠️ Tecnologias Utilizadas

### Frontend

- React.js - Biblioteca JavaScript para construção de interfaces
- Material-UI - Biblioteca de componentes visuais
- React Router DOM - Gerenciamento de rotas
- Axios - Cliente HTTP para requisições

### Backend

- Node.js - Ambiente de execução JavaScript
- Express - Framework web
- MySQL - Banco de dados
- JWT - Autenticação via tokens

## ❓ Solução de Problemas

### Problemas Comuns

1. **Erro de conexão com o banco de dados**

   - Verifique se o MySQL está rodando
   - Confira as credenciais no arquivo `.env`
   - Certifique-se que o banco `anotandodb` existe

2. **Erro ao iniciar o frontend**

   - Verifique se todas as dependências foram instaladas
   - Tente deletar a pasta `node_modules` e execute `npm install` novamente

3. **Erro ao iniciar o backend**
   - Verifique se a porta 5000 está disponível
   - Confira se todas as dependências foram instaladas

## 👥 Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit de suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## ✒️ Autores

- **Maia** - _Desenvolvimento_ - [HubMaia](https://github.com/HubMaia)

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no GitHub.
