Reveal.addEventListener('ready', function() {
  QUnit.module('reveal-code-focus');

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

  QUnit.test('Multiple code blocks', function(assert) {
    Reveal.slide(4);
    var currentSlide = Reveal.getCurrentSlide();
    assert.strictEqual(currentSlide.id, 'multiple-code-blocks', 'Slide loaded');

    var lines = currentSlide.querySelectorAll('pre code .line');

    assert.strictEqual(currentSlide.querySelectorAll('pre code').length, 2, '2 code blocks exist')
    assert.strictEqual(lines.length, 6, 'All lines are initialised');
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 0, 'No lines are focused');

    Reveal.nextFragment();
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 1, '1 line is focused');
    assert.deepEqual(
      [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
      [lines[3]],
      '2#1 syntax works'
    );

    Reveal.nextFragment();
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 1, '1 line is focused');
    assert.deepEqual(
      [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
      [lines[5]],
      '`data-code-block` syntax works'
    );

    Reveal.nextFragment();
    assert.strictEqual(currentSlide.querySelectorAll('.fragment.current-fragment').length, 2, '2 fragments are active');
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 3, '3 lines are focused');
    assert.deepEqual(
      [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
      [lines[0], lines[1], lines[5]],
      'Focusing on lines from different code blocks works'
    );
  });

  QUnit.test('Default `data-code-focus`', function(assert) {
    var done = assert.async();

    Reveal.slide(5);
    var currentSlide = Reveal.getCurrentSlide();
    assert.strictEqual(currentSlide.id, 'default-data-code-focus', 'Slide loaded');

    var lines = currentSlide.querySelectorAll('pre code .line');

    setTimeout(function() {

      assert.strictEqual(currentSlide.querySelectorAll('pre code').length, 2, '2 code blocks exist')
      assert.strictEqual(lines.length, 6, 'All lines are initialised');
      assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 2, '2 lines are focused');
      assert.deepEqual(
        [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
        [lines[1], lines[3]],
        '2nd and 4th lines are focused'
        );

      Reveal.nextFragment();
      assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 1, '1 line is focused');
      assert.deepEqual(
        [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
        [].slice.call(lines, 1, 2),
        '2nd line is focused'
      );

      Reveal.nextFragment();
      assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 2, '2 lines are focused');
      assert.deepEqual(
        [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
        [lines[1], lines[3]],
        '2nd and 4th lines are focused'
      );

      Reveal.nextFragment();
      assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 3, '3 lines are focused');
      assert.deepEqual(
        [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
        [lines[1], lines[2], lines[5]],
        '2nd, 3rd and 6th lines are focused'
      );

      done();
    }, 1);
  });

  QUnit.test('Slide navigation', function(assert) {
    var done = assert.async();
    var currentSlide, lines;

    Reveal.slide(6);
    currentSlide = Reveal.getCurrentSlide();
    assert.strictEqual(currentSlide.id, 'slide-navigation-1', 'Slide 1 loaded');

    lines = currentSlide.querySelectorAll('pre code .line');

    assert.strictEqual(lines.length, 1, 'All lines are initialised');
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 0, 'No lines are focused');

    Reveal.nextFragment();
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 1, '1 line is focused');
    assert.deepEqual(
      [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
      [].slice.call(lines),
      '1st line is focused'
    );

    Reveal.slide(7);
    currentSlide = Reveal.getCurrentSlide();
    assert.strictEqual(currentSlide.id, 'slide-navigation-2', 'Slide 2 loaded');

    lines = currentSlide.querySelectorAll('pre code .line');

    assert.strictEqual(lines.length, 1, 'All lines are initialised');
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 0, 'No lines are focused');

    Reveal.nextFragment();
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 1, '1 line is focused');
    assert.deepEqual(
      [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
      [].slice.call(lines),
      '1st line is focused'
    );

    Reveal.prev();
    assert.strictEqual(currentSlide.querySelectorAll('.fragment.current-fragment').length, 0, 'No fragments are active');
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 0, 'No lines are focused');

    Reveal.prev();
    currentSlide = Reveal.getCurrentSlide();
    assert.strictEqual(currentSlide.id, 'slide-navigation-1', 'Slide 1 loaded');

    lines = currentSlide.querySelectorAll('pre code .line');

    assert.strictEqual(currentSlide.querySelectorAll('.fragment.current-fragment').length, 1, '1 fragment is active');
    // Run asynchronously.
    setTimeout(function() {
      assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 1, '1 line is focused');
      assert.deepEqual(
        [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
        [].slice.call(lines),
        'Focus is sustained even when slide has changed and returned to original slide'
      );

      done();
    }, 1);
  });

  QUnit.test('Fragment and slide navigation', function(assert) {
    var done = assert.async();
    var currentSlide, lines;

    Reveal.slide(8);
    currentSlide = Reveal.getCurrentSlide();
    assert.strictEqual(currentSlide.id, 'fragment-navigation-1', 'Slide 1 loaded');

    lines = currentSlide.querySelectorAll('pre code .line');

    assert.strictEqual(lines.length, 4, 'All lines are initialised');
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 0, 'No lines are focused');

    Reveal.nextFragment();
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 1, '1 line is focused');
    assert.deepEqual(
      [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
      [].slice.call(lines, 0, 1),
      '1st line is focused'
    );

    Reveal.slide(8, undefined, 3);
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 1, '1 line is focused');
    assert.deepEqual(
      [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
      [].slice.call(lines, 3),
      '4th line is focused'
    );

    Reveal.slide(8, undefined, 1);
    assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 1, '1 line is focused');
    assert.deepEqual(
      [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
      [].slice.call(lines, 1, 2),
      '2nd line is focused'
    );

    Reveal.slide(9, undefined, 3);
    currentSlide = Reveal.getCurrentSlide();
    assert.strictEqual(currentSlide.id, 'fragment-navigation-2', 'Slide 2 loaded');

    lines = currentSlide.querySelectorAll('pre code .line');

    assert.strictEqual(lines.length, 4, 'All lines are initialised');

    // Callback hell since any slide changes runs asynchronous code.
    setTimeout(function() {
      assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 1, '1 line is focused');
      assert.deepEqual(
        [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
        [].slice.call(lines, 3),
        '4th line is focused'
      );

      Reveal.slide(8, undefined, 2);
      currentSlide = Reveal.getCurrentSlide();
      assert.strictEqual(currentSlide.id, 'fragment-navigation-1', 'Slide 1 loaded');

      lines = currentSlide.querySelectorAll('pre code .line');

      setTimeout(function() {
        assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 1, '1 line is focused');
        assert.deepEqual(
          [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
          [].slice.call(lines, 2, 3),
          '3rd line is focused'
        );

        Reveal.slide(9, undefined, 1);
        currentSlide = Reveal.getCurrentSlide();
        assert.strictEqual(currentSlide.id, 'fragment-navigation-2', 'Slide 2 loaded');

        setTimeout(function() {
          lines = currentSlide.querySelectorAll('pre code .line');

          assert.strictEqual(currentSlide.querySelectorAll('pre code .line.focus').length, 1, '1 line is focused');
          assert.deepEqual(
            [].slice.call(currentSlide.querySelectorAll('pre code .line.focus')),
            [].slice.call(lines, 1, 2),
            '2nd line is focused'
          );

          done();
        }, 1);
      }, 1);
    }, 1);
  });
});

Reveal.initialize({
  // TODO: PhantomJS seems to error out when `hash` is `false`
  hash: typeof window.callPhantom == 'function',
  codeToFocus: {
    scrollToFocused: true
  }
});
