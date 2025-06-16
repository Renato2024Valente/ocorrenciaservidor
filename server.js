const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Ocorrencia = require('./Ocorrencia'); // ← Caminho corrigido

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com MongoDB Atlas
mongoose.connect('mongodb+srv://bicudo2025:bicudo2025@clusterbicudo.lmsenry.mongodb.net/ocorrencia?retryWrites=true&w=majority&appName=Clusterbicudo');

// Log de conexão bem-sucedida
mongoose.connection.on('connected', () => {
  console.log('📡 Conectado no MongoDB!');
  console.log('🧠 Banco usado:', mongoose.connection.name);
});

// Rota para registrar uma nova ocorrência
app.post('/ocorrencias', async (req, res) => {
  try {
    const { nomeAluno, serie, professor, assinatura, descricao, ocorrencias } = req.body;
    const dataISO = new Date().toISOString();
    const nomeComData = `${dataISO.slice(0, 10)} - ${nomeAluno}`;

    const nova = new Ocorrencia({
      nomeAluno: nomeComData,
      serie,
      professor,
      assinatura,
      descricao,
      ocorrencias,
      dataHora: new Date()
    });

    await nova.save();
    res.status(201).json({ message: 'Ocorrência salva com sucesso!' });
  } catch (err) {
    console.error('Erro ao salvar ocorrência:', err);
    res.status(500).json({ error: 'Erro ao salvar ocorrência.' });
  }
});

// Rota para listar ocorrências ordenadas por data decrescente
app.get('/ocorrencias', async (req, res) => {
  try {
    const lista = await Ocorrencia.find().sort({ dataHora: -1 });
    res.json(lista);
  } catch (err) {
    console.error('Erro ao buscar ocorrências:', err);
    res.status(500).json({ error: 'Erro ao buscar ocorrências.' });
  }
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('✅ Servidor rodando em http://localhost:3000');
});
