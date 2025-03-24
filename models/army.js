const mongoose = require('mongoose');

const armySchema = new mongoose.Schema({
    squadName: String,
    squadNumber: Number,
    squadFormed: Date,
    squadMemberCount: Number,
    isReadyToDeploy: Boolean,
})

const Squad = mongoose.model('Squad', armySchema);

module.exports = Squad;