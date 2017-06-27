'use strict';

/**
 * Imports
 */
const titleize = require('./titleize');

/**
 * Constants
 */
const renderTag = tag => `
  <a class="tag" href="/tag/${tag}">${titleize(tag)}</a>
`;

module.exports = content => `
  <div id="docHeader">
    <h2 id="docTitle">${content.title}</h2>
    <p id="tags">
      ${content.tags.map(renderTag).join('')}
    </p>
  </div>
  ${content.body}
`;
