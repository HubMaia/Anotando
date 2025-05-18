const mysql = require('mysql2/promise');
require('dotenv').config();

// Criar pool de conexões com o MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'anotandodb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para testar a conexão
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexão com banco de dados estabelecida com sucesso!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return false;
  }
};

module.exports = { pool, testConnection }; 