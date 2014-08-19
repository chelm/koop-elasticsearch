var request = require('request'),
  BaseModel = require('koop-server/lib/BaseModel.js');

function Elasticsearch( koop ){

  var es = {};
  es.__proto__ = BaseModel( koop );

  es.find = function( index, id, options, callback ){

    var type = 'Elasticsearch';
    var geojson = { type:'FeatureCollection', features:[] };

    if(!id || id.length == 0) {
      id = '*'
    }

    // query = {"from" : 0, "size" : 1000, 'query': {'match': { 'id': {'query': id, 'type': 'phrase'}}}};
    query = {"from" : 0, "size" : 1000};
    query["query"] = { "filtered": {
              "query": {
                  'match': { 'id': {'query': id, 'type': 'phrase'}}
              } } }

    if(options.geometry) {
      var geom = JSON.parse(options.geometry)
          extent = [[geom.xmin,geom.ymax],[geom.xmax,geom.ymin]];

      query['query']['filtered']['filter'] = {'geo_shape': {'geometry': {'shape': {
                        'type': "envelope",
                        'coordinates': extent } } } }
    }
    var url = 'http://localhost:9200/'+index+'/_search';

    request.get({url: url, body: JSON.stringify(query)}, function(e, res){
      // TODO: add error handling if invalid index - ajturner
      if( res.statusCode == 200 ) { 
          var json = JSON.parse(res.body),
              features = json.hits.hits;

          // do something; turn it into GeoJSON
          features.forEach(function(row,i){
            feature = { type: 'Feature', properties: JSON.parse(row['_source'].properties), geometry: row['_source'].geometry };
            geojson.features.push( feature );
          });
      }
      callback( null, [geojson] );

    });

  };

  return es;
};

module.exports = Elasticsearch;
