const express = require('express');
const cors = require('cors');
const { testConnection } = require('./db');
const { router: authRouter } = require('./routes/auth');
const registrosRouter = require('./routes/registros');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3306;

// Middlewares
app.use(cors());
app.use(express.json());

// Testar conexão com o banco de dados
testConnection();

// Rotas
app.use('/api/auth', authRouter);
app.use('/api/registros', registrosRouter);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do Anotando está funcionando!');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 