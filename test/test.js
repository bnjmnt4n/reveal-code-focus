;(function(){
  // The global root object.
  var root = (typeof global == 'object' && global) || this;

  var phantom = root.phantom,
      document = !phantom && root.document,
      body = root.document && root.document.body,
      noop = function() {},
      require = root.require || noop,
      params = phantom && require('system').args;

  // The URL of the reveal-code-focus test runner.
  var filePath = params && params.length > 1 ? params[params.length - 1] : './index.html';

  // Load QUnit and QUnit Extras.
  var QUnit = root.QUnit || (root.QUnit = require('../node_modules/qunitjs/qunit/qunit.js'));
  var QUnitExtras = require('../node_modules/qunit-extras/qunit-extras.js');
  if (QUnitExtras) {
    QUnitExtras.runInContext(root);
  }

  // Exit early if going to run tests in a PhantomJS web page.
  if (phantom) {
    var page = require('webpage').create();

    page.onCallback = function(details) {
      var coverage = details.coverage;
      if (coverage) {
        var fs = require('fs'),
            cwd = fs.workingDirectory,
            sep = fs.separator;

        fs.write([cwd, 'coverage', 'coverage.json'].join(sep), JSON.stringify(coverage));
      }
      phantom.exit(details.failed ? 1 : 0);
    };

    page.onConsoleMessage = function(message) {
      console.log(message);
    };

    page.onInitialized = function() {
      page.evaluate(function() {
        document.addEventListener('DOMContentLoaded', function() {
          QUnit.done(function(details) {
            details.coverage = window.__coverage__;
            callPhantom(details);
          });
        });
      });
    };

    page.open(filePath, function(status) {
      if (status != 'success') {
        console.log('PhantomJS failed to load page: ' + filePath);
        phantom.exit(1);
      }
    });

    console.log('test.js invoked with file: ' + filePath);
    return;
  }

  var RevealCodeFocus = root.RevealCodeFocus || (root.RevealCodeFocus = require(filePath));
  
  QUnit.module('reveal-code-focus');
  QUnit.test('should pass', function(assert) {
    assert.expect(2);
    assert.ok(body);
    assert.ok(RevealCodeFocus);
  });

  // Depending on the version of `QUnit` call either `QUnit.start()` or `QUnit.load()`
  // when in a CLI or PhantomJS.
  if (!root.document || root.phantom) {
    QUnit.load();
  }
}());
