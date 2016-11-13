/*
 * grunt-auto-version-plugin
 * https://github.com/Loki.Luo/grunt-version-plugin
 *
 * Copyright (c) 2016 loki.luo
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('auto_version_plugin', 'The best Grunt plugin ever.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
  
    var options = this.options();
    // var options = this.options({
    //   punctuation: '.',
    //   separator: ', '
    // });
//console.log(JSON.stringify(this.files));
//[{"src":["test/fixtures/testing","test/fixtures/123"],"dest":"tmp/custom_options","orig":{"src":["test/fixtures/testing","test/fixtures/123"],"dest":"tmp/custom_options"}}]

    var version_file = './rev_version.json';
    var cur_version = new Date();
    if (!grunt.file.exists(version_file)) {
      var content = {
        "year":cur_version.getFullYear(),
        "month":cur_version.getMonth()+1,
        "day": cur_version.getDate(),
        "hour": cur_version.getHours(),
        "minutes": cur_version.getMinutes(),
        "series":"000000",
        };
        versionFormat(content);
        grunt.file.write(version_file, JSON.stringify(content));
    }
    else
    {
      var version = grunt.file.readJSON(version_file);
      version.series = pad(parseInt(version.series),version.series.length); 
      versionFormat(version);
      grunt.file.write(version_file, JSON.stringify(version));
    }
    var dest_file_name = [];

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      console.log(typeof(f.src));
      //var file_name = f.src.substring(f.src.lastIndexOf('/'));
      //fconsole.log(file_name);

      var src = f.src.filter(function(filepath) { 
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        dest_file_name.push(filepath.substring(filepath.lastIndexOf('/')));
        // Read file source.
        return grunt.file.read(filepath);
      }).forEach(function(element,index){

      element = element.replace(options.replaceVal,grunt.file.readJSON(version_file).version);
      // Write the destination file.
      grunt.file.write(f.dest[index] + dest_file_name[index], element);
      // Print a success message.
      grunt.log.writeln('File "' + f.dest[index] + dest_file_name[index] + '" created.');
    });

    });
  });


  function pad(num, n) {
    ++ num;
    var i = (num + "").length;
    while(i++ < n){
       num = "0" + num;
    }
    return num;
  }
  function versionFormat(content){
    var split = '.';
    return content["version"] = content.year + split + content.month+''+content.day+''+content.hour+''+content.minutes+split+content.series;
  }

};


