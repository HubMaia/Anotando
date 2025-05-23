const express = require('express');
const { pool } = require('../db');
const { authMiddleware } = require('./auth');

const router = express.Router();

// Middleware para garantir autenticação em todas as rotas
router.use(authMiddleware);

// Listar todos os registros do usuário
router.get('/', async (req, res) => {
  try {
    const userId = req.userData.userId;
    
    const [registros] = await pool.query(
      'SELECT * FROM registros WHERE usuario_id = ? ORDER BY data DESC, horario ASC',
      [userId]
    );
    
    res.status(200).json({ registros });
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    res.status(500).json({ message: 'Erro ao buscar registros' });
  }
});

// Obter um registro específico
router.get('/:id', async (req, res) => {
  try {
    const registroId = req.params.id;
    const userId = req.userData.userId;
    
    const [registros] = await pool.query(
      'SELECT * FROM registros WHERE id = ? AND usuario_id = ?',
      [registroId, userId]
    );
    
    if (registros.length === 0) {
      return res.status(404).json({ message: 'Registro não encontrado' });
    }
    
    res.status(200).json({ registro: registros[0] });
  } catch (error) {
    console.error('Erro ao buscar registro:', error);
    res.status(500).json({ message: 'Erro ao buscar registro' });
  }
});

// Criar novo registro
router.post('/', async (req, res) => {
  try {
    const { data, horario, valor_glicemia, descricao_refeicao } = req.body;
    const userId = req.userData.userId;
    
    // Validar dados
    if (!data || !horario || !valor_glicemia) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    
    // Validar o horário (deve ser um dos valores permitidos)
    const horariosPermitidos = [
      'Cafe - Antes', 
      'Cafe - Depois', 
      'Cafe-Tarde - Antes',
      'Cafe-Tarde - Depois',
      'Almoco - Antes', 
      'Almoco - Depois', 
      'Janta - Antes', 
      'Janta - Depois'
    ];
    
    if (!horariosPermitidos.includes(horario)) {
      return res.status(400).json({ 
        message: 'Horário inválido. Deve ser um dos seguintes valores: ' + horariosPermitidos.join(', ')
      });
    }
    
    // Inserir registro
    const [result] = await pool.query(
      'INSERT INTO registros (usuario_id, data, horario, valor_glicemia, descricao_refeicao) VALUES (?, ?, ?, ?, ?)',
      [userId, data, horario, valor_glicemia, descricao_refeicao || null]
    );
    
    res.status(201).json({
      message: 'Registro criado com sucesso',
      registroId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao criar registro:', error);
    res.status(500).json({ message: 'Erro ao criar registro' });
  }
});

// Atualizar um registro
router.put('/:id', async (req, res) => {
  try {
    const registroId = req.params.id;
    const userId = req.userData.userId;
    const { data, horario, valor_glicemia, descricao_refeicao } = req.body;
    
    // Validar dados
    if (!data || !horario || !valor_glicemia) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    
    // Validar o horário (deve ser um dos valores permitidos)
    const horariosPermitidos = [
      'Cafe - Antes', 
      'Cafe - Depois', 
      'Cafe-Tarde - Antes',
      'Cafe-Tarde - Depois',
      'Almoco - Antes', 
      'Almoco - Depois', 
      'Janta - Antes', 
      'Janta - Depois'
    ];
    
    if (!horariosPermitidos.includes(horario)) {
      return res.status(400).json({ 
        message: 'Horário inválido. Deve ser um dos seguintes valores: ' + horariosPermitidos.join(', ')
      });
    }
    
    // Verificar se o registro pertence ao usuário
    const [registros] = await pool.query(
      'SELECT * FROM registros WHERE id = ? AND usuario_id = ?',
      [registroId, userId]
    );
    
    if (registros.length === 0) {
      return res.status(404).json({ message: 'Registro não encontrado' });
    }
    
    // Atualizar registro
    await pool.query(
      'UPDATE registros SET data = ?, horario = ?, valor_glicemia = ?, descricao_refeicao = ? WHERE id = ? AND usuario_id = ?',
      [data, horario, valor_glicemia, descricao_refeicao || null, registroId, userId]
    );
    
    res.status(200).json({ message: 'Registro atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar registro:', error);
    res.status(500).json({ message: 'Erro ao atualizar registro' });
  }
});

// Excluir um registro
router.delete('/:id', async (req, res) => {
  try {
    const registroId = req.params.id;
    const userId = req.userData.userId;
    
    // Verificar se o registro pertence ao usuário
    const [registros] = await pool.query(
      'SELECT * FROM registros WHERE id = ? AND usuario_id = ?',
      [registroId, userId]
    );
    
    if (registros.length === 0) {
      return res.status(404).json({ message: 'Registro não encontrado' });
    }
    
    // Excluir registro
    await pool.query(
      'DELETE FROM registros WHERE id = ? AND usuario_id = ?',
      [registroId, userId]
    );
    
    res.status(200).json({ message: 'Registro excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir registro:', error);
    res.status(500).json({ message: 'Erro ao excluir registro' });
  }
});

// Buscar registros por período
router.get('/periodo/:dataInicio/:dataFim', async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.params;
    const userId = req.userData.userId;
    
    const [registros] = await pool.query(
      'SELECT * FROM registros WHERE usuario_id = ? AND data BETWEEN ? AND ? ORDER BY data ASC, horario ASC',
      [userId, dataInicio, dataFim]
    );
    
    res.status(200).json({ registros });
  } catch (error) {
    console.error('Erro ao buscar registros por período:', error);
    res.status(500).json({ message: 'Erro ao buscar registros por período' });
  }
});

module.exports = router; 