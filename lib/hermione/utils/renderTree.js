const titleize = require('./titleize');

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
  return `
  <h${Math.min(4, level)}>${label}</h${Math.min(4, level)}>
  <ul>
    ${Object.keys(tree).map(uri => renderTree(tree[uri], titleize(uri), level)).join('')}
  </ul>`;
};

module.exports = renderTree;
