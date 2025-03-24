const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require('path');

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`connected to MongoDB ${mongoose.connection.name}.`)
})

const Squad = require('./models/army.js')
const Soldier = require('./models/squad.js')

app.get('/', (req, res) => {
    res.render("home.ejs")
})

app.get('/army', async (req, res) => {
    const allSquads = await Squad.find()
    res.render("army.ejs", { squads: allSquads })
})

app.get('/army/addsquad', (req, res) => {
    res.render("squad-add.ejs")
})

app.get('/army/:squadId', async (req, res) => {
    const foundSquad = await Squad.findById(req.params.squadId);
    const squadMembers = await Soldier.find(foundSquad.squadNumber)
    res.render("squad.ejs", { member: squadMembers })
})

app.get('/army/:squadId/edit', (req, res) => {
    res.render("squad-edit.ejs")
})

app.get('/army/:squadId/addsoldier', (req, res) => {
    res.render("soldier-add.ejs")
})

app.get('/army/:squadId/:soldierId', (req, res) => {
    res.render("soldier.ejs")
})

app.get('/army/:squadId/:soldierId/edit', (req, res) => {
    res.render("soldier-edit.ejs")
})

app.listen(3010, () => {
    console.log('Listening on port 3010')
})
