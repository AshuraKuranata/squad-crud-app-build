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
    allSquads.forEach(squad => {
        const date = new Date(squad.squadFormed);
        const formattedDate = date.toDateString().split(" ").slice(0, 4).join(" ");
        squad.squadFormedFormatted = formattedDate;
    })
    res.render("army.ejs", { squads: allSquads })
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
    if (foundSquad.squadMemberCount === 0) {
        res.render("squad.ejs", { squad: foundSquad})
    } else {
        const squadMembers = await Soldier.find(foundSquad.squadNumber)
        res.render("squad.ejs", { squad: foundSquad, member: squadMembers })
    }
})

app.get('/army/:squadId/edit/', async (req, res) => {
    const foundSquad = await Squad.findById(req.params.squadId);

    res.render("squad-edit.ejs", { squad: foundSquad })
})

// app.get('/army/:squadId/addsoldier', async (req, res) => {
//     const foundSquad = await Squad.findById(req.params.squadId);
//     res.render("soldier-add.ejs", { squad: foundSquad })
// })

// app.get('/army/:squadId/:soldierId', async (req, res) => {
//     const foundSquad = await Squad.findById(req.params.squadId);
//     const foundSoldier = await Soldier.findById(req.params.soldierId)
//     res.render("soldier.ejs")
// })

// app.get('/army/:squadId/:soldierId/edit', async (req, res) => {
//     const foundSquad = await Squad.findById(req.params.squadId);
//     const foundSoldier = await Soldier.findById(req.params.soldierId)
//     res.render("soldier-edit.ejs", { soldier: foundSoldier, squad: foundSquad })
// })

app.listen(3010, () => {
    console.log('Listening on port 3010')
})
