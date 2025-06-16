const mongoose = require('mongoose');

const OcorrenciaSchema = new mongoose.Schema({
  nomeAluno: String,
  serie: String,
  professor: String,
  assinatura: String,
  descricao: String,
  ocorrencias: [String],
  dataHora: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ocorrencia', OcorrenciaSchema);
