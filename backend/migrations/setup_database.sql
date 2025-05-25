-- Criar o banco de dados (se não existir)
CREATE DATABASE IF NOT EXISTS anotandodb;

-- Usar o banco de dados
USE anotandodb;

-- Criar a tabela de usuários com todos os campos necessários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  idade INT NOT NULL,
  diagnostico VARCHAR(50),
  nome_medico VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar a tabela de registros
CREATE TABLE IF NOT EXISTS registros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  data DATE NOT NULL,
  horario VARCHAR(50) NOT NULL,
  valor_glicemia INT NOT NULL,
  descricao_refeicao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Criar índices para melhor performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_registros_usuario_data ON registros(usuario_id, data);

-- Adicionar validação de idade
ALTER TABLE usuarios
ADD CONSTRAINT check_idade CHECK (idade >= 0 AND idade <= 120); 