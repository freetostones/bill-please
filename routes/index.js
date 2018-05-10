var express = require('express');
var router = express.Router();
var request = require('request');

var api_key = process.env.PROPUBLICA_API_KEY;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search', function(req, res, next) {
  var options = {
    url: 'https://api.propublica.org/congress/v1/bills/search.json?query=' + req.params.query,
    headers: {
      'X-API-Key': api_key
    }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      var bills =  data.results[0].bills;
      res.render('search', {data: bills});
    }
  }

  request(options, callback);

});

module.exports = router;
