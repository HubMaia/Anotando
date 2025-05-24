# Anotando - Aplicativo de Registro de Glicemia

## Sobre o Projeto

Anotando é um aplicativo web desenvolvido para ajudar pessoas com diabetes a registrar e monitorar seus níveis de glicemia. O aplicativo permite registrar medições de glicemia em diferentes horários do dia, incluindo descrições detalhadas das refeições.

## Funcionalidades

- Registro de medições de glicemia com data e horário
- Categorização automática dos níveis de glicemia (hipoglicemia, normal, pré-diabetes, diabetes)
- Registro detalhado das refeições com descrições
- Visualização do histórico de registros
- Filtro de registros por período
- Interface intuitiva com ícones para cada tipo de refeição
- Modal para visualização detalhada das descrições das refeições
- Sistema de autenticação de usuários
- Validação de idade (maior de 18 anos)

## Tecnologias Utilizadas

- Frontend: React.js
- Backend: Node.js com Express
- Banco de Dados: PostgreSQL
- Autenticação: JWT (JSON Web Tokens)
- Estilização: CSS puro

## Estrutura do Projeto

```
anotando/
├── frontend/           # Aplicação React
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── assets/     # Imagens e recursos
│   │   └── App.js      # Componente principal
│   └── package.json    # Dependências do frontend
│
└── backend/           # API Node.js
    ├── migrations/    # Scripts SQL
    ├── src/          # Código fonte
    └── package.json  # Dependências do backend
```

## Instalação e Execução

### Pré-requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL
- NPM ou Yarn

### Configuração do Banco de Dados

1. Instale o PostgreSQL em sua máquina
2. Crie um banco de dados chamado `anotandodb`
3. Configure as variáveis de ambiente no arquivo `.env` do backend:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=anotandodb
   JWT_SECRET=sua_chave_secreta
   ```

### Backend

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute as migrações do banco de dados em ordem:
   ```bash
   # Execute cada arquivo de migração na ordem:
   psql -U seu_usuario -d anotandodb -f migrations/initial_setup.sql
   psql -U seu_usuario -d anotandodb -f migrations/add_descricao_refeicao.sql
   psql -U seu_usuario -d anotandodb -f migrations/update_horario_enum.sql
   psql -U seu_usuario -d anotandodb -f migrations/add_age_validation.sql
   ```
4. Inicie o servidor:
   ```bash
   npm start
   ```

### Frontend

1. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie a aplicação:
   ```bash
   npm start
   ```

## Uso

1. Acesse a aplicação em `http://localhost:3000`
2. Faça login ou registre-se (lembre-se que é necessário ter 18 anos ou mais)
3. Use o formulário para registrar suas medições de glicemia
4. Visualize seu histórico na página de histórico
5. Use os filtros para buscar registros específicos
6. Clique nas descrições das refeições para ver detalhes completos

## Solução de Problemas

### Problemas Comuns

1. **Erro de conexão com o banco de dados**

   - Verifique se o PostgreSQL está rodando
   - Confira as credenciais no arquivo `.env`
   - Certifique-se de que o banco de dados `anotandodb` existe

2. **Erro ao executar migrações**

   - Verifique se você tem permissões de administrador no PostgreSQL
   - Execute as migrações na ordem correta
   - Verifique se o banco de dados existe antes de executar as migrações

3. **Erro ao registrar usuário**
   - Verifique se todos os campos obrigatórios foram preenchidos
   - Confirme se a idade é maior ou igual a 18 anos
   - Verifique se o email não está sendo usado por outro usuário

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
