var express = require('express');
var router = express.Router();
var request = require('request');

var api_key = process.env.PROPUBLICA_API_KEY;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test/:query', function(req, res, next) {
  var options = {
    url: 'https://api.propublica.org/congress/v1/bills/search.json?query=' + req.params.query,
    headers: {
      'X-API-Key': api_key
    }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      // for (var i = 0; i < data.results[0].bills.length; i++) {
      //     console.log(data.results[0].bills[i].bill_id);
      // };
      var bills =  data.results[0].bills;
      res.render('test', {data: bills});
    }
  }

  request(options, callback);

});

module.exports = router;
