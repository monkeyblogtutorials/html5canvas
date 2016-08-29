var concat = require('concat-files'),
    path = require('path'),
    fs = require('fs'),
    getGitBranchName = require('git-branch-name');

var readDir = function(dir) {

    var result = [], fp, stat, regExp = /([^\/]+)\.js$/,
        files = fs.readdirSync(dir), matches;

    files.forEach(function(file) {
        fp = path.join(dir, file);
        stat = fs.statSync(fp);
        if(stat.isDirectory()) {
            result = result.concat(readDir(fp));
        } else {
            matches = regExp.exec(file);
            result.push(path.resolve(fp));
        }
    });

    return result;
};

var gameFiles = readDir('./src'),
    templateString = fs.readFileSync(path.resolve(__dirname, 'template.html'), { encoding: 'utf-8' });

getGitBranchName(path.resolve(__dirname), function(err, branchName) {

    var dest = path.resolve(__dirname, 'dist'),
        stat = fs.statSync(dest);
    if(!stat.isDirectory()) {
        fs.mkdir(dest, function(err) {
            if(err) {
                console.log(err);
            }
        });
    }

    // create dist/tutorial*.js
    var destFile = path.resolve(dest, branchName + '.js');
    concat(gameFiles, destFile, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log('server.js: SUCCESS - created file: ' + destFile);
        }
    });

    // create dist/tutorial*.html
    var destFileHtml = path.resolve(dest, branchName + '.html');
    fs.writeFileSync(destFileHtml, templateString.replace('{filename}', branchName + '.js'));
    console.log('server.js: SUCCESS - created file: ' + destFileHtml);
});