var fs = require('fs');
var path = require('path');

exports.index = function(req, res){
	var file = path.join(__dirname, '../results.json');
	console.log('Parsing file: ', file);
	fs.readFile(file, function(err, data){
        var strData = data.toString();
		console.log('result: ', err, 'str', strData);
		var compilationState = JSON.parse(strData)
		var keys = Object.keys(compilationState.compileResults);

		var displayData = [];
		for (var i = 0, len = keys.length, key = keys[0]; i < len; i++, key = keys[i]) {
            data = compilationState.compileResults[key];
            key = path.join(path.basename(path.dirname(key)), path.basename(key));
			displayData.push({
                error: data.exitCode !== 0, 
                file: key, 
                stdout: data.out.join(''), 
                stderr: data.error.join(''), 
                exitCode: data.exitCode,
                url: "https://github.com/borisyankov/DefinitelyTyped/blob/master/" + key.replace('\\', '/')
            });
		};

        var startTime = new Date(compilationState.compileStart);
        var endTime = new Date(compilationState.compileEnd);

  		res.render('index', { 
            data: displayData, 
            lastCommit: compilationState.lastCommit, 
            updatedAt: new Date(compilationState.lastGitHubUpdate).toLocaleString(),
            compileStart: startTime.toLocaleString(),
            compileTime: (endTime.getTime() - startTime.getTime()) / 1000.0
        });
	})
};