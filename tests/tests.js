Reveal.addEventListener('ready', function() {
  QUnit.module('reveal-code-focus');

  QUnit.test('API', function(assert) {
    assert.ok(window.RevealCodeFocus, 'RevealCodeFocus exists');
    assert.equal(typeof window.RevealCodeFocus, 'function', 'RevealCodeFocus is a function');
  });

  QUnit.test('DOM', function(assert) {
    assert.strictEqual(document.querySelectorAll('pre code .line').length, 3, 'All lines are initialised');
    assert.strictEqual(document.querySelectorAll('pre code .line.focus').length, 0, 'No lines are focused');

    var text = '// abc// def// ghi';
    assert.strictEqual(document.querySelector('pre code').textContent, text, 'Text content matches');
    assert.ok(/\bhljs\b/.test(document.querySelector('pre code').className), 'Code has been highlighted');

    var lines = document.querySelectorAll('pre code .line');

    Reveal.nextFragment();
    assert.strictEqual(document.querySelectorAll('pre code .line.focus').length, 1, '1 line is focused');
    assert.strictEqual(document.querySelector('pre code .line.focus'), lines[0], '1st line is focused');

    Reveal.nextFragment();
    assert.strictEqual(document.querySelectorAll('pre code .line.focus').length, 2, '2 lines are focused');
    assert.deepEqual([].slice.call(document.querySelectorAll('pre code .line.focus')), [].slice.call(lines, 0, 2), '1st 2 lines are focused');
  });
});

Reveal.initialize();
RevealCodeFocus();
