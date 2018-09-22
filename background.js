browser.runtime.onInstalled.addListener(setDefaultSettings);
browser.runtime.onInstalled.addListener(updateBadge);

addAudioToDOM();

const audio = $('audio')[0];

function setDefaultSettings() {
  const defaultTheme = 'light';
  const defaultSounds = 'off';

  browser.storage.sync.set({
    theme: defaultTheme,
    sounds : defaultSounds
  });
}

function addAudioToDOM() {
  $('body').prepend(`<audio src="appointed.ogg"></audio>`);
}

function playSound(audio) {
  audio.play();
}

const getLastNotification = new Promise((resolve, reject) => {

  let nfyWhatArray = new Array();

  const fd = new FormData();
  fd.append('ajax', 'receiveNotify');

  const xhttp = new XMLHttpRequest();

  xhttp.open('POST', 'https://forum.pasja-informatyki.pl/eventnotify');
  xhttp.onreadystatechange = function(evt) {

    if(xhttp.readyState === 4 && xhttp.status === 200) {

      const response = xhttp.responseText;
      const nfyWhat = $(response).find('.nfyWhat');
      
      nfyWhat.each((key, item) => {
        nfyWhatArray.push(item.innerHTML.split('\n')[0]);
      });

      resolve(nfyWhatArray);
    }
  }
  xhttp.send(fd);
});

function updateBadge() {

  const xhttp = new XMLHttpRequest();

  xhttp.open('GET', 'https://forum.pasja-informatyki.pl/async-notifications', true);
  xhttp.onreadystatechange = function(evt) {
    if(xhttp.readyState === 4 && xhttp.status === 200) {
      const response = xhttp.response;
      
      if(Number(response) > 0)
        {
          browser.browserAction.setBadgeText({text: response});
          
          browser.storage.sync.get(['sounds'], (option) => {
            if(option.sounds == 'on') {
              playSound(audio);
            } else if(option.sounds == 'onlyPriv') {
              getLastNotification.then((result) => {
                for(let i = 0; i < Number(response); i++) {
                  if(result[i].indexOf('Odebrano') != -1) {
                    playSound(audio);
                  }
                }
              });
            }
          });
        }
      else
        browser.browserAction.setBadgeText({text: ''});
    }
  }
  xhttp.send(null);
}

setInterval(updateBadge, 1000*60);