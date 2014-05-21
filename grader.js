#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var restler = require('restler');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFUALT = "http://www.google.com";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile).toString());
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    // console.log("clone: " + fn);
    return fn.bind({});
}

var print_url = function(url){
  console.log(url.toString());
}

// downloads main page from URL, saves it as tmp.html
var getHTMLfromURL = function(url){
  restler.get(url).on('complete', function(response){
    // console.log(response);
    fs.writeFileSync("tmp.html", response);
  });
}

if(require.main == module) {
  
  program  
    .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
    .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
    .option('-u, --url <url>', 'Input URL')
    .parse(process.argv);

    // console.log("File: " + program.file);
    // console.log("Checks: " + program.checks);
    // console.log("URL: " + program.url);


    if (!program.url){

      console.log("Just checking HTML file and JSON file");
      var checkJson = checkHtmlFile(program.file, program.checks);
      var outJson = JSON.stringify(checkJson, null, 4);
      console.log(outJson);
    }

    else if (program.url){
      console.log("You gave me the URL: " + program.url);
      console.log("I will ignore the file");
      // console.log(program.url);

      getHTMLfromURL(program.url);
      var checkJson = checkHtmlFile("tmp.html", program.checks);
      var outJson = JSON.stringify(checkJson, null, 4);
      console.log(outJson);


    }

    // else{
    //   console.log("AAAAAA");
    // }
  
} 
else {
    console.log("a");
    exports.checkHtmlFile = checkHtmlFile;
}
