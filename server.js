const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Ocorrencia = require('./Ocorrencia'); // modelo corrigido

const app = express();
const PORT = process.env.PORT || 3000; // Compatível com Render

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // servir HTML, CSS e JS

// Conexão com MongoDB Atlas
mongoose.connect(
  'mongodb+srv://bicudo2025:bicudo2025@clusterbicudo.lmsenry.mongodb.net/ocorrencia?retryWrites=true&w=majority&appName=Clusterbicudo',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Confirmação de conexão com Mongo
mongoose.connection.on('connected', () => {
  console.log('📡 Conectado no MongoDB!');
  console.log('🧠 Banco usado:', mongoose.connection.name);
});

// Rota para registrar ocorrência
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

// Rota para listar todas ocorrências
app.get('/ocorrencias', async (req, res) => {
  try {
    const lista = await Ocorrencia.find().sort({ dataHora: -1 });
    res.json(lista);
  } catch (err) {
    console.error('Erro ao buscar ocorrências:', err);
    res.status(500).json({ error: 'Erro ao buscar ocorrências.' });
  }
});

// Inicia servidor na porta certa
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
