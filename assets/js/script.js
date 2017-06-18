const socket = window.io();
const hljs = window.hljs;

function processLinks() {
  const anchors = document.getElementsByTagName('a');
  Array.from(anchors).forEach((a) => {
    const href = a.getAttribute('href');
    if (href && href.match(/^\/[^/]|^\/$/)) {
      a.classList.add('internal');
    }
  });
}

const doSearch = debounce(() => {
  const query = document.getElementById('query');
  fetch(`/?s=${query.value}&json=true`).then((resp) => {
    resp.json().then((data) => {
      document.getElementById('body').innerHTML = data.body;
      document.title = data.title;
      if (data.showSearch) {
        query.style.display = 'block';
      } else {
        query.style.display = 'none';
      }
      processLinks();
    });
  });
});

function getPage(uri) {
  fetch(`${uri}?json=true`).then((resp) => {
    resp.json().then((data) => {
      document.getElementById('body').innerHTML = data.body;
      document.title = data.title;
      if (data.showSearch) {
        document.getElementById('query').style.display = 'block';
      } else {
        document.getElementById('query').style.display = 'none';
      }
      hljs.initHighlighting.called = false;
      hljs.initHighlighting();
      processLinks();
    });
  });
}

function debounce(cb, delay) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(cb, delay || 100);
  };
}

socket.on('grab_room', () => {
  socket.emit('room', window.location.pathname);
});

// Go to the index if a page was removed.
socket.on('page_removed', () => {
  history.pushState({ uri: '/' }, 'Index', '/');
  getPage('/');
  socket.emit('room', '/');
});

socket.on('page_updated', () => {
  getPage(window.location.pathname);
});

window.addEventListener('popstate', (e) => {
  if (e.state.uri) {
    getPage(e.state.uri);
  }
});

document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' && e.target.classList.contains('internal')) {
    const uri = e.target.getAttribute('href');
    getPage(e.target.href);
    socket.emit('room', uri);
    history.pushState({ uri }, e.target.textContext, uri);
    e.preventDefault();
  }
});

document.addEventListener('change', (e) => {
  const target = e.target;
  if (target.classList.contains('todo')) {
    const file = target.dataset.todoFile;
    const index = target.dataset.todoIndex;
    const status = target.checked;
    const request = new XMLHttpRequest();
    request.open('POST', '/todo', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({ file, index, status }));
  }
});

document.addEventListener('keyup', (e) => {
  console.log(e.target.id);
  const target = e.target;
  if (target.id === 'query') {
    doSearch();
  }
});

hljs.initHighlightingOnLoad();
processLinks();
