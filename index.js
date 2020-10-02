var express = require('express');
var app = express();
var zomato = require('zomato');
const { query } = require('express');
var port = 3080;

app.use(express.json());
var client = zomato.createClient({
    userKey: '779406b9df12f077e0da1ff4556c4200'
});



app.get('/Categories', function(req, res){
    client.getCategories(null, function(err, result){
        if(!err){
            result = JSON.parse(result);
            res.send(result);
        }else {
          console.log(err);
        }
    });

});


app.post('/location',function(req , res){
    client.getLocations({
        count : "2",
        query : req.body.Search
    },function(err , result){
        if (err){
            res.send(err);
        }
        else{
            var result = JSON.parse(result);
            for (var i of result.location_suggestions){
                    var lat = i.latitude;
                    var lon = i.longitude;
                    res.redirect("/"+lat+"/"+lon);
                    break;
            }
        }
    });
});


app.get('/:lat/:lon',function(req, res){
    client.getGeocode({
        lat:req.params.lat,
        lon:req.params.lon
        }, function(err, result){
            if(!err){
                var result = JSON.parse(result);
                var Details = [];
                for(var i of result.nearby_restaurants){
                    var restrau = {};
                    var k = i.restaurant;
                    var name = k.name;
                    var address = k.location.address;
                    var cuisines = k.cuisines;
                    var average_cost_for_two = k.average_cost_for_two;
                    var price_range = k.price_range;
                    var url = k.url;
                    var online_delivery = k.has_online_delivery;
                    restrau['name'] = name;
                    restrau['address'] = address;
                    restrau['cuisines'] = cuisines;
                    restrau['price_range'] = price_range;
                    restrau['online_delivery'] = online_delivery;
                    restrau['Url'] = url;
                    console.log(restrau);
                    Details.push(restrau); 
                    }
                    res.send(Details);
            }
            else {
              console.log(err);
            }
        });

});






// // });
app.listen(port);
console.log(`server started at ${port}`);