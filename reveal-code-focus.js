/*!
 * reveal-code-focus v1.1.0
 * Copyright 2015-2019 Benjamin Tan <https://bnjmnt4n.now.sh/>
 * Available under MIT license <https://github.com/bnjmnt4n/reveal-code-focus/blob/master/LICENSE>
 */
;(function(window, Reveal, hljs) {
  if (typeof window.RevealCodeFocus == 'function') {
    return;
  }

  var currentSlide, currentFragmentsList, prevSlideData = null;

  // Iterates through `array`, running `callback` for each `array` element.
  function forEach(array, callback) {
    var i = -1, length = array ? array.length : 0;
    while (++i < length) {
      callback(array[i], i);
    }
  }

  var initialized = false;
  // Initialize `reveal-code-focus` by parsing code blocks and
  // attaching fragment event listeners.
  function initialize(e) {
    // Initialize code only once.
    // TODO: figure out why `initialize` is being called twice.
    if (initialized) {
      return;
    }
    initialized = true;

    parseCode();

    Reveal.addEventListener('slidechanged', updateCurrentSlide);

    Reveal.addEventListener('fragmentshown', function(e) {
      focusFragments(e.fragments);
    });

    // TODO: make this configurable.
    // When fragments are hidden, clear the current focused fragments,
    // and focus on the previous fragments.
    Reveal.addEventListener('fragmenthidden', function(e) {
      var index = e.fragment.getAttribute('data-fragment-index');
      focusFragments(currentFragmentsList[index - 1]);
    });

    updateCurrentSlide(e);
  }

  // Highlight code and transform it into individual lines.
  function parseCode() {
    // TODO: mark as parsed.
    forEach(document.querySelectorAll('pre code'), function(element) {
      // Trim whitespace if the `data-trim` attribute is present.
      if (element.hasAttribute('data-trim') && typeof element.innerHTML.trim == 'function') {
        element.innerHTML = element.innerHTML.trim();
      }

      // Highlight code using highlight.js.
      // TODO: avoid touching the element twice (when highlighting and generating lines).
      hljs.highlightBlock(element);

      // Split highlighted code into lines.
      var openTags = [];
      var reHtmlTag = /<(\/?)span(?:\s+(?:class=(['"]).*?\2)?\s*|\s*)>/g;

      // Ensure that last line ends in a newline as our line-splitting algorithm
      // requires lines to end in new lines.
      var html = element.innerHTML;
      if (html.charCodeAt(html.length - 1) != 10) {
        html += '\n';
      }

      element.innerHTML = html.replace(/(.*?)\r?\n/g, function(_, string) {
        if (!string) {
          return '<span class=line>&nbsp;</span>';
        }

        var openTag, stringPrepend;

        // Re-open all tags that were previously closed.
        if (openTags.length) {
          stringPrepend = openTags.join('');
        }

        // Match all HTML `<span>` tags.
        reHtmlTag.lastIndex = 0;
        while (openTag = reHtmlTag.exec(string)) {
          // If it is a closing tag, remove the opening tag from the list.
          if (openTag[1]) {
            openTags.pop();
          }
          // Otherwise if it is an opening tag, push it to the list.
          else {
            openTags.push(openTag[0]);
          }
        }

        // Close all opened tags, so that strings can be wrapped with `span.line`.
        if (openTags.length) {
          string += Array(openTags.length + 1).join('</span>');
        }
        if (stringPrepend) {
          string = stringPrepend + string;
        }

        return '<span class=line>' + string + '</span>';
      });
    });
  }

  function updateCurrentSlide(e) {
    currentSlide = e.currentSlide;
    currentFragmentsList = [];

    forEach(currentSlide.getElementsByClassName('fragment'), function(fragment) {
      var fragmentIndex = fragment.getAttribute('data-fragment-index');
      (
        currentFragmentsList[fragmentIndex] ||
        (currentFragmentsList[fragmentIndex] = [])
      ).push(fragment);
    });

    clearPreviousFocus();

    // If moving back to a previous slide…
    if (
      currentFragmentsList.length &&
      prevSlideData &&
      (
        prevSlideData.indexh > e.indexh ||
        (prevSlideData.indexh == e.indexh && prevSlideData.indexv > e.indexv)
      )
    ) {
      // …return to the last fragment and highlight the code.
      while (Reveal.nextFragment()) {}
      var currentFragment = currentFragmentsList[currentFragmentsList.length - 1];
      forEach(currentFragment, function(currentFragment) {
        currentFragment.classList.add('current-fragment');
      });
      focusFragments(currentFragment);
    }

    // Update previous slide information.
    prevSlideData = {
      'indexh': e.indexh,
      'indexv': e.indexv
    };
  }

  // Obtain an object mapping the code block number to the lines to focus on within that code block.
  function getLinesToFocus(linesToFocusMap, lines, codeBlock) {
    codeBlock || (codeBlock = '1');
    var codeBlocks = codeBlock.split('|');

    // Syntax for focusing on lines from multiple code blocks at the same time:
    // `data-code-focus="1#1-3|2#2"`
    // or
    // `data-code-focus="1-3|2"` and `data-code-block="1|2"` for backward compatibility
    forEach(lines.split('|'), function(lines, i) {
      var currentCodeBlock = codeBlocks[i] || '1';

      if (lines.indexOf('#') > -1) {
        var temp = lines.split('#');
        currentCodeBlock = temp[0];
        lines = temp[1];
      }

      currentCodeBlock = parseInt(currentCodeBlock);
      if (isNaN(currentCodeBlock)) {
        return;
      }

      forEach(lines.split(','), function(line) {
        var lines = line.split('-');
        if (lines.length == 1) {
          addLineToFocus(linesToFocusMap, currentCodeBlock, lines[0]);
        } else {
          var i = lines[0] - 1, j = lines[1];

          while (++i <= j) {
            addLineToFocus(linesToFocusMap, currentCodeBlock, i);
          }
        }
      });
    });
  }

  // Add a specific line to focus to the map.
  function addLineToFocus(linesToFocusMap, codeBlock, line) {
    line = parseInt(line);
    if (isNaN(line)) {
      return;
    }

    // Convert from 1-based index to 0-based index.
    line -= 1;

    var linesToFocus = linesToFocusMap[codeBlock] || (linesToFocusMap[codeBlock] = []);
    if (linesToFocus.indexOf(line) == -1) {
      linesToFocus.push(line);
    }
  }

  // Removes any previously focused lines.
  function clearPreviousFocus() {
    forEach(currentSlide.querySelectorAll('pre code .line.focus'), function(line) {
      line.classList.remove('focus');
    });
  }

  // Focus on all lines indicated in shown fragments.
  function focusFragments(fragments) {
    clearPreviousFocus();
    if (!fragments) {
      return;
    }

    var preElems = currentSlide.querySelectorAll('pre');
    if (!preElems.length) {
      return;
    }

    var linesToFocusMap = {};
    forEach(fragments, function(fragment) {
      var lines = fragment.getAttribute('data-code-focus');
      if (!lines) {
        return;
      }

      var codeBlock = fragment.getAttribute('data-code-block');

      // For each fragment displayed, consolidate a list of lines to focus on for each code block.
      getLinesToFocus(linesToFocusMap, lines, codeBlock)
    });

    for (var codeBlock in linesToFocusMap) {
      if (linesToFocusMap.hasOwnProperty(codeBlock)) {
        var linesToFocus = linesToFocusMap[codeBlock];

        // Sort line numbers to ensure that first line and last line focused on
        // are the first and last elements respectively to ensure that `scrollToFocused`
        // functionality works.
        linesToFocus.sort();

        // Convert from 1-based index to 0-based index.
        var pre = preElems[codeBlock - 1];
        if (!pre) {
          return;
        }

        var code = pre.querySelectorAll('code .line');
        if (!code.length) {
          return;
        }

        forEach(linesToFocus, function(lineNumber) {
          var line = code[lineNumber];
          if (!line) {
            return;
          }

          line.classList.add('focus');
        });

        if (Reveal.getConfig().codeFocus.scrollToFocused) {
          var topLineNumber = linesToFocus[0];
          var bottomLineNumber = linesToFocus[linesToFocus.length - 1];
          var topLine =  code[topLineNumber];
          var bottomLine = code[bottomLineNumber];
          var codeParent = topLine.parentNode;
          var scrollTop = topLine.offsetTop;
          var scrollBottom = bottomLine.offsetTop + bottomLine.clientHeight;
          codeParent.scrollTop = scrollTop - (codeParent.clientHeight - (scrollBottom - scrollTop)) / 2;
        }
      }
    }
  }

  function RevealCodeFocus() {
    var options = Reveal.getConfig().codeFocus || (Reveal.getConfig().codeFocus = {});

    // Default to `true`.
    if (options.scrollToFocused == null) {
      options.scrollToFocused = true;
    }

    if (Reveal.isReady()) {
      initialize({ 'currentSlide': Reveal.getCurrentSlide() });
    } else {
      Reveal.addEventListener('ready', initialize);
    }
  }

  Reveal.registerPlugin('codeFocus', { init: RevealCodeFocus });
}(this, this.Reveal, this.hljs));
