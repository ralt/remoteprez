remoteprez
===

Introduction
---

Demo: http://www.youtube.com/watch?v=Rl64DJ-ExoQ

A Google Chrome extension to remotely control an HTML5 presentation.

Currently, the following presentations are supported:

- [Reveal.js][1]
- [impress.js][2]
- [html5slides][3]
- [csss][4]
- [bespoke.js][5]

Download
---

Download the official extension from the [Chrome Web Store][6].

Pre-compilation
---
git clone https://github.com/Ralt/remoteprez.git
cd remoteprez
npm install
cd extension
npm install
cd ..
cd server
npm install
cd ..

Compilation
---
./browser ext & || ./browser prez &

Contributors
---

- [Florian Margaine](http://margaine.com)

License
---

MIT License.

   [1]: http://lab.hakim.se/reveal-js
   [2]: http://bartaz.github.com/impress.js
   [3]: http://html5slides.googlecode.com/svn/trunk/template/index.html
   [4]: http://leaverou.github.com/csss
   [5]: http://markdalgleish.com/projects/bespoke.js
   [6]: https://chrome.google.com/webstore/detail/jihlhdedapddcnlfiihkgbbenejjbnak

