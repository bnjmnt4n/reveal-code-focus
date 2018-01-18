# reveal-code-focus

A [Reveal.js](https://github.com/hakimel/reveal.js) plugin that allows focusing on specific lines of code blocks.

[View the live demo.](https://bnjmnt4n.github.io/reveal-code-focus/)

## Installation

Using [npm](https://www.npmjs.com/):

```bash
$ npm install --save reveal-code-focus
```

## Dependencies

`reveal-code-focus` must first be loaded along with [highlight.js](https://highlightjs.org/) (used for code highlighting).

```js
Reveal.initialize({
  // Include other options…
  dependencies: [
    // Include other dependencies…
    // Load highlight.js
    { src: 'path/to/highlight.pack.js' },
    {
      src: 'node_modules/reveal-code-focus/reveal-code-focus.js',
      async: true,
      callback: function() {
        RevealCodeFocus();
      }
    }
  ]
});
```

*Note:* the `highlight.js` file mentioned is not the [Reveal.js plugin](https://github.com/hakimel/reveal.js/blob/master/plugin/highlight/highlight.js), but the actual [highlight.js library](https://highlightjs.org/).

## How it works

`reveal-code-focus` breaks down code blocks into individual lines. Fragments with the attribute `data-code-focus` are then associated with the lines of code to focus on. When these fragments are displayed, `reveal-code-focus` will focus on the respective lines of code.

Each line of code is wrapped in a `<span>` element with a class of `"line"`. When lines are focused on, they will also have the `"focus"` class. The `.line.focus` selector can thus be used for custom styling to highlight particular lines.

## Usage

```html
<section>
  <pre><code>
  // Useless comment.
  alert('hi');
  </pre></code>
  <p class="fragment" data-code-focus="1">
    When this fragment is shown, the first line of code (`span.line`) will have the `"focus"` class added to it.
  </p>
  <p class="fragment" data-code-focus="1-2">
    Another fragment. This time, both lines will now have the `"focus"` class.
  </p>
</section>
```

## Styling

The most important style is to ensure that `.line` is set to `display: block`, so that lines will be rendered as block elements. You can then customize your CSS to set a different background or text colour when lines are focused on.

```css
.line { display: block; }
.line.focus { background: yellow; }
```

You can also use a specific theme by default then switch to a different one when lines are focused on.

```css
/* use a specific highlight.js theme by default */
/* eg. solarized dark */
/* … */

.line { display: block; }
/* on focused: switch to solarized light */
.line.focus { background: #fdf6e3; color: #657b83; }
.line.focus .hljs-comment, .line.focus .hljs-quote { color: #93a1a1; }
/* … */
```

## Configuration

`reveal-code-focus` can be configured by passing in an `options` object.

```js
// Configure `reveal-code-focus`.
RevealCodeFocus({
  // options
});
```

### `scrollToFocused`

`scrollToFocused` automatically scrolls the `<code>` elements such that the lines of code to be focused on is centered. This is enabled by default.


```js
RevealCodeFocus({
  scrollToFocused: false // default: true
});
```

### Multiple code blocks

For slides with multiple code blocks, the `data-code-block` attribute can be used to focus on lines from a particular code block. By default, all fragments will focus on the first code block, unless otherwise specified.

```html
<span class="fragment"
  data-code-focus="1-5"
  data-code-block="2">
</span>
```

### `data-trim`

The `data-trim` attribute can be used to indicate that code blocks should have whitespace trimmed from their front and back.


```html
<pre><code data-trim>

.line { display: block; }
.line.focus { background: yellow; }

</code></pre>
```

## Demo

[View the live demo.](https://bnjmnt4n.github.io/reveal-code-focus/)

