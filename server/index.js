var express = require('express'),
    app = express(),
    fs = require('fs'),
    request = require('request'),
    port = process.env.PORT || 9001;

var serveOptions = {
    dotfiles: 'ignore',
    etag: true,
    extensions: ['htm', 'html', 'json', 'txt'],
    index: 'index.html',
    maxAge: '1d',
    redirect: false
};

function CORS(req, res, next) {
    //CORS!
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'accept, content-type');
    next();
}

//data

var restaurants = null;
var reviews = null;
var reviewers = null;

var _reviewSorter = function(a,b) {
    if(a.timestamp == b.timestamp) {return 0;}
    return a.timestamp > b.timestamp?1:-1;
}

function restaurantReviews(restId) {
    return reviews
            .filter(function(review) { return review.restaurantId == restId; })
            .sort(_reviewSorter);
}
function reviewerReviews(reviewerId) {
    return reviews
            .filter(function(review) { return review.reviewerId == reviewerId; })
            .sort(_reviewSorter);
}
function restaurantAvg(restId) {
    var rvs = restaurantReviews(restId);
    if(!rvs.length) {return 0;}
    return rvs
            .map(function(review) { return review.stars; })
            .reduce(function(a, b) { return a + b; }) / rvs.length;
}
function getRestaurant(restId){
    return restaurants.find(function(rest) { return res.params.restId === rest.id ; });
}
//load stuff

fs.readFileSync(__dirname + 'data/reviews', 'utf8', function(d) {
    reviews = JSON.parse(d);
    console.log('reviews fetched');
});
fs.readFileSync(__dirname + 'data/customers', 'utf8', function(d) {
    reviewers = JSON.parse(d);
    reviewers.forEach(function(rev) {
        rev.reviewsNum = reviewerReviews(rev.id).length;
    });
    console.log('reviewers fetched');
});
fs.readFileSync(__dirname + 'data/restaurants', 'utf8', function(d) {
    restaurants = JSON.parse(d);
    restaurants.forEach(function(rest) {
        rest.average = restaurantAvg(rest.id);
        rest.reviewsNum = restaurantReviews(rest.id).length;
    });

    console.log('restaurants fetched');
});
//----------

app.use('/images', CORS, express.static(__dirname + '/images', serveOptions));
app.use('/bower_components',express.static(__dirname + '/../bower_components', serveOptions));
app.use('/', express.static(__dirname, serveOptions));



app.get('/api/restaurants', CORS,
function(req, res, next){
    res.json(restaurants);
});

app.get('/api/restaurant/:restId', CORS,
function(req, res, next)
    var data = {
        restaurant: getRestaurant(res.params.restId),
        reviews: restaurantReviews(res.params.restId)
    };

    res.json(data);
});

app.get('/api/reviewer/:reviewerId', CORS,
function(req, res, next)
    var data = {
        reviewer: reviewers.find(function(r) { return res.params.reviewerId === r.id ; }),
        reviews: reviewerReviews(res.params.reviewerId)
    };

    res.json(data);
});

app.post('/api/reviews/:restId', CORS,
function(req, res, next)

});


app.get('/updates/:agency', CORS,
function(req, res, next){
    var agency = req.params.agency || 'caltrain';
    var requestSettings = {
        method: 'GET',
        url: 'https://api.511.org/transit/TripUpdates?format=json&agency='+agency+'&api_key=' + api511key,
        encoding: null
    };

    request(requestSettings, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var feed = GtfsRealtimeBindings.FeedMessage.decode(body),
                respObject = {
                    agency: agency,
                    updates: [],
                    source: feed
                };
            feed.entity.forEach(function(entity) {
                if (entity.trip_update) {
                    var respEntry = {
                        vehicle: entity.trip_update.vehicle.id,
                        tripId: entity.trip_update.trip.trip_id,
                        stops:{}
                    };
                    if(entity.trip_update.stop_time_update){
                        entity.trip_update.stop_time_update.forEach(function(update) {
                            var updateEntry = {
                                stopId: update.stop_id,
                                arrival: update.arrival && update.arrival.time ? (update.arrival.time.low || update.arrival.time.high) : null,
                                departure: update.departure && update.departure.time ? (update.departure.time.low || update.departure.time.high) : null
                            };
                            respEntry.stops[update.stop_id] = updateEntry;
                        });
                    }
                    respObject.updates.push(respEntry);
                    //console.log(entity.trip_update);
                }
            });
            res.json(respObject);
        }else{
            res.json([]);
        }
    });

});

app.listen(port);
