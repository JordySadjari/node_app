var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'BestelApp'});
});

router.get('/get-allData', function(req, res, next) {
    var onedata = [];
    var data = [];
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("makmur");
        dbo.collection("orders").find({}).toArray(function(err, result) {
            if (err) throw err;

            for (var i = 0; i < result.length; i++){
                onedata.push(JSON.parse(result[i].content));
                onedata.push(JSON.parse(result[i].price));
            }
            data.push(onedata);
             console.log(data);
            db.close();
             res.render('data',{items: data});
        });
    });
    // res.redirect('/');
});

router.get('/get-oneData', function(req, res, next) {
    var data = [];

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("makmur");
        dbo.collection("orders").findOne({}, function(err, result) {
            if (err) throw err;
            console.log(result.content);
            db.close();
            // res.render('data', {items: data});
        });
    });
    // res.redirect('/');
});

router.post('/insert', function (req, res, next) {
    var item = {content: req.body.bon, price:req.body.bonPrice};

    console.log(item);

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("makmur");
        dbo.collection("orders").insertOne(item, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
    res.redirect('/get-allData');
});

module.exports = router;
