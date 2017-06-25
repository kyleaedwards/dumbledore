module.exports = function createStore() {
  const fileCache = {};
  const uriCache = {};
  const tagCache = {};
  const uriMap = {};

  function mapUri(content) {
    const uriParts = content.uri.slice(1).split('/');
    const file = uriParts.pop();
    let mapSection = uriMap;
    uriParts.forEach((uriPart) => {
      const dir = `${uriPart}/`;
      if (!mapSection[dir]) {
        mapSection[dir] = {};
      }
      mapSection = mapSection[dir];
    });
    mapSection[file] = content;
  }

  function getFileByUriMap(uri) {
    const uriParts = uri.slice(1).split('/');
    const file = uriParts.pop();
    let mapSection = uriMap;
    uriParts.forEach((uriPart) => {
      const dir = `${uriPart}/`;
      if (!mapSection[dir]) {
        mapSection[dir] = {};
      }
      mapSection = mapSection[dir];
    });
    return mapSection[file];
  }

  function removeFileFromUriMap(uri) {
    const uriParts = uri.slice(1).split('/');
    const file = uriParts.pop();
    let mapSection = uriMap;
    uriParts.forEach((uriPart) => {
      const dir = `${uriPart}/`;
      if (!mapSection[dir]) {
        mapSection[dir] = {};
      }
      mapSection = mapSection[dir];
    });
    mapSection[file] = false;
  }

  function removeFile(file) {
    const content = fileCache[file];
    content.tags.forEach((tag) => {
      tagCache[tag] = tagCache[tag].filter(c => c !== content);
      if (tagCache[tag].length === 0) {
        tagCache[tag] = false;
      }
    });
    uriCache[content.uri] = false;
    fileCache[file] = false;
    removeFileFromUriMap(content.uri);
  }

  function updateFile(content) {
    if (fileCache[content.file]) {
      removeFile(content.file);
    }
    fileCache[content.file] = content;
    uriCache[content.uri] = content;
    content.tags.forEach((tag) => {
      if (!tagCache[tag]) {
        tagCache[tag] = [];
      }
      tagCache[tag].push(content);
    });
    mapUri(content);
  }

  function getFile(file) {
    return fileCache[file];
  }

  function getFileByUri(uri) {
    return uriCache[uri];
  }

  function getFilesByTag(tag) {
    return tagCache[tag];
  }

  function getAllFiles() {
    return Object.keys(uriCache).map(uri => uriCache[uri]);
  }

  function getUriMap() {
    return uriMap;
  }

  function searchTree(tree, query, outer) {
    if (!query) {
      return;
    }
    if (tree.title) {
      if (tree.title.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
        return tree;
      }
      return outer;
    }
    Object.keys(tree).forEach(uri => {
      const branch = searchTree(tree[uri], query, {});
      if (Object.keys(branch).length) {
        outer[uri] = branch;
      }
    });
    return outer;
  }

  function searchUriMap(term) {
    return searchTree(uriMap, term, {});
  }

  return {
    updateFile,
    removeFile,
    getFile,
    getFileByUri,
    getFileByUriMap,
    getFilesByTag,
    getAllFiles,
    getUriMap,
    searchUriMap,
  };
};
