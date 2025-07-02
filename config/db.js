const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createConnection({
  
    host: 'localhost',   
    user: 'root',
    password: 'Ali@1#',
    database: 'bibliotheque',
   

});

db.connect((err) => {
  if (err) {
    console.error('Erreur impossible de se connecter la base de données :', err.message);
    process.exit(1);
  }
  console.log('Connexion à la base de données MySQL réussie !');
});

module.exports = db;
