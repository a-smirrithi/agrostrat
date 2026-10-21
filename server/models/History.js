const mongoose = require('mongoose');

const advisoryHistorySchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  metrics: { type: Object },
  advisories: { type: [Object] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdvisoryHistory', advisoryHistorySchema);
