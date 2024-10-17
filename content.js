(function() {
  let settings = {
      enabled: true,
      speed: 200,
      variableSpeed: false,
      size: 100,
      variableSize: false,
      numSpiders: 1,
      variableNumSpiders: false,
      waveDelay: 10,
      variableWaveDelay: false,
      enableLeftWeb: false,
      enableRightWeb: false,
      leftWebSize: 100,
      rightWebSize: 100
  };

  let spawnerTimeout;
  let leftWeb, rightWeb;

  function init() {
      chrome.storage.sync.get(settings, function(items) {
          settings = items;
          if (settings.enabled) {
              addSpiderWebs();
              startSpiderSpawner();
          }
      });

      chrome.storage.onChanged.addListener(function(changes, area) {
          if (area === 'sync') {
              for (let key in changes) {
                  settings[key] = changes[key].newValue;
              }
              if (settings.enabled) {
                  addSpiderWebs();
                  startSpiderSpawner();
              } else {
                  removeSpiderWebs();
                  stopSpiderSpawner();
              }
          }
      });
  }

  function startSpiderSpawner() {
      if (spawnerTimeout) {
          clearTimeout(spawnerTimeout);
      }
      spawnSpiders();
  }

  function stopSpiderSpawner() {
      if (spawnerTimeout) {
          clearTimeout(spawnerTimeout);
          spawnerTimeout = null;
      }
  }

  function spawnSpiders() {
      let numSpiders = parseInt(settings.numSpiders, 10);
      if (settings.variableNumSpiders) {
          let variation = Math.ceil(numSpiders * 0.3);
          numSpiders += Math.floor(Math.random() * (variation * 2 + 1)) - variation;
          numSpiders = Math.max(1, numSpiders);
      }
      for (let i = 0; i < numSpiders; i++) {
          createSpider();
      }
      let delay = parseInt(settings.waveDelay, 10) * 1000;
      if (settings.variableWaveDelay) {
          let variation = delay * 0.2;
          delay += (Math.random() * (variation * 2)) - variation;
      }
      spawnerTimeout = setTimeout(spawnSpiders, delay);
  }

  function createSpider() {
      const spider = document.createElement('img');
      spider.src = chrome.runtime.getURL('spider.gif');
      spider.style.position = 'fixed';
      spider.style.pointerEvents = 'none';
      spider.style.zIndex = 9999;

      let size = parseInt(settings.size, 10);
      if (settings.variableSize) {
          const variation = size * 0.2;
          size += (Math.random() * (variation * 2)) - variation;
      }
      spider.style.width = size + 'px';
      spider.style.height = 'auto';

      const edges = ['top', 'right', 'bottom', 'left'];
      const startEdge = edges[Math.floor(Math.random() * edges.length)];
      const endEdges = edges.filter(edge => edge !== startEdge);
      const endEdge = endEdges[Math.floor(Math.random() * endEdges.length)];

      const startCoords = getRandomPointOnEdge(startEdge);
      const endCoords = getRandomPointOnEdge(endEdge);

      spider.style.left = startCoords.x + 'px';
      spider.style.top = startCoords.y + 'px';

      document.body.appendChild(spider);

      const deltaX = endCoords.x - startCoords.x;
      const deltaY = endCoords.y - startCoords.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      let speed = parseInt(settings.speed, 10);
      if (settings.variableSpeed) {
          const variation = speed * 0.1;
          speed += (Math.random() * (variation * 2)) - variation;
      }
      const duration = distance / speed * 1000;

      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) - 90;

      spider.style.transform = 'rotate(' + angle + 'deg)';

      spider.animate([
          { transform: 'translate(0, 0) rotate(' + angle + 'deg)' },
          { transform: 'translate(' + deltaX + 'px, ' + deltaY + 'px) rotate(' + angle + 'deg)' }
      ], {
          duration: duration,
          easing: 'linear',
          fill: 'forwards'
      });

      setTimeout(function() {
          if (spider.parentNode) {
              spider.parentNode.removeChild(spider);
          }
      }, duration);
  }

  function getRandomPointOnEdge(edge) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      let x, y;
      switch (edge) {
          case 'top':
              x = Math.random() * width;
              y = 0;
              break;
          case 'right':
              x = width;
              y = Math.random() * height;
              break;
          case 'bottom':
              x = Math.random() * width;
              y = height;
              break;
          case 'left':
              x = 0;
              y = Math.random() * height;
              break;
      }
      return { x: x, y: y };
  }

  function addSpiderWebs() {
      removeSpiderWebs();
      if (settings.enableLeftWeb) {
          leftWeb = document.createElement('img');
          leftWeb.src = chrome.runtime.getURL('left-web.png');
          leftWeb.style.position = 'fixed';
          leftWeb.style.top = '0px';
          leftWeb.style.left = '0px';
          leftWeb.style.pointerEvents = 'none';
          leftWeb.style.zIndex = 9998;
          leftWeb.style.width = settings.leftWebSize + 'px';
          leftWeb.style.height = 'auto';
          document.body.appendChild(leftWeb);
      }
      if (settings.enableRightWeb) {
          rightWeb = document.createElement('img');
          rightWeb.src = chrome.runtime.getURL('right-web.png');
          rightWeb.style.position = 'fixed';
          rightWeb.style.top = '0px';
          rightWeb.style.right = '0px';
          rightWeb.style.pointerEvents = 'none';
          rightWeb.style.zIndex = 9998;
          rightWeb.style.width = settings.rightWebSize + 'px';
          rightWeb.style.height = 'auto';
          document.body.appendChild(rightWeb);
      }
  }

  function removeSpiderWebs() {
      if (leftWeb && leftWeb.parentNode) {
          leftWeb.parentNode.removeChild(leftWeb);
          leftWeb = null;
      }
      if (rightWeb && rightWeb.parentNode) {
          rightWeb.parentNode.removeChild(rightWeb);
          rightWeb = null;
      }
  }

  init();
})();
