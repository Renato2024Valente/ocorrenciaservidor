const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // ← necessário para servir a pasta public
const Ocorrencia = require('./models/Ocorrencia');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // ← agora o index.html carrega

mongoose.connect('mongodb+srv://bicudo2025:bicudo2025@clusterbicudo.lmsenry.mongodb.net/ocorrencia?retryWrites=true&w=majority&appName=Clusterbicudo');


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
    res.status(500).json({ error: 'Erro ao salvar ocorrência.' });
  }
});
mongoose.connection.on('connected', () => {
  console.log('📡 Conectado no MongoDB!');
  console.log('🧠 Banco usado:', mongoose.connection.name);
});

// Rota para listar ordenado por data decrescente
app.get('/ocorrencias', async (req, res) => {
  const lista = await Ocorrencia.find().sort({ dataHora: -1 });
  res.json(lista);
});

app.listen(3000, () => {
  console.log('✅ Servidor rodando em http://localhost:3000');
});
