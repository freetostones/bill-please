var express = require('express');
var router = express.Router();
var request = require('request');
var sortJsonArray = require('sort-json-array');

var api_key = process.env.PROPUBLICA_API_KEY;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bill, Please!', history: req.session.history });

  // if (req.session.history ) {
  //
  // }


});

router.get('/search', function(req, res, next) {
  // req.session.history.push(req.params.query);
  console.log(req.params.sortType);
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
      if (req.params.sortType == "co-sponsors") {
        var sorted_bills = sortJsonArray(bills, 'cosponsors', 'des');
      }
      else {
        var sorted_bills = bills;
      }

      res.render('search', {data: sorted_bills});
    }
  }

  request(options, callback);

});

module.exports = router;
