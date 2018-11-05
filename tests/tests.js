Reveal.addEventListener('ready', function() {
  QUnit.module('reveal-code-focus');

  QUnit.test('API', function(assert) {
    assert.ok(window.RevealCodeFocus, 'RevealCodeFocus exists');
    assert.equal(typeof window.RevealCodeFocus, 'function', 'RevealCodeFocus is a function');
  });

  QUnit.test('DOM', function(assert) {
    Reveal.slide(0);
    var currentSlide = Reveal.getCurrentSlide();
    assert.strictEqual(currentSlide.id, 'dom', 'Slide loaded');

    assert.strictEqual(currentSlide.querySelectorAll('pre code .line').length, 3, 'All lines are initialised');
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 0, 'No lines are focused');

    var text = '// abc// def// ghi';
    assert.strictEqual(currentSlide.querySelector('pre code').textContent, text, 'Text content matches');
    assert.ok(/\bhljs\b/.test(currentSlide.querySelector('pre code').className), 'Code has been highlighted');

    var lines = currentSlide.querySelectorAll('pre code .line');

    Reveal.nextFragment();
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 1, '1 line is focused');
    assert.strictEqual(currentSlide.querySelector('pre code .line.focus'), lines[0], '1st line is focused');

    Reveal.nextFragment();
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 2, '2 lines are focused');
    assert.deepEqual(
      [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
      [].slice.call(lines, 0, 2),
      '1st 2 lines are focused'
    );

    assert.strictEqual(lines.length, 3, 'Ensure that last line of code is wrapped in a span tag (#18)');
    Reveal.nextFragment();
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 1, '1 line is focused');
    assert.deepEqual(currentSlide.querySelector('pre code .line.focus'), lines[2], 'Last line is focused');
  });

  QUnit.test('ensure correct behaviour for newlines', function(assert) {
    Reveal.slide(1);
    var currentSlide = Reveal.getCurrentSlide();
    assert.strictEqual(currentSlide.id, 'newlines', 'Slide loaded');

    var text = '// abc// def// ghi' + String.fromCharCode(160, 160);
    assert.strictEqual(currentSlide.querySelector('pre code').textContent, text, 'textContent matches');

    var lines = currentSlide.querySelectorAll('pre code .line');
    assert.strictEqual(lines.length, 5, 'All lines are initialised');
  });

  QUnit.test('data-trim', function(assert) {
    Reveal.slide(2);
    var currentSlide = Reveal.getCurrentSlide();
    assert.strictEqual(currentSlide.id, 'data-trim', 'Slide loaded');

    var text = '// abc// def// ghi';
    assert.strictEqual(currentSlide.querySelector('pre code').textContent, text, 'textContent matches');
  });

  QUnit.test('Multiple fragments', function(assert) {
    Reveal.slide(3);
    var currentSlide = Reveal.getCurrentSlide();
    assert.strictEqual(currentSlide.id, 'multiple-fragments', 'Slide loaded');

    var lines = currentSlide.querySelectorAll('pre code .line');

    assert.strictEqual(lines.length, 3, 'All lines are initialised');
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 0, 'No lines are focused');

    Reveal.nextFragment();
    assert.strictEqual(currentSlide.querySelectorAll('.fragment.current-fragment').length, 2, '2 fragments are active');
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 2, '2 lines are focused');
    assert.deepEqual(
      [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
      [lines[0], lines[2]],
      '1st and 3rd lines are focused'
    );

    Reveal.nextFragment();
    assert.strictEqual(currentSlide.querySelectorAll('.fragment.current-fragment').length, 1, '1 fragment is active');
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 2, '2 lines are focused');
    assert.deepEqual(
      [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
      [].slice.call(lines, 0, 2),
      '1st and 2nd lines are focused'
    );
  });
});

Reveal.initialize();
RevealCodeFocus();
