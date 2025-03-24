const mongoose = require('mongoose');

const armySchema = new mongoose.Schema({
    squadName: String,
    squadNumber: Number,
    squadFormed: Date,
    squadMemberCount: Number,
    isReadyToDeploy: Boolean,
})

const squadSchema = new mongoose.Schema({
    soldierName: String,
    soldierTitle: String,
    hairColor: String,
    weight: String,
    soldierSkills: [],
    soldierEquipment: [],
    isInjured: Boolean,
})

const Squad = mongoose.model('Squad', armySchema);
const Soldier = mongoose.model('Soldier', squadSchema);

module.exports = Soldier;
module.exports = Squad;