const express = require('express');
const rotas = require('./rotas');
const cors = require('cors');
const knex = require ('./conexao')

const app = express();

app.use(express.json());
app.use(cors());
app.use(rotas);

app.listen(3000);