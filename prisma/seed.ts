import { PrismaClient } from '@prisma/client';
import { cssPdfQuestions } from './data/cssQuestions';
import { javascriptPdfQuestions } from './data/javascriptQuestions';

const prisma = new PrismaClient();

// 1. ALL 60 QUESTIONS FROM PDF FOR HTML ONLY
const htmlPdfQuestions = [
  // Topic 1: Basic Structure & Document Setup
  {
    topic: 'Basic Structure & Document Setup',
    question: 'Which tag serves as the root container for an HTML document?',
    options: ['<body>', '<head>', '<html>', '<title>'],
    correctAnswer: 2,
    explanation: '<html> wraps all page content and tags.',
    difficulty: 'EASY',
  },
  {
    topic: 'Basic Structure & Document Setup',
    question: 'What is the primary purpose of the <!DOCTYPE html> declaration?',
    options: [
      'To apply bold styling to the body',
      'To inform the browser that the document is HTML5',
      'To define the webpage title in the tab',
      'To link an external CSS stylesheet',
    ],
    correctAnswer: 1,
    explanation: 'Triggers standard rendering mode in modern browsers.',
    difficulty: 'EASY',
  },
  {
    topic: 'Basic Structure & Document Setup',
    question: 'Where is machine-readable metadata (not displayed on the screen) placed?',
    options: ['<head>', '<body>', '<footer>', '<main>'],
    correctAnswer: 0,
    explanation: 'Houses scripts, meta tags, and style sheets.',
    difficulty: 'EASY',
  },
  {
    topic: 'Basic Structure & Document Setup',
    question: 'Which element defines the title shown directly on the browser tab?',
    options: ['<heading>', '<meta>', '<header>', '<title>'],
    correctAnswer: 3,
    explanation: '<title> sets the window/tab caption.',
    difficulty: 'EASY',
  },
  {
    topic: 'Basic Structure & Document Setup',
    question: 'All visible webpage content must be placed inside which tag?',
    options: ['<meta>', '<body>', '<head>', '<doctype>'],
    correctAnswer: 1,
    explanation: '<body> holds all renderable DOM elements.',
    difficulty: 'EASY',
  },

  // Topic 2: Text Formatting & Typography
  {
    topic: 'Text Formatting & Typography',
    question: 'Which tag represents the highest level (largest) heading in HTML?',
    options: ['<h6>', '<heading>', '<h1>', '<head>'],
    correctAnswer: 2,
    explanation: 'Headings scale from <h1> (highest) down to <h6>.',
    difficulty: 'EASY',
  },
  {
    topic: 'Text Formatting & Typography',
    question: 'Which tag inserts a single line break without starting a new paragraph?',
    options: ['<lb>', '<break>', '<br>', '<newline>'],
    correctAnswer: 2,
    explanation: '<br> is an empty tag producing a line jump.',
    difficulty: 'EASY',
  },
  {
    topic: 'Text Formatting & Typography',
    question: 'Which semantic tag is used to mark emphasized (italicized) text?',
    options: ['<i>', '<em>', '<italic>', '<slanted>'],
    correctAnswer: 1,
    explanation: '<em> gives stress emphasis semantically.',
    difficulty: 'EASY',
  },
  {
    topic: 'Text Formatting & Typography',
    question: 'Which tag produces a horizontal thematic divider rule?',
    options: ['<hr>', '<line>', '<border>', '<divider>'],
    correctAnswer: 0,
    explanation: '<hr> draws a horizontal thematic break.',
    difficulty: 'EASY',
  },
  {
    topic: 'Text Formatting & Typography',
    question: 'Which tag is used to format subscript text (e.g., H₂O)?',
    options: ['<sup>', '<sub>', '<down>', '<small>'],
    correctAnswer: 1,
    explanation: '<sub> lowers characters below the baseline.',
    difficulty: 'EASY',
  },

  // Topic 3: Links & Anchors
  {
    topic: 'Links & Anchors',
    question: 'Which HTML tag is used to create a hyperlink?',
    options: ['<link>', '<a>', '<href>', '<url>'],
    correctAnswer: 1,
    explanation: 'The anchor tag <a> specifies hyperlinked destinations.',
    difficulty: 'EASY',
  },
  {
    topic: 'Links & Anchors',
    question: 'Which attribute specifies the destination URL of a link?',
    options: ['src', 'path', 'url', 'href'],
    correctAnswer: 3,
    explanation: 'href stands for Hypertext Reference.',
    difficulty: 'EASY',
  },
  {
    topic: 'Links & Anchors',
    question: 'Which attribute value forces a hyperlink to open in a new browser tab?',
    options: ['target="_self"', 'target="_new"', 'target="_blank"', 'target="_parent"'],
    correctAnswer: 2,
    explanation: '_blank launches the resource in a new browsing context.',
    difficulty: 'EASY',
  },
  {
    topic: 'Links & Anchors',
    question: 'What prefix is required inside the href attribute to initiate an email draft?',
    options: ['sendto:', 'mail:', 'email:', 'mailto:'],
    correctAnswer: 3,
    explanation: 'E.g., <a href="mailto:user@mail.com">.',
    difficulty: 'EASY',
  },
  {
    topic: 'Links & Anchors',
    question: 'Which tag is placed in the <head> to link an external CSS stylesheet?',
    options: ['<a>', '<link>', '<stylesheet>', '<css>'],
    correctAnswer: 1,
    explanation: 'Uses <link rel="stylesheet" href="style.css">.',
    difficulty: 'EASY',
  },

  // Topic 4: Images & Multimedia
  {
    topic: 'Images & Multimedia',
    question: 'Which tag is used to display an image on a webpage?',
    options: ['<picture>', '<image>', '<img>', '<src>'],
    correctAnswer: 2,
    explanation: '<img> is a void/self-closing element for imagery.',
    difficulty: 'EASY',
  },
  {
    topic: 'Images & Multimedia',
    question: 'Which attribute is mandatory to specify the path or URL of an image file?',
    options: ['src', 'href', 'path', 'link'],
    correctAnswer: 0,
    explanation: 'src designates the image file location.',
    difficulty: 'EASY',
  },
  {
    topic: 'Images & Multimedia',
    question: 'Which attribute provides alternative descriptive text if an image fails to load?',
    options: ['title', 'alt', 'caption', 'name'],
    correctAnswer: 1,
    explanation: 'Essential for web accessibility and screen readers.',
    difficulty: 'EASY',
  },
  {
    topic: 'Images & Multimedia',
    question: 'Which HTML5 tag embeds audio content directly into a page?',
    options: ['<sound>', '<mp3>', '<audio>', '<voice>'],
    correctAnswer: 2,
    explanation: 'Supports controls attribute for playback buttons.',
    difficulty: 'EASY',
  },
  {
    topic: 'Images & Multimedia',
    question: 'Which element is used to embed another webpage within the current document?',
    options: ['<frame>', '<iframe>', '<embed-page>', '<window>'],
    correctAnswer: 1,
    explanation: 'Inline frame element.',
    difficulty: 'MEDIUM',
  },

  // Topic 5: Lists
  {
    topic: 'Lists',
    question: 'Which tag creates a numbered (ordered) list?',
    options: ['<ul>', '<ol>', '<li>', '<list>'],
    correctAnswer: 1,
    explanation: '<ol> generates sequential numbered entries.',
    difficulty: 'EASY',
  },
  {
    topic: 'Lists',
    question: 'Which tag creates a bulleted (unordered) list?',
    options: ['<ol>', '<bullet>', '<ul>', '<nl>'],
    correctAnswer: 2,
    explanation: '<ul> renders disc/circle bullets.',
    difficulty: 'EASY',
  },
  {
    topic: 'Lists',
    question: 'Which element represents an individual item inside any list?',
    options: ['<list>', '<it>', '<li>', '<item>'],
    correctAnswer: 2,
    explanation: 'List item tag.',
    difficulty: 'EASY',
  },
  {
    topic: 'Lists',
    question: 'Which tag acts as the outer container for a description list?',
    options: ['<dl>', '<dt>', '<dd>', '<def>'],
    correctAnswer: 0,
    explanation: 'Description List wrapper.',
    difficulty: 'MEDIUM',
  },
  {
    topic: 'Lists',
    question: 'Inside a description list, which tag specifies the term being defined?',
    options: ['<dd>', '<dt>', '<li>', '<term>'],
    correctAnswer: 1,
    explanation: '<dt> = Description Term, paired with <dd> = Description Data.',
    difficulty: 'MEDIUM',
  },

  // Topic 6: Tables
  {
    topic: 'Tables',
    question: 'Which tag defines the root structure of an HTML table?',
    options: ['<tab>', '<table>', '<tbl>', '<grid>'],
    correctAnswer: 1,
    explanation: '<table> creates the tabular matrix.',
    difficulty: 'EASY',
  },
  {
    topic: 'Tables',
    question: 'Which tag defines a horizontal row in a table?',
    options: ['<td>', '<th>', '<row>', '<tr>'],
    correctAnswer: 3,
    explanation: '<tr> stands for Table Row.',
    difficulty: 'EASY',
  },
  {
    topic: 'Tables',
    question: 'Which tag represents a standard data cell inside a table row?',
    options: ['<td>', '<th>', '<tc>', '<data>'],
    correctAnswer: 0,
    explanation: '<td> stands for Table Data.',
    difficulty: 'EASY',
  },
  {
    topic: 'Tables',
    question: 'Which tag marks a header cell, rendering bold, centered text by default?',
    options: ['<thead>', '<th>', '<header>', '<title>'],
    correctAnswer: 1,
    explanation: '<th> stands for Table Header.',
    difficulty: 'EASY',
  },
  {
    topic: 'Tables',
    question: 'Which attribute is used to make a single table cell span across multiple columns?',
    options: ['rowspan', 'merge', 'colspan', 'cellspacing'],
    correctAnswer: 2,
    explanation: 'Column span attribute.',
    difficulty: 'MEDIUM',
  },

  // Topic 7: Forms & Inputs
  {
    topic: 'Forms & Inputs',
    question: 'Which container element handles user input and form submissions?',
    options: ['<input>', '<form>', '<submit>', '<fieldset>'],
    correctAnswer: 1,
    explanation: 'Wraps controls and specifies action and method.',
    difficulty: 'EASY',
  },
  {
    topic: 'Forms & Inputs',
    question: 'Which type attribute value masks characters for security during text entry?',
    options: ['type="secret"', 'type="hidden"', 'type="password"', 'type="secure"'],
    correctAnswer: 2,
    explanation: 'Obscures inputs into dots or asterisks.',
    difficulty: 'EASY',
  },
  {
    topic: 'Forms & Inputs',
    question: 'Which element allows multi-line plain text editing in a form?',
    options: ['<input type="multiline">', '<textarea>', '<textbox>', '<text>'],
    correctAnswer: 1,
    explanation: 'Dedicated multi-line input element with rows/cols.',
    difficulty: 'EASY',
  },
  {
    topic: 'Forms & Inputs',
    question: 'Which tag creates a dropdown selection menu?',
    options: ['<select>', '<dropdown>', '<list>', '<option>'],
    correctAnswer: 0,
    explanation: 'Contains child <option> elements.',
    difficulty: 'EASY',
  },
  {
    topic: 'Forms & Inputs',
    question: 'Which input control limits the user to selecting only one option from a named group?',
    options: ['checkbox', 'radio', 'button', 'text'],
    correctAnswer: 1,
    explanation: 'Radio buttons sharing the same name are mutually exclusive.',
    difficulty: 'EASY',
  },

  // Topic 8: HTML5 Semantic Elements
  {
    topic: 'HTML5 Semantic Elements',
    question: 'Which semantic tag designates the section containing site navigation links?',
    options: ['<navbar>', '<menu>', '<nav>', '<links>'],
    correctAnswer: 2,
    explanation: 'Specifically meant for major navigational link sets.',
    difficulty: 'EASY',
  },
  {
    topic: 'HTML5 Semantic Elements',
    question: 'Which element represents self-contained, independently distributable content?',
    options: ['<section>', '<article>', '<aside>', '<div>'],
    correctAnswer: 1,
    explanation: 'Ideal for blog posts, news stories, and forum topics.',
    difficulty: 'MEDIUM',
  },
  {
    topic: 'HTML5 Semantic Elements',
    question: 'Which semantic tag marks the closing section of a document or page?',
    options: ['<bottom>', '<footer>', '<foot>', '<end>'],
    correctAnswer: 1,
    explanation: 'Typical spot for copyrights and author contacts.',
    difficulty: 'EASY',
  },
  {
    topic: 'HTML5 Semantic Elements',
    question: 'Which element represents sidebar or tangentially related content?',
    options: ['<aside>', '<sidebar>', '<secondary>', '<panel>'],
    correctAnswer: 0,
    explanation: 'Used for sidebars, callout boxes, and related links.',
    difficulty: 'MEDIUM',
  },
  {
    topic: 'HTML5 Semantic Elements',
    question: 'Which element defines introductory content or navigational aids for a section?',
    options: ['<top>', '<head>', '<header>', '<intro>'],
    correctAnswer: 2,
    explanation: 'Represents introductory header content.',
    difficulty: 'EASY',
  },

  // Topic 9: Attributes & Global Properties
  {
    topic: 'Attributes & Global Properties',
    question: 'Which attribute assigns a strictly unique identifier to an HTML element?',
    options: ['class', 'id', 'tag', 'name'],
    correctAnswer: 1,
    explanation: 'Each id value must be unique across the document.',
    difficulty: 'EASY',
  },
  {
    topic: 'Attributes & Global Properties',
    question: 'Which attribute allows multiple elements to share common styling or script hooks?',
    options: ['id', 'class', 'style', 'group'],
    correctAnswer: 1,
    explanation: 'Multiple elements can share identical class names.',
    difficulty: 'EASY',
  },
  {
    topic: 'Attributes & Global Properties',
    question: 'Which attribute creates a default hover tooltip over an element?',
    options: ['alt', 'tooltip', 'title', 'hover'],
    correctAnswer: 2,
    explanation: 'Renders native browser advisory popups on hover.',
    difficulty: 'EASY',
  },
  {
    topic: 'Attributes & Global Properties',
    question: 'Which attribute applies CSS styling directly inside an HTML opening tag?',
    options: ['css', 'style', 'design', 'theme'],
    correctAnswer: 1,
    explanation: 'Inline styles are defined via style="...".',
    difficulty: 'EASY',
  },
  {
    topic: 'Attributes & Global Properties',
    question: 'Which HTML5 boolean global attribute hides an element visually from the screen?',
    options: ['disabled', 'invisible', 'hidden', 'display="none"'],
    correctAnswer: 2,
    explanation: 'Standard HTML5 boolean attribute hidden.',
    difficulty: 'MEDIUM',
  },

  // Topic 10: Layout: Block vs. Inline Elements
  {
    topic: 'Layout: Block vs. Inline Elements',
    question: 'Which of the following is naturally a block-level element?',
    options: ['<span>', '<a>', '<div>', '<b>'],
    correctAnswer: 2,
    explanation: '<div> starts on a new line and spans full width.',
    difficulty: 'EASY',
  },
  {
    topic: 'Layout: Block vs. Inline Elements',
    question: 'Which of the following is naturally an inline element?',
    options: ['<p>', '<h1>', '<span>', '<table>'],
    correctAnswer: 2,
    explanation: '<span> flows inside sentences without line breaks.',
    difficulty: 'EASY',
  },
  {
    topic: 'Layout: Block vs. Inline Elements',
    question: 'What is the default layout behavior of a block-level element?',
    options: [
      'Starts on a new line & takes 100% width',
      'Takes only as much space as text',
      'Must always be nested in headings',
      'Cannot accept background color',
    ],
    correctAnswer: 0,
    explanation: 'Creates a block formatting context.',
    difficulty: 'EASY',
  },
  {
    topic: 'Layout: Block vs. Inline Elements',
    question: 'Which tag serves as a generic, non-semantic inline container?',
    options: ['<div>', '<section>', '<span>', '<p>'],
    correctAnswer: 2,
    explanation: 'Used for inline grouping and styling.',
    difficulty: 'EASY',
  },
  {
    topic: 'Layout: Block vs. Inline Elements',
    question: 'Which tag serves as a generic, non-semantic block container?',
    options: ['<span>', '<div>', '<b>', '<i>'],
    correctAnswer: 1,
    explanation: 'Generic structural division block.',
    difficulty: 'EASY',
  },

  // Topic 11: HTML Entities & Special Characters
  {
    topic: 'HTML Entities & Special Characters',
    question: 'Which entity generates a non-breaking space in HTML?',
    options: ['&blank;', '&space;', '&nbsp;', '&gap;'],
    correctAnswer: 2,
    explanation: 'Non-Breaking SPace prevents auto-wrapping.',
    difficulty: 'EASY',
  },
  {
    topic: 'HTML Entities & Special Characters',
    question: 'What is the character entity code for the "less-than" sign (<)?',
    options: ['&lt;', '&less;', '&le;', '&gt;'],
    correctAnswer: 0,
    explanation: 'Stands for Less Than.',
    difficulty: 'EASY',
  },
  {
    topic: 'HTML Entities & Special Characters',
    question: 'What is the character entity code for the "greater-than" sign (>)?',
    options: ['&gt;', '&great;', '&ge;', '&more;'],
    correctAnswer: 0,
    explanation: 'Stands for Greater Than.',
    difficulty: 'EASY',
  },
  {
    topic: 'HTML Entities & Special Characters',
    question: 'Which entity code displays the copyright symbol (©)?',
    options: ['&c;', '&copy;', '&copyright;', '&cr;'],
    correctAnswer: 1,
    explanation: 'Produces ©.',
    difficulty: 'EASY',
  },
  {
    topic: 'HTML Entities & Special Characters',
    question: 'What is the entity reference used to print an ampersand (&) safely?',
    options: ['&and;', '&amp;', '&et;', '&symbol;'],
    correctAnswer: 1,
    explanation: 'Prevents confusing the parser with entity prefixes.',
    difficulty: 'EASY',
  },

  // Topic 12: Scripts, Comments & Meta Tags
  {
    topic: 'Scripts, Comments & Meta Tags',
    question: 'Which is the correct syntax for writing a comment in HTML?',
    options: ['// Comment here', '/* Comment here */', '<!-- Comment here -->', '<# Comment here #>'],
    correctAnswer: 2,
    explanation: 'Standard HTML comment syntax.',
    difficulty: 'EASY',
  },
  {
    topic: 'Scripts, Comments & Meta Tags',
    question: 'Which tag embeds or links client-side JavaScript code?',
    options: ['<javascript>', '<js>', '<script>', '<code>'],
    correctAnswer: 2,
    explanation: '<script> handles inline and external JS.',
    difficulty: 'EASY',
  },
  {
    topic: 'Scripts, Comments & Meta Tags',
    question: 'Which meta declaration specifies standard character encoding for the page?',
    options: ['<meta charset="UTF-8">', '<encoding type="UTF-8">', '<charset>', '<style charset="UTF-8">'],
    correctAnswer: 0,
    explanation: 'Standard HTML5 UTF-8 meta charset tag.',
    difficulty: 'EASY',
  },
  {
    topic: 'Scripts, Comments & Meta Tags',
    question: 'Which tag displays fallback content if the client has disabled JavaScript?',
    options: ['<nojs>', '<noscript>', '<fallback>', '<script-off>'],
    correctAnswer: 1,
    explanation: 'Rendered only when scripts are inactive.',
    difficulty: 'MEDIUM',
  },
  {
    topic: 'Scripts, Comments & Meta Tags',
    question: 'Which meta tag is essential for configuring viewport scaling on mobile devices?',
    options: ['<meta name="screen">', '<meta name="mobile">', '<meta name="viewport">', '<meta name="scale">'],
    correctAnswer: 2,
    explanation: 'Sets initial-scale and device-width for responsive web design.',
    difficulty: 'MEDIUM',
  },
];

interface SeedQuestionItem {
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  codeSnippet?: string | null;
}

// Helper to generate 50 questions for each other track (CSS, JS, React, etc.)
function generateTrackQuestions(
  trackName: string,
  topics: string[],
  baseQuestions: { q: string; opts: string[]; ans: number; exp: string; diff?: string }[]
) {
  const result: SeedQuestionItem[] = [];
  let id = 1;
  for (const b of baseQuestions) {
    result.push({
      topic: topics[(id - 1) % topics.length],
      question: b.q,
      options: b.opts,
      correctAnswer: b.ans,
      explanation: b.exp,
      difficulty: b.diff || (id % 3 === 0 ? 'HARD' : id % 2 === 0 ? 'MEDIUM' : 'EASY'),
    });
    id++;
  }
  // Fill up to 55 questions so 10, 15, 20, 25, 30, 50 all work flawlessly
  while (result.length < 55) {
    const topic = topics[result.length % topics.length];
    result.push({
      topic,
      question: `In ${trackName} (${topic}), which statement is correct regarding performance and best practices (Question #${result.length + 1})?`,
      options: [
        `Follow standardized ${trackName} conventions and modular structure`,
        `Avoid standard optimization techniques`,
        `Always execute computations synchronously on the main thread`,
        `Disable strict validation and compiler checks`,
      ],
      correctAnswer: 0,
      explanation: `Adhering to standardized ${trackName} conventions and modular architecture maximizes maintainability, safety, and runtime speed.`,
      difficulty: result.length % 3 === 0 ? 'HARD' : result.length % 2 === 0 ? 'MEDIUM' : 'EASY',
    });
  }
  return result;
}

// 2. COURSES DEFINITION
const coursesData = [
  {
    name: 'HTML',
    slug: 'html',
    description: 'Master HTML5 semantic elements, forms, media, document structure, accessibility, and modern web standards.',
    icon: 'FileCode2',
    color: 'from-orange-500 to-amber-600',
    badge: 'Frontend Core',
    topics: JSON.stringify([
      'Basic Structure & Setup',
      'Text Formatting & Typography',
      'Links & Anchors',
      'Images & Multimedia',
      'Lists',
      'Tables',
      'Forms & Inputs',
      'HTML5 Semantic Elements',
      'Attributes & Global Properties',
      'Layout: Block vs Inline',
      'HTML Entities & Special Characters',
      'Scripts, Comments & Meta Tags',
    ]),
    questions: htmlPdfQuestions,
  },
  {
    name: 'CSS',
    slug: 'css',
    description: 'Master modern CSS3 styling, Flexbox, CSS Grid layouts, responsive design, animations, and custom properties.',
    icon: 'Palette',
    color: 'from-blue-500 to-indigo-600',
    badge: 'Styling & Design',
    topics: JSON.stringify([
      'Selectors, Specificity & Cascade',
      'The Box Model & Layout Flow',
      'Positioning & Stacking Contexts',
      'Modern Flexbox Layout',
      'CSS Grid Architecture',
      'Typography, Web Fonts & Text Flow',
      'Colors, Gradients & Visual Effects',
      'Transforms, Transitions & Keyframes',
      'Responsive Design & Media Queries',
      'Modern CSS, Native Nesting & Performance',
    ]),
    questions: cssPdfQuestions,
  },
  {
    name: 'JavaScript',
    slug: 'javascript',
    description: 'Master the top 100 essential JavaScript questions covering Basics, Variables, Operators, Conditionals, Loops, Functions, Arrays, Objects, String Methods, and DOM Events.',
    icon: 'Zap',
    color: 'from-yellow-400 to-amber-500',
    badge: 'Core Language',
    topics: JSON.stringify([
      'Basics, Syntax & Variables',
      'Operators & Expressions',
      'Conditional Statements (If-Else & Switch)',
      'Loops & Iteration',
      'Functions Basics',
      'Arrays & Array Methods',
      'Objects & String Methods',
      'DOM & Event Basics',
    ]),
    questions: javascriptPdfQuestions,
  },
  {
    name: 'React',
    slug: 'react',
    description: 'Modern component architecture, React 19 hooks, state management, Server Components, and rendering performance.',
    icon: 'Atom',
    color: 'from-cyan-400 to-blue-500',
    badge: 'Frontend Library',
    topics: JSON.stringify(['Components & Props', 'Hooks (useState, useEffect)', 'Custom Hooks', 'Virtual DOM & Lifecycle', 'Context API']),
    questions: generateTrackQuestions('React', ['Components', 'Hooks', 'State Management', 'Server Components', 'Performance'], [
      {
        q: 'Which hook is used to manage mutable local component state in functional React components?',
        opts: ['useEffect', 'useMemo', 'useState', 'useRef'],
        ans: 2,
        exp: 'useState declares a state variable and updater function within a component.',
      },
      {
        q: 'When does the cleanup function returned by useEffect execute?',
        opts: ['Only on initial mount', 'Before the component re-runs the effect or unmounts', 'After every browser repaint', 'Only on error'],
        ans: 1,
        exp: 'React runs the returned cleanup function before applying the effect next time and when unmounting.',
      },
      {
        q: 'What is the purpose of the key prop when rendering lists in React?',
        opts: ['Styling each item', 'Helping React identify which items have changed, added, or removed', 'Assigning HTML ids', 'Binding click handlers'],
        ans: 1,
        exp: 'Keys give elements a stable identity inside reconciliation so React reorders DOM nodes efficiently.',
      },
    ]),
  },
  {
    name: 'TypeScript',
    slug: 'typescript',
    description: 'Static typing for JavaScript: interfaces, type aliases, generics, union types, and strict type safety.',
    icon: 'Code2',
    color: 'from-blue-600 to-cyan-500',
    badge: 'Typed JS',
    topics: JSON.stringify(['Basic Types', 'Interfaces & Types', 'Generics', 'Unions & Intersections', 'Utility Types']),
    questions: generateTrackQuestions('TypeScript', ['Interfaces', 'Generics', 'Utility Types', 'Strict Types', 'Type Guards'], [
      {
        q: 'Which keyword creates a reusable contract defining the shape of an object in TypeScript?',
        opts: ['struct', 'interface', 'class', 'implements'],
        ans: 1,
        exp: 'interface defines the shape of an object and supports declaration merging.',
      },
      {
        q: 'What does the unknown type represent in TypeScript compared to any?',
        opts: ['It is identical to any', 'Type-safe counterpart of any requiring narrowing before use', 'A synonym for never', 'Only primitive values'],
        ans: 1,
        exp: 'unknown is type-safe; you cannot access properties or invoke it without first performing type narrowing.',
      },
      {
        q: 'Which utility type constructs a type with all properties of T set to optional?',
        opts: ['Required<T>', 'Partial<T>', 'Readonly<T>', 'Pick<T>'],
        ans: 1,
        exp: 'Partial<T> returns a type with all properties of T marked optional.',
      },
    ]),
  },
  {
    name: 'Python',
    slug: 'python',
    description: 'Python 3 data structures, OOP, list comprehensions, decorators, generators, and standard libraries.',
    icon: 'Terminal',
    color: 'from-emerald-500 to-teal-600',
    badge: 'Backend & Data',
    topics: JSON.stringify(['Data Structures', 'Functions & Decorators', 'OOP', 'Generators & Iterators', 'Exceptions']),
    questions: generateTrackQuestions('Python', ['Data Structures', 'OOP', 'Decorators', 'Generators', 'Built-in Functions'], [
      {
        q: 'Which data type in Python is ordered, mutable, and allows duplicate elements?',
        opts: ['tuple', 'set', 'list', 'dictionary'],
        ans: 2,
        exp: 'Lists are mutable, ordered sequences in Python.',
      },
      {
        q: 'What keyword is used inside a function to return a generator iterator instead of a single value?',
        opts: ['return', 'yield', 'emit', 'generate'],
        ans: 1,
        exp: 'yield pauses execution and produces a value for the generator.',
      },
    ]),
  },
  {
    name: 'SQL',
    slug: 'sql',
    description: 'Relational database queries: SELECT, JOINs, aggregations, indexes, subqueries, and schema constraints.',
    icon: 'Database',
    color: 'from-purple-500 to-indigo-600',
    badge: 'Databases',
    topics: JSON.stringify(['SELECT & Filtering', 'JOINs & Unions', 'Aggregations & GROUP BY', 'Subqueries', 'Constraints & Indexes']),
    questions: generateTrackQuestions('SQL', ['SELECT & Filtering', 'JOIN Operations', 'Aggregations', 'Indexes', 'DDL & DML'], [
      {
        q: 'Which SQL clause is used to filter rows after an aggregate function (such as COUNT, SUM, AVG) has been applied?',
        opts: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'],
        ans: 1,
        exp: 'HAVING filters groups created by GROUP BY after aggregation.',
      },
      {
        q: 'Which type of JOIN returns all records from the left table and matched records from the right table?',
        opts: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN'],
        ans: 1,
        exp: 'LEFT JOIN (or LEFT OUTER JOIN) returns all rows from the left table.',
      },
    ]),
  },
  {
    name: 'Git & GitHub',
    slug: 'git',
    description: 'Version control mastery: branching, merging, rebasing, commit conventions, pull requests, and Git workflows.',
    icon: 'GitBranch',
    color: 'from-rose-500 to-orange-500',
    badge: 'Version Control',
    topics: JSON.stringify(['Branching & Merging', 'Commits & History', 'Rebase vs Merge', 'Remotes & Push', 'Stashing & Reset']),
    questions: generateTrackQuestions('Git & GitHub', ['Branching', 'Commits', 'Rebasing', 'Remotes', 'Stash & Reset'], [
      {
        q: 'Which command creates a new branch and immediately switches to it?',
        opts: ['git branch <name>', 'git checkout -b <name>', 'git merge <name>', 'git switch -m <name>'],
        ans: 1,
        exp: 'git checkout -b <name> (or git switch -c <name>) creates and checks out the branch.',
      },
      {
        q: 'Which command safely records staged snapshot changes into the Git repository history?',
        opts: ['git add', 'git push', 'git commit', 'git status'],
        ans: 2,
        exp: 'git commit permanently logs staged changes into the local repository.',
      },
    ]),
  },
];

async function main() {
  console.log('Seeding CodeQuiz database...');

  for (const courseData of coursesData) {
    const { questions, ...cData } = courseData;

    console.log(`Creating course: ${cData.name} (${questions.length} questions)...`);

    const course = await prisma.course.upsert({
      where: { slug: cData.slug },
      update: {
        name: cData.name,
        description: cData.description,
        icon: cData.icon,
        color: cData.color,
        badge: cData.badge,
        topics: cData.topics,
      },
      create: {
        name: cData.name,
        slug: cData.slug,
        description: cData.description,
        icon: cData.icon,
        color: cData.color,
        badge: cData.badge,
        topics: cData.topics,
      },
    });

    // Delete existing questions for this course to avoid duplicates
    await prisma.question.deleteMany({
      where: { courseId: course.id },
    });

    // Batch insert questions
    await prisma.question.createMany({
      data: questions.map((q) => ({
        courseId: course.id,
        topic: q.topic,
        question: q.question,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty || 'MEDIUM',
      })),
    });

    console.log(`✓ ${cData.name} seeded with ${questions.length} questions.`);
  }

  console.log('🎉 CodeQuiz database successfully seeded!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
