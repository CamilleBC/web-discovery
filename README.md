# Web-Discovery

Hi! I'm a student at **[42](http://www.42.fr/)** in Paris. Those projects are how I plan to teach myself web-development. I'll try to start with very simple projects, and gradually become more ambitious if I feel like I like it! :)


# Folders

The titles correspond to the folder in the github repository.
If you want to checkout the projects, just clone the repo and open the **.html** files. 

## [periodic_table] 
### => pure HTML5/CSS3 responsive layout.

Inspired by a project at 42, I decided to start learning HTML5 and CSS3 by creating a responsive periodic table.

The goal here was to create something that was easily resizable, using only pure HTML5 and CSS3. I heard about flexbox and css-grid, and I wanted to try them out.

What I have learned:

 - Refer by link to an open font.
 - Create a grid using **css-grid**.
 - Partition that grid using **grid-template-areas**.
 - Combine **flexbox** with **css-grid** to get a very responsive layout without much code.
 - Use builtin **transform** transitions to create nice-looking effects.
 - Use *absolute* and *relative* **positions** to set the HTML elements where I want them.
 - Use HTML **classes** to format the code and make it readable.
 - Use **z-index** to position elements along the Z axis.

## [game]
### => pure JavaScript game.

The goal of this small project is to create a small breakout game, managing splitscreen multiplayer (***TO-DO***).
I'll try to see as many concepts as I can (and need) thorough this project, in order to learn the intricacies of the language.

- Manage *user input* using the **event handler**.
- Manipulate the **DOM** using pure JavaScript.
- Manage a **2D context** in a canvas for basic drawings.
- Understanding and using ES6 patterns:
	- **class** and **extends** syntax to construct new objects
	- arrow functions
	- block-scoped variables using **let**
- Understanding the scopes in OO languages, using *this.* , *bind()* functions in class constructors for recursive calls, etc.
- Use **composition** for object creation (see *js/scope.js*)
- Understanding and using objects and prototypes in Javascript.
- Reference checks (*===*) vs value checks (*==*).
- ... ***TO-DO***

*note to self* check this:
- Getters/setters in classes.
- Need to understand some patterns (*note to self:* look [patterns](http://loredanacirstea.github.io/es6-design-patterns/) and [ES6 features](http://es6-features.org/#NumberTypeChecking)).
- Understand details about composition, class-based inheritance, *this* scope... Check Eric Elliot articles.
- ... ***TO-DO***


_____
_____
# Testing *github* markdown pulgins
## SmartyPants

SmartyPants converts ASCII punctuation characters into "smart" typographic punctuation HTML entities. For example:

|                |ASCII                          |HTML                         |
|----------------|---------------------|-------------------|
|Single backticks|`'Isn't this fun?'`            |'Isn't this fun?'            |
|Quotes          |`"Isn't this fun?"`            |"Isn't this fun?"            |
|Dashes          |`-- is en-dash, --- is em-dash`|-- is en-dash, --- is em-dash|
