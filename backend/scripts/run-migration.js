const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function runMigration() {
  let connection;
  
  try {
    // Criar conexão com o banco de dados (sem especificar o banco de dados)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true // Permite executar múltiplos comandos SQL
    });

    console.log('Conectado ao MySQL');

    // Ler o arquivo de migração
    const migrationPath = path.join(__dirname, '../migrations/setup_database.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');

    // Executar a migração
    await connection.query(migrationSQL);
    console.log('Migração executada com sucesso!');
    console.log('Banco de dados e tabelas criados/atualizados com sucesso.');

  } catch (error) {
    console.error('Erro ao executar migração:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexão com o MySQL encerrada');
    }
  }
}

// Executar a migração
runMigration(); 