exports.name = 'Elasticsearch';
exports.pattern = '/:id/:dataset';
exports.controller = require('./controller');
exports.routes = require('./routes');
exports.model = require('./models/Elasticsearch.js');  
