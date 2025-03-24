const mongoose = require('mongoose');

const squadSchema = new mongoose.Schema({
    squadNumber: Number,
    soldierName: String,
    soldierTitle: String,
    hairColor: String,
    weight: String,
    soldierSkills: [],
    soldierEquipment: [],
    isInjured: Boolean,
})

const Soldier = mongoose.model('Soldier', squadSchema);

module.exports = Soldier;