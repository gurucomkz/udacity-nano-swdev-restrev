var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    request = require('request'),

    app = express(),
    port = process.env.PORT || 9001,
    myURL = 'http://localhost:'+port;

var serveOptions = {
    dotfiles: 'ignore',
    etag: true,
    extensions: ['htm', 'html', 'json', 'txt', 'jpg', 'png'],
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

function _getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function restaurantReviews(restId) {
    restId = parseInt(restId);
    return reviews
            .filter(function(review) { return review.restaurantId == restId; })
            .map(function(review) {
                review.reviewer = getReviewer(review.reviewerId);
                return review;
            })
            .sort(_reviewSorter);
}
function reviewerReviews(reviewerId) {
    reviewerId = parseInt(reviewerId);
    return reviews
            .filter(function(review) { return review.reviewerId == reviewerId; })
            .sort(_reviewSorter);
}
function restaurantAvg(restId) {
    var rvs = restaurantReviews(restId);
    if(!rvs.length) {return 0;}
    var avg = rvs
            .map(function(review) { return review.stars; })
            .reduce(function(a, b) { return a + b; }) / rvs.length;
    return Math.floor(avg);
}
function getRestaurant(restId){
    restId = parseInt(restId);
    return restaurants.find(function(rest) { return restId === rest.id ; });
}
function getReviewer(revId){
    revId = parseInt(revId);
    return reviewers.find(function(rev) { return revId === rev.id ; });
}
//load stuff

function loadReviews() {
    return new Promise(function(resolve, reject) {
        fs.readFile(__dirname + '/data/reviews.json', 'utf8', function(err, d) {
            reviews = JSON.parse(d);
            console.log('reviews fetched');
            resolve();
        });
    });
}

function loadReviewers() {
    return new Promise(function(resolve, reject) {
        fs.readFile(__dirname + '/data/customers.json', 'utf8', function(err, d) {
            reviewers = JSON.parse(d);
            reviewers.forEach(function(rev) {
                rev.avatar = myURL + rev.avatar;
                rev.reviewsNum = reviewerReviews(rev.id).length;
            });
            console.log('reviewers fetched');
            resolve();
        });
    });
}

function loadRestaurants() {
    return new Promise(function(resolve, reject) {
        fs.readFile(__dirname + '/data/restaurants.json', 'utf8', function(err, d) {
            restaurants = JSON.parse(d);
            restaurants.forEach(function(rest) {
                rest.image = myURL + rest.image;
                rest.average = restaurantAvg(rest.id);
                rest.reviewsNum = restaurantReviews(rest.id).length;
            });

            console.log('restaurants fetched');
            resolve();
        });
    });
}

loadReviews().then(loadReviewers).then(loadRestaurants);


//----------

app.use('/images', express.static(__dirname + '/images', serveOptions));
app.use('/bower_components',express.static(__dirname + '/../bower_components', serveOptions));
app.use('/', express.static(__dirname, serveOptions));



app.get('/api/restaurants', CORS,
function(req, res, next){
    res.json(restaurants);
});

app.get('/api/restaurant/:restId', CORS,
function(req, res, next){
    var data = {
        restaurant: getRestaurant(req.params.restId),
        reviews: restaurantReviews(req.params.restId)
    };

    res.json(data);
});

app.get('/api/reviewer/:reviewerId', CORS,
function(req, res, next){
    var data = {
        reviewer: reviewers.find(function(r) { return req.params.reviewerId === r.id ; }),
        reviews: reviewerReviews(req.params.reviewerId)
    };

    res.json(data);
});

app.post('/api/reviews/:restId', CORS, bodyParser.json(),
function(req, res, next){
    var now = Math.floor((new Date()).getTime()/1000);

});

app.put('/api/reviewers', CORS, bodyParser.json(),
function(req, res, next){
    var now = Math.floor((new Date()).getTime()/1000),
        newId = reviewers.reduce(function(a,b){ return Math.max(a.id, b.id);}) + 1,
        newAva = ["/images/avatars/", _getRandomIntInclusive(1,9) ,".png"].join('');

    var newReviewer = {
        "id": newId,
        "name": req.body.name,
        "email": req.body.email,
        "joined": now,
        "avatar": newAva
    };

    res.json(newReviewer);
});

app.listen(port);
