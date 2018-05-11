var express = require('express');
var router = express.Router();
var request = require('request');
var sortJsonArray = require('sort-json-array');
var datetime = require('node-datetime');

var api_key = process.env.PROPUBLICA_API_KEY;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bill, Please!', history: req.session.history });

  // if (req.session.history ) {
  //
  // }


});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about');
});

/* POST search results from home page to search route */
router.post('/submit', function(req, res, next) {
  var query = req.body.query;
  var sortType = req.body.sortType;
  res.redirect('/search/' + sortType + "/" + query);
});

/* Search for related bills and return list */
router.get('/search/:sortType/:query', function(req, res, next) {
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
      // else if (req.params.sortType == "recent-action") {
      //   var past =  bills.latest_major_action_date+ ' 00:00:00';
      // }
      else {
        var sorted_bills = bills;
      }

      res.render('search', {data: sorted_bills});
    }
  }

  request(options, callback);

});

module.exports = router;
