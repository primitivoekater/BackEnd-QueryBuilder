const knex = require('knex')({
    client : 'pg',
    connection:{
        host: 'localhost',
        user:'postgres',
        database: 'market_cubos',
        password: '7418529630qwe',
   
    }
});



module.exports =  knex