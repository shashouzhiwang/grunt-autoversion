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

  grunt.registerMultiTask('autoversion', 'The best Grunt plugin ever.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options();
    var version_file = './rev_version.json';

    if (!grunt.file.exists(version_file)) {
        var content = getTime();
        versionFormat(content);
        grunt.file.write(version_file, JSON.stringify(content));
    }
    else
    {
      var version = getTime();
      version.series = grunt.file.readJSON(version_file).series;
      version.series = pad(parseInt(version.series),version.series.length); 
      versionFormat(version);
      grunt.file.write(version_file, JSON.stringify(version));
    }
    var dest_file_name = [];

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      console.log(typeof(f.src));
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
      var reg =eval("/"+options.replaceVal+"/g");
      element = element.replace(reg,grunt.file.readJSON(version_file).version);
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
  function getTime(){
    var cur_version = new Date();
    return {
      "year":cur_version.getFullYear(),
      "month":cur_version.getMonth()+1,
      "day": cur_version.getDate(),
      "hour": cur_version.getHours(),
      "minutes": cur_version.getMinutes(),
      "series":"000000"
    };
  }
  function versionFormat(content){
    var split = '.';
    return content["version"] = content.year + split + content.month+''+content.day+split+content.series;
  }

};


