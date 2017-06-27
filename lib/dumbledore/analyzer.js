'use strict';

module.exports = function createAnalyzer(store) {
  const missingLinks = {};

  function linkFile(fileA, uriB) {
    const fA = fileA;
    const uriA = fileA.uri;
    const fileB = store.getFileByUri(uriB);
    if (fileB) {
      if (!fA.linksTo) fA.linksTo = {};
      fA.linksTo[uriB] = fileB;
      if (!fileB.linksFrom) fileB.linksFrom = {};
      fileB.linksFrom[uriA] = fA;
      return fileB;
    }
    if (!missingLinks[uriB]) {
      missingLinks[uriB] = [];
    }
    missingLinks[uriB].push(fA);
    process.stdout.write(`Broken link to missing file: ${uriB}\n`);
    return false;
  }

  function linkContent(file, skipMissing) {
    const content = file;
    const uri = content.uri;
    content.body = content.body.replace(/\{\{[^}]+\}\}/gi, (link) => {
      const linkParts = link.slice(2, -2).split('|');
      const uriB = linkParts[0] === '/' ? linkParts[0] : `/${linkParts[0]}`;
      const title = linkParts[linkParts.length - 1];
      const fileB = linkFile(content, uriB);
      if (fileB) {
        if (linkParts.length > 1) {
          return `<a href="${uriB}"><strong>${title}</strong></a>`;
        }
        return `<a href="${uriB}"><strong>${(fileB.title || title)}</strong></a>`;
      }
      return `<strong>${title}</strong>`;
    });
    // check missing links
    if (missingLinks[uri] && missingLinks[uri].length && !skipMissing) {
      const missing = missingLinks[uri];
      missingLinks[uri] = [];
      missing.forEach(mLink => linkContent(mLink, true));
    }
  }

  function unlinkContent(uriA) {
    const fileA = store.getFile(uriA);
    if (!fileA.linksFrom) fileA.linksFrom = {};
    Object.keys(fileA.linksFrom).forEach((uriB) => {
      delete fileA.linksFrom[uriB].linksTo[uriA];
    });
  }

  return {
    linkContent,
    unlinkContent,
  };
};
