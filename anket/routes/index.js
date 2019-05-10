var express = require('express');
var router = express.Router();

var db = require('../config/db');
var sql = require('mssql');

var result;

/* GET home page. */
router.get('/', function (req, res, next) {

  sql.connect(db, function (err) {
    if (err)
      console.log(err);

    var request = new sql.Request();

    request.query('select * from Puanlar', function (err, result) {
      if (err) {
        console.log(err)
        res.send(err);
      }
      sql.close();
      res.render('index', {
        route: 'Ana Sayfa',
        data: result.recordset
      });

    }); // request.query
  }); // sql.conn
}); // get /


/* GET Edit page. */
router.get('/edit/:id/', function (req, res, next) {

  sql.connect(db, function (err) {
    if (err)
      console.log(err);

    var request = new sql.Request();
    request.input('id', sql.Int, req.params.id)
    request.query("select * from Puanlar where Id=@id", function (err, result) {

      if (err) {
        console.log(err)
        res.send(err);
      }
      // var rowsCount = result.rowsAffected;
      sql.close();
      res.render('edit', {
        route: 'edit',
        data: result.recordset[0]
      });

    }); // request.query
  }); // sql.conn
});


/* POST Edit page. */
router.post('/update', function (req, res, next) {

  sql.connect(db, function (err) {
    if (err)
      console.log(err);

    var request = new sql.Request();
    request.input('Id', sql.Int, req.body.Id)
      .input('Ad', sql.NVarChar(50), req.body.Ad)
      .input('Soyad', sql.NVarChar(50), req.body.Soyad)
      .input('Puan', sql.Int, req.body.Puan)
      .query('update Puanlar set Ad=@Ad,Soyad=@Soyad,Puan=@Puan where Id=@Id', function (err, result) {

        if (err) {
          console.log(err);
          res.send(err);
        }
        sql.close();
        res.redirect('/');
      });
  });
});

/* GET Add page. */
router.get('/add', function (req, res, next) {
  res.render('add', {
    route: 'add',
  });
});


/* POST Add page. */
router.post('/add', function (req, res, next) {

  sql.connect(db, function (err) {
    if (err)
      console.log(err);

    var request = new sql.Request();
    request
      .input('Ad', sql.NVarChar(50), req.body.Ad)
      .input('Soyad', sql.NVarChar(50), req.body.Soyad)
      .input('Puan', sql.Int, req.body.Puan)
      .query('insert into Puanlar (Ad, Soyad, Puan) values (@Ad, @Soyad, @Puan)', function (err, result) {

        if (err) {
          console.log(err);
          res.send(err);
        }
        sql.close();
        res.redirect('/');
      });
  });
});

/* GET Delete page. */
router.get('/delete/:id', function (req, res, next) {

  sql.connect(db, function (err) {
    if (err)
      console.log(err);

    var request = new sql.Request();
    request.input('id', sql.Int, req.params.id)
      .query('delete from Puanlar where Id=@id', function (err, result) {

        if (err) {
          console.log(err);
          res.send(err);
        }
        sql.close();
        res.redirect('/');
      });
  });
});
module.exports = router;