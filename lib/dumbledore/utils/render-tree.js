'use strict';

/**
 * Imports
 */
const titleize = require('./titleize');

/**
 * Constants
 */
const renderItem = item => `
  <li>
    <a href="${item.uri}">${item.title}</a>
  </li>
`;

const renderTree = (tree, label, level) => {
  if (!tree) {
    return '';
  }
  if (tree.title) {
    return renderItem(tree);
  }
  const keys = Object.keys(tree);
  let body = '<div class="no-results">No documents found.</div>';
  if (keys.length) {
    body = `
    <ul>
      ${Object.keys(tree).map(uri => renderTree(tree[uri], titleize(uri), level)).join('')}
    </ul>`;
  }
  return `
  <h${Math.min(4, level)}>${label}</h${Math.min(4, level)}>
  ${body}`;
};

module.exports = renderTree;
