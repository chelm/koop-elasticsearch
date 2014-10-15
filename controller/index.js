var crypto = require('crypto'),
  BaseController = require('koop-server/lib/BaseController.js'),  
  fs = require('fs');

var Controller = function( Elasticsearch ){

  var controller = {};
  controller.__proto__ = BaseController();

  // general helper for not found repos
  controller.notFound = function(req, res){
    res.send('A useful error for missing data', 404);
  };
  
  // general helper for error'd requests
  controller.Error = function(req, res){
    res.send('Another useful error', 500);
  };
  
  
  // 
  controller.get = function(req, res){
      var key = ['Elasticsearch'];
      Elasticsearch.find(req.params.id, req.params.dataset, req.query, function(err, data){
        if (err){
          res.send(err, 500);
        } else {
          res.json( data );
        }
      });
  };
  
  controller.featureservice = function(req, res){
      var callback = req.query.callback, self = this;
      delete req.query.callback;
  
      Elasticsearch.find(req.params.id, req.params.dataset, req.query, function(err, data){
        if (err) {
          res.send(err, 500);
        } else {
          delete req.query.geometry;
          controller.processFeatureServer( req, res, err, data, callback);
        }
      });
  };
  
  controller.preview = function(req, res){
      res.render(__dirname + '/../views/index', { locals:{ id: req.params.id, dataset: req.params.dataset } });
  };

  return controller;

};

module.exports = Controller;

