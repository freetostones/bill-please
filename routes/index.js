var express = require('express');
var router = express.Router();
var request = require('request');
var sortJsonArray = require('sort-json-array');
var datetime = require('node-datetime');
var hbs = require('hbs');

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
router.get('/search/:sortType/:query', function(req, res, next) {
  var sorted_bills = [];
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

      promise_list = [];
      for (i = 0; i < bills.length; i++) {
        var id =  bills[i].bill_id.slice(0,-4);
        promise_list.push(getRelatedBillsPromise(id, bills[i]));
      }

      Promise.all(promise_list).then( function(){
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

      });

    }

  }

    request(options, callback);

});

function getRelatedBillsPromise(id, billsObj) {
  return new Promise(function(resolve, reject) {
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
        var numBills =  data.results[0].related_bills.length;
        billsObj.numRelatedBills = numBills;

        // check if summary is blank
        if (billsObj.summary == ""){
          billsObj.summary = "No summary available"
        }

        // assign integer date value
        var past =  billsObj.latest_major_action_date + ' 00:00:00';
        var pastDateTime = datetime.create(past);
        var pastNow = pastDateTime.now();
        billsObj.date = pastNow;

        if (billsObj.active == true) {
          billsObj.status = "Still active";
          if (billsObj.house_passage == null) {
            billsObj.house = "Not passed";
          } else {
            billsObj.house = "Passed on " + billsObj.house_passage;
          }

          if (billsObj.senate_passage == null) {
            billsObj.senate = "Not passed";
          } else {
            billsObj.senate = "Passed on " + billsObj.senate_passage;
          }
        }
        else {
          billsObj.status = "No longer active";
          if (billsObj.house_passage == null) {
            billsObj.house = "Not passed";
          } else {
            billsObj.house = "Passed on " + billsObj.house_passage;
          }

          if (billsObj.senate_passage == null) {
            billsObj.senate = "Not passed";
          } else {
            billsObj.senate = "Passed on " + billsObj.senate_passage;
          }
        }
        resolve("Good job");
      }
      else {
        reject(Error("It broke"))
      }
    }
    request(options, callback);
  })

} 

module.exports = router;
