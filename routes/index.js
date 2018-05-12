var express = require('express');
var router = express.Router();
var request = require('request');
var sortJsonArray = require('sort-json-array');
var datetime = require('node-datetime');
var hbs = require('hbs');
var asyncHandler = require('express-async-handler');

var api_key = process.env.PROPUBLICA_API_KEY;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bill, Please!', history: req.session.history });
  if (req.session.history == undefined ) {
    req.session.history = [];
  }
});

/* GET redirect if undefined */
router.get('/search/undefined', function(req, res, next) {
  res.redirect('/');
});

router.get('/search/Co-Sponsors', function(req, res, next) {
  res.redirect('/');
});

router.get('/search/Recent-Action', function(req, res, next) {
  res.redirect('/');
});

router.get('/search/Related-Bills', function(req, res, next) {
  res.redirect('/');
});

/* POST search results from home page to search route */
router.post('/submit', function(req, res, next) {
  var query = req.body.query;
  var sortType = req.body.sortType;
  var searchItem = {'query': query, 'sortType': sortType};
  req.session.history.unshift(searchItem);
  res.redirect('/search/' + sortType + "/" + query);
});

/* Search for related bills and return list */
router.get('/search/:sortType/:query', asyncHandler( async function(req, res, next) {
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

      // check if the bill is active and if it has been passed at all
      for (i = 0; i < bills.length; i++) {

        // check if summary is blank
        if (bills[i].summary == ""){
          bills[i].summary = "No summary available"
        }
        // assign number of related bills
        var id =  bills[i].bill_id.slice(0,-4);
        var numBills = getRelatedBills(id);
        bills[i].numRelatedBills = numBills;

        // assign integer date value
        var past =  bills[i].latest_major_action_date + ' 00:00:00';
        var pastDateTime = datetime.create(past);
        var pastNow = pastDateTime.now();
        bills[i].date = pastNow;

        if (bills[i].active == true) {
          bills[i].status = "Still active";
          if (bills[i].house_passage == null) {
            bills[i].house = "Not passed";
          } else {
            bills[i].house = "Passed on " + bills[i].house_passage;
          }

          if (bills[i].senate_passage == null) {
            bills[i].senate = "Not passed";
          } else {
            bills[i].senate = "Passed on " + bills[i].senate_passage;
          }
        }
        else {
          bills[i].status = "No longer active";
          if (bills[i].house_passage == null) {
            bills[i].house = "Not passed";
          } else {
            bills[i].house = "Passed on " + bills[i].house_passage;
          }

          if (bills[i].senate_passage == null) {
            bills[i].senate = "Not passed";
          } else {
            bills[i].senate = "Passed on " + bills[i].senate_passage;
          }
        }
      }

      // sort array of bills based off of sort type parameter
      if (req.params.sortType == "Co-Sponsors") {
        var sorted_bills = sortJsonArray(bills, 'cosponsors', 'des');
      }
      else if (req.params.sortType == "Recent-Action") {
        var sorted_bills = sortJsonArray(bills, 'date', 'des');
      }
      else if (req.params.sortType == "Related-Bills") {
        var sorted_bills = sortJsonArray(bills, 'numRelatedBills', 'des');;
      }
      else {
        var sorted_bills = bills;
      }

      res.render('search', {query: req.params.query, data: sorted_bills });
    }
  }

  request(options, callback);

}));

// get number of related bills based on given id of a bill
function getRelatedBills(id) {
  var numRelatedBills = 0;
  var options = {
    url: 'https://api.propublica.org/congress/v1/115/bills/' + id + '/related.json',
    headers: {
      'X-API-Key': api_key
    }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      var numRelatedBills =  data.results[0].related_bills.length;
      return numRelatedBills;
    }
  }
  request(options, callback);
}

module.exports = router;
