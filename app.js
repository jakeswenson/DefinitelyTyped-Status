var virtualPath = '/definitelyTyped'

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('short'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ 
	src: path.join(__dirname, 'public'), 
	prefix: virtualPath
}));
app.use(virtualPath + '/iislogs', express.static(path.join(__dirname, 'iisnode')));
app.use(virtualPath, express.static(path.join(__dirname, 'public')));

// development only 
app.use(express.errorHandler());

app.get(virtualPath + '/', routes.index);

http.createServer(app)
	.listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
