# reveal-code-focus

A [Reveal.js](https://github.com/hakimel/reveal.js) plugin that allows focusing
on specific lines of code blocks.

## Installation

Using [npm](https://www.npmjs.com/):

```bash
npm install --save reveal-code-focus
```

## Usage

`reveal-code-focus` works by associating the lines to focus on in the code block with fragments.
When the fragments are displayed, `reveal-code-focus` will focus on these lines.
Each line in a code block (`<pre><code>`) will have a class of `"line"`.
When lines are focused on, they will also gain the class of `"focus"`.

```html
<!-- This section is a slide. -->
<section>

  <!-- This will be highlighted by highlight.js. -->
  <pre><code>
  // Useless comment.
  alert('hi');
  </pre></code>

  <!-- Focuses on the first line. -->
  <span class="fragment" data-code-focus="1">This focuses on a comment.</span>

  <!-- Empty fragment: lines will be focused without content appearing. -->
  <span class="fragment" data-code-focus="1-2"></span>

</section>
```

## Author

| [![twitter/demoneaux](http://gravatar.com/avatar/029b19dba521584d83398ada3ecf6131?s=70)](https://twitter.com/demoneaux "Follow @demoneaux on Twitter") |
|---|
| [Benjamin Tan](http://d10.github.io/) |
