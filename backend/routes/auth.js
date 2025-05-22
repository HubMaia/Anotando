const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const router = express.Router();

// Rota para registrar novo usuário
router.post('/register', async (req, res) => {
  try {
    const { 
      nome, 
      email, 
      senha, 
      idade, 
      diagnostico, 
      nome_medico 
    } = req.body;
    
    // Validar dados recebidos
    if (!nome || !email || !senha || !idade) {
      return res.status(400).json({ 
        message: 'Nome, email, senha e idade são campos obrigatórios' 
      });
    }
    
    // Verificar se o email já está cadastrado
    const [existingUsers] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }
    
    // Criptografar senha
    const hashedPassword = await bcrypt.hash(senha, 10);
    
    // Inserir novo usuário no banco
    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, idade, diagnostico, nome_medico) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, email, hashedPassword, idade, diagnostico || null, nome_medico || null]
    );
    
    res.status(201).json({ 
      message: 'Usuário cadastrado com sucesso',
      userId: result.insertId 
    });
    
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

// Rota para login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Validar dados recebidos
    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }
    
    // Buscar usuário pelo email
    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    const user = users[0];
    
    // Verificar senha
    const passwordMatch = await bcrypt.compare(senha, user.senha);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'segredo_temporario',
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        idade: user.idade,
        diagnostico: user.diagnostico,
        nome_medico: user.nome_medico
      }
    });
    
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// Middleware para verificar autenticação
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo_temporario');
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Autenticação falhou' });
  }
};

// Rota para obter dados do usuário autenticado
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, nome, email, idade, diagnostico, nome_medico FROM usuarios WHERE id = ?',
      [req.userData.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    res.status(200).json({ user: users[0] });
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar dados do usuário' });
  }
});

module.exports = { router, authMiddleware }; 