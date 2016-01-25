/*!
 * reveal-code-focus 0.1.0
 * Copyright 2015 Benjamin Tan <https://demoneaux.github.io/>
 * Available under MIT license <https://github.com/demoneaux/reveal-code-focus/blob/master/LICENSE>
 */
window.RevealCodeFocus || (window.RevealCodeFocus = function(Reveal) {
  var currentSlide, currentFragments, prevSlideData = null;

  function forEach(array, callback) {
    var i = -1, length = array ? array.length : 0;
    while (++i < length) {
      callback(array[i]);
    }
  }

  function indexOf(array, elem) {
    var i = -1, length = array ? array.length : 0;
    while (++i < length) {
      if (array[i] === elem) {
        return i;
      }
    }
  }

  function init(e) {
    forEach(document.querySelectorAll('pre code'), function(element) {
      // Trim whitespace if the `data-trim` attribute is present.
      if (element.hasAttribute('data-trim') && typeof element.innerHTML.trim == 'function') {
        element.innerHTML = element.innerHTML.trim();
      }

      // Escape HTML unless prevented by author.
      if (!element.hasAttribute('data-noescape')) {
        element.innerHTML = element.innerHTML.replace(/</g,"&lt;").replace(/>/g,"&gt;");
      }

      // Highlight code using highlight.js.
      hljs.highlightBlock(element);

      // Split highlighted code into lines.
      element.innerHTML = 
        element.innerHTML
        .replace(/^(<[^>]+>)?/, function(_, html) {
          if (html && ~html.indexOf('hljs-comment')) {
            return html + '<span class=line>';
          } else {
            return '<span class=line>' + (html ? html : '');
          }
        })
        .replace(/\n\n/g, function() {
          return '\n&nbsp;\n';
        })
        .replace(/\n/g, '</span><span class=line>') + '</span>';
    });

    Reveal.addEventListener('slidechanged', updateCurrent);

    Reveal.addEventListener('fragmentshown', function(e) {
      highlightFragment(e.fragment);
    });

    Reveal.addEventListener('fragmenthidden', function(e) {
      var i = Array.prototype.indexOf.call(currentFragments, e.fragment);
      if (i == 0) {
        clearPreviousHighlights();
      } else {
        highlightFragment(currentFragments[i - 1]);
      }
    });

    updateCurrent(e);
  }

  function updateCurrent(e) {
    currentSlide = e.currentSlide;
    currentFragments = currentSlide.getElementsByClassName('fragment');
    clearPreviousHighlights();
    if (currentFragments.length) {
      if (prevSlideData && (prevSlideData.indexh > e.indexh || (prevSlideData.indexh == e.indexh && prevSlideData.indexv > e.indexv))) {
        while (Reveal.nextFragment()) {}
        var currentFragment = currentFragments[currentFragments.length - 1];
        currentFragment.classList.add('current-fragment');
        highlightFragment(currentFragment);
      }
    }
    prevSlideData = {
      'indexh': e.indexh,
      'indexv': e.indexv
    };
  }

  function clearPreviousHighlights() {
    forEach(currentSlide.querySelectorAll('pre code .line.focus'), function(line) {
      line.classList.remove('focus');
    });
  }

  function highlightFragment(fragment) {
    clearPreviousHighlights();
    var lines = fragment.getAttribute('data-code-focus');
    if (lines) {
      var code = currentSlide.querySelectorAll('pre code .line');
      forEach(lines.split(','), function(line) {
        lines = line.split('-');
        if (lines.length == 1) {
          code[lines[0] - 1].classList.add('focus');
        } else {
          var i = lines[0] - 1, j = lines[1];
          while (++i <= j) {
            code[i - 1].classList.add('focus');
          }
        }
      });
    }
  }

  function codeFocus() {
    if (Reveal.isReady()) {
      init({ currentSlide: Reveal.getCurrentSlide() });
    } else {
      Reveal.addEventListener('ready', function(e) {
        init(e);
      });
    }
  }

  return codeFocus;
}(Reveal));
