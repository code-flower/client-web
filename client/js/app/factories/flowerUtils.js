/* global angular */
'use strict';

angular.module('CodeFlower')
.factory('flowerUtils', function() {

  //// PRIVATE ////

  function getColor(total, index, colorScheme) {
    switch(colorScheme) {
      case 'rainbow':
        var hue = Math.round(360 * index / total);
        return `hsl(${hue}, 90%, 70%)`;
      case 'cyanara':
        var hue = 170 + Math.round(190 * index / total);
        return `hsl(${hue}, 100%, 50%)`;
    }
  }

  //// THE SERVICE ////

  var service = {

    // returns an array of all the paths
    // in the given repo
    getFolderPaths: function(repo) {
      var folderPaths = [];

      // generate path strings
      (function recurse(folder, folderPath) {
        if (folder.children) {
          folderPath += folder.name + '/';
          folderPaths.push(folderPath);
          for (var i = 0; i < folder.children.length; i++)
            recurse(folder.children[i], folderPath);
        }
      })(repo, '');

      // remove the trailing slashes
      folderPaths = folderPaths.map(function(str) { return str.slice(0, -1); });

      return folderPaths;
    },

    // return the portion of a repo object
    // indicated by the given folderPath
    getFolder: function(repo, folderPath) {
      var folder = repo;
      var props = folderPath.split('/');
      for (var i = 1; i < props.length; i++)  {
        for (var j = 0; j < folder.children.length; j++) {
          if (folder.children[j].name === props[i]) {
            folder = folder.children[j];
            break;
          }
        }
      }
      return folder;
    },

    // get an array for all of the languages
    // in the given folder
    getLanguages: function(folder) {
      var languagesObj = {};

      // traverse the given folder and calculate
      // the file and line folders
      (function recurse(node) {

        if (node.language) {
          var lang = node.language;

          if (!languagesObj[lang]) 
            languagesObj[lang] = {
              files: 0,
              lines: 0
            };

          languagesObj[lang].files++;
          languagesObj[lang].lines += node.size;
        }

        if (node.children) 
          node.children.forEach(recurse);

      })(folder);

      // convert the obj to an array
      var languagesArr = [];
      Object.keys(languagesObj).forEach(function(langName) {
        languagesObj[langName].language = langName;
        languagesArr.push(languagesObj[langName]);
      });

      return languagesArr;
    },

    // NOTE: this modifies the languages array
    setLanguageColors: function(languages, colorScheme) {
      var total = languages.length;
      languages.forEach(function(lang, index) {
        lang.color = getColor(total, index, colorScheme);
      });
    },

    // NOTE: this modifies the languages array
    sortLanguages: function(languages, sortParams) {
      var prop = sortParams.sortCol;
      var sortFactor = sortParams.sortDesc ? 1 : -1;
      languages.sort(function (a, b) {
        return sortFactor * (b[prop] > a[prop] ? 1 : -1);
      });
    },

    // NOTE: this modifies the json object
    applyLanguageColorsToJson: function(json, languages) {
      // set up an object of language colors
      var languageColors = {};
      languages.forEach(function(lang) {
        languageColors[lang.language] = lang.color;
      });

      // apply colors to nodes
      (function recurse(node) {

        node.languageColor = node.language ?
                             languageColors[node.language] : 
                             '#ededed';
        if (node.children) 
          node.children.forEach(recurse);
        
      })(json);
    }

  };

  return service;

});