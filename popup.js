document.addEventListener('DOMContentLoaded', function() {
  const powerButton = document.getElementById('powerButton');
  const speedInput = document.getElementById('speed');
  const variableSpeedCheckbox = document.getElementById('variableSpeed');
  const sizeInput = document.getElementById('size');
  const variableSizeCheckbox = document.getElementById('variableSize');
  const numSpidersInput = document.getElementById('numSpiders');
  const variableNumSpidersCheckbox = document.getElementById('variableNumSpiders');
  const waveDelayInput = document.getElementById('waveDelay');
  const variableWaveDelayCheckbox = document.getElementById('variableWaveDelay');
  const enableLeftWebCheckbox = document.getElementById('enableLeftWeb');
  const enableRightWebCheckbox = document.getElementById('enableRightWeb');
  const leftWebSizeInput = document.getElementById('leftWebSize');
  const rightWebSizeInput = document.getElementById('rightWebSize');

  chrome.storage.sync.get({
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
  }, function(items) {
      updatePowerButton(items.enabled);
      speedInput.value = items.speed;
      variableSpeedCheckbox.checked = items.variableSpeed;
      sizeInput.value = items.size;
      variableSizeCheckbox.checked = items.variableSize;
      numSpidersInput.value = items.numSpiders;
      variableNumSpidersCheckbox.checked = items.variableNumSpiders;
      waveDelayInput.value = items.waveDelay;
      variableWaveDelayCheckbox.checked = items.variableWaveDelay;
      enableLeftWebCheckbox.checked = items.enableLeftWeb;
      enableRightWebCheckbox.checked = items.enableRightWeb;
      leftWebSizeInput.value = items.leftWebSize;
      rightWebSizeInput.value = items.rightWebSize;
  });

  powerButton.addEventListener('click', function() {
      chrome.storage.sync.get('enabled', function(items) {
          const newStatus = !items.enabled;
          chrome.storage.sync.set({ enabled: newStatus }, function() {
              updatePowerButton(newStatus);
          });
      });
  });

  speedInput.addEventListener('change', function() {
      chrome.storage.sync.set({ speed: speedInput.value });
  });

  variableSpeedCheckbox.addEventListener('change', function() {
      chrome.storage.sync.set({ variableSpeed: variableSpeedCheckbox.checked });
  });

  sizeInput.addEventListener('change', function() {
      chrome.storage.sync.set({ size: sizeInput.value });
  });

  variableSizeCheckbox.addEventListener('change', function() {
      chrome.storage.sync.set({ variableSize: variableSizeCheckbox.checked });
  });

  numSpidersInput.addEventListener('change', function() {
      chrome.storage.sync.set({ numSpiders: numSpidersInput.value });
  });

  variableNumSpidersCheckbox.addEventListener('change', function() {
      chrome.storage.sync.set({ variableNumSpiders: variableNumSpidersCheckbox.checked });
  });

  waveDelayInput.addEventListener('change', function() {
      chrome.storage.sync.set({ waveDelay: waveDelayInput.value });
  });

  variableWaveDelayCheckbox.addEventListener('change', function() {
      chrome.storage.sync.set({ variableWaveDelay: variableWaveDelayCheckbox.checked });
  });

  enableLeftWebCheckbox.addEventListener('change', function() {
      chrome.storage.sync.set({ enableLeftWeb: enableLeftWebCheckbox.checked });
  });

  enableRightWebCheckbox.addEventListener('change', function() {
      chrome.storage.sync.set({ enableRightWeb: enableRightWebCheckbox.checked });
  });

  leftWebSizeInput.addEventListener('change', function() {
      chrome.storage.sync.set({ leftWebSize: leftWebSizeInput.value });
  });

  rightWebSizeInput.addEventListener('change', function() {
      chrome.storage.sync.set({ rightWebSize: rightWebSizeInput.value });
  });

  function updatePowerButton(enabled) {
      if (enabled) {
          powerButton.textContent = 'ON';
          powerButton.classList.remove('off');
      } else {
          powerButton.textContent = 'OFF';
          powerButton.classList.add('off');
      }
  }
});
