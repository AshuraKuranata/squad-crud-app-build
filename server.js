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

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render("home.ejs")
})

app.get('/army', async (req, res) => {
    const allSquads = await Squad.find()
    // const foundSquad = await Squad.find();
    const allSoldiers = await Soldier.find()
    allSquads.forEach(squad => {
        const date = new Date(squad.squadFormed);
        const formattedDate = date.toDateString().split(" ").slice(0, 4).join(" ");
        squad.squadFormedFormatted = formattedDate;
    })
    res.render("army.ejs", { squads: allSquads, soldiers: allSoldiers })
})

app.get('/army/addsquad', (req, res) => {
    res.render("squad-add.ejs")
})

app.post('/army', async (req, res) => {
    req.body.squadMemberCount = 0;
    req.body.isReadyToDeploy = false;
    await Squad.create(req.body);
    res.redirect('/army')
})

app.get('/army/:squadId', async (req, res) => {
    const foundSquad = await Squad.findById(req.params.squadId);
    const date = new Date(foundSquad.squadFormed);
    const formattedDate = date.toDateString().split(" ").slice(0, 4).join(" ");
    foundSquad.squadFormedFormatted = formattedDate;
    const squadSoldiers = await Soldier.find({squadNumber: foundSquad.squadNumber})
    res.render("squad.ejs", { squad: foundSquad, soldiers: squadSoldiers });
})

app.get('/army/:squadId/edit', async (req, res) => {
    const allSquads = await Squad.find();
    const foundSquad = await Squad.findById(req.params.squadId);
    res.render("squad-edit.ejs", { squad: foundSquad, all: allSquads })
})

app.put('/army/:squadId', async (req, res) => {
    if (req.body.isReadyToDeploy === "on") {
        req.body.isReadyToDeploy = true;
    } else {
        req.body.isReadyToDeploy = false;
    }
    await Squad.findByIdAndUpdate(req.params.squadId, req.body);
    res.redirect(`/army/${req.params.squadId}`)
})

app.get('/army/:squadId/addsoldier', async (req, res) => {
    const foundSquad = await Squad.findById(req.params.squadId);
    const squadId = req.params.squadId
    res.render("soldier-add.ejs", { squad: foundSquad, ID: squadId })
})

app.post('/army/:squadId', async (req, res) => {
    const foundSquad = await Squad.findById(req.params.squadId)
    req.body.squadNumber = foundSquad.squadNumber;
    req.body.isInjured = false;
    req.body.isDeployed = false;
    await Soldier.create(req.body);
    foundSquad.squadMemberCount = Soldier.find({squadNumber: foundSquad.squadNumber}).length
    res.redirect(`/army/${req.params.squadId}`)
})

app.delete('/army/:squadId/', async (req, res) => {
    const foundSquad = await Squad.findById(req.params.squadId);
    const allSoldier = await Soldier.find()
    await Squad.findByIdAndDelete(req.params.squadId);
    res.redirect('/army')
})

app.get('/army/:squadId/:soldierId', async (req, res) => {
    const foundSquad = await Squad.findById(req.params.squadId);
    const foundSoldier = await Soldier.findById(req.params.soldierId)
    res.render("soldier.ejs", { soldier: foundSoldier, squad: foundSquad })
})

app.get('/army/:squadId/:soldierId/edit', async (req, res) => {
    const foundSquad = await Squad.findById(req.params.squadId);
    const foundSoldier = await Soldier.findById(req.params.soldierId)
    res.render("soldier-edit.ejs", { soldier: foundSoldier, squad: foundSquad })
})

app.put('/army/:squadId/:soldierId', async (req, res) => {
    if (req.body.isInjured === "on") {
        req.body.isInjured = true;
    } else {
        req.body.isInjured = false;
    }
    if (req.body.isDeployed === "on") {
        req.body.isDeployed = true;
    } else {
        req.body.isDeployed = false;
    }
    await Soldier.findByIdAndUpdate(req.params.soldierId, req.body)
    res.redirect(`/army/${req.params.squadId}/${req.params.soldierId}`)
})

app.delete('/army/:squadId/:soldierId', async (req, res) => {
    await Soldier.findByIdAndDelete(req.params.soldierId);
    res.redirect(`/army/${req.params.squadId}`)
})

app.listen(3010, () => {
    console.log('Listening on port 3010')
})
