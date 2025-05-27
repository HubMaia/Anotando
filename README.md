# Anotando - Aplicativo de Registro de Glicemia

O Anotando é um aplicativo web desenvolvido para ajudar pessoas com diabetes a monitorar seus níveis de glicemia de forma simples e eficiente.

## Sobre o Projeto

Anotando é um aplicativo web desenvolvido para ajudar pessoas com diabetes a registrar e monitorar seus níveis de glicemia. O aplicativo permite registrar medições de glicemia em diferentes horários do dia, incluindo descrições detalhadas das refeições.

## Funcionalidades

- Registro de medições de glicemia com horários específicos
- Diferentes tipos de medição:
  - Antes das refeições (em jejum)
  - Depois das refeições (após comer)
- Registro de refeições (apenas para medições após comer)
- Histórico de registros com filtros por data
- Geração de relatórios em PDF
- Interface intuitiva com ícones para cada tipo de refeição
- Validação de valores glicêmicos
- Alertas para valores críticos

## Tecnologias Utilizadas

### Frontend

- React.js
- Axios para requisições HTTP
- jsPDF e jspdf-autotable para geração de PDFs
- CSS para estilização

### Backend

- Node.js
- Express.js
- MySQL
- JWT para autenticação

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

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/anotando.git
cd anotando
```

2. Instale todas as dependências (backend e frontend) com um único comando:

```bash
npm run install-all
```

3. Configure o banco de dados MySQL:

- Crie um banco de dados chamado `anotandodb`
- Execute o script de migração em `backend/migrations/setup_database.sql`

4. Configure as variáveis de ambiente:

- Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:

```
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=anotandodb
JWT_SECRET=seu_segredo_jwt
```

## Executando o Projeto

### Desenvolvimento

Para iniciar o projeto em modo de desenvolvimento (backend + frontend) com um único comando:

```bash
npm run dev
```

Ou, se preferir instalar as dependências e iniciar o projeto de uma vez:

```bash
npm run setup
```

### Produção

Para build do frontend:

```bash
npm run build
```

Para executar em produção:

```bash
npm run prod
```

### Outros Comandos Úteis

- Limpar todas as dependências:

```bash
npm run clean
```

- Iniciar apenas o backend:

```bash
npm run server
```

- Iniciar apenas o frontend:

```bash
npm run client
```

O aplicativo estará disponível em:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Uso

1. Crie uma conta ou faça login
2. Na página principal, você pode:
   - Registrar uma nova medição de glicemia
   - Selecionar o horário (antes/depois das refeições)
   - Inserir o valor da glicemia
   - Adicionar descrição da refeição (apenas para medições após comer)
3. No histórico, você pode:
   - Visualizar todos os registros
   - Filtrar por período
   - Gerar relatório em PDF
   - Excluir registros

## Valores de Referência

### Em Jejum

- Normal: 70-99 mg/dL
- Pré-diabetes: 100-125 mg/dL
- Diabetes: > 125 mg/dL

### Após Refeição

- Normal: < 200 mg/dL
- Diabetes: > 200 mg/dL

### Hipoglicemia

- < 70 mg/dL

## Solução de Problemas

### Problemas Comuns

1. **Erro de conexão com o banco de dados**

   - Verifique se o MySQL está rodando
   - Confira as credenciais no arquivo `.env`
   - Certifique-se de que o banco de dados `anotandodb` existe

2. **Erro ao executar migrações**

   - Verifique se você tem permissões de administrador no MySQL
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

```

```
