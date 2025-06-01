const express = require('express');
const cors = require('cors');
const { testConnection } = require('./db');
const { router: authRouter } = require('./routes/auth');
const registrosRouter = require('./routes/registros');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middlewares - Configuração CORS mais robusta para Azure
const corsOptions = {
  origin: function (origin, callback) {
    // Permite requisições sem origin (para aplicações mobile, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Lista de origens permitidas - adicione aqui o domínio do seu Azure se necessário
    const allowedOrigins = [
      'http://localhost',
      'http://localhost:80',
      'http://localhost:3000',
      'https://localhost',
      /^https?:\/\/.*\.azure.*$/,  // Permite subdomínios do Azure
    ];
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('Origin não permitida pelo CORS:', origin);
      callback(null, true); // Permite por enquanto para debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cache-Control'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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
