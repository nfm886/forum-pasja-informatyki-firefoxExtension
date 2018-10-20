$('body').prepend(`<audio src="/assets/sounds/appointed.ogg"></audio>`);

const setDefaultSettings = () => {
  const defaultTheme = 'light';
  const defaultSounds = 'off';
  
  browser.storage.sync.set({
    theme: defaultTheme,
    sounds : defaultSounds
  });
}

const audio = $('audio')[0];
const playSound = audio => audio.play();

const getLastNotification = new Promise((resolve, reject) => {
  const nfyWhatArray = new Array();
  const formData = new FormData();
  const req = new XMLHttpRequest();

  formData.append('ajax', 'receiveNotify');
  req.open('POST', 'https://forum.pasja-informatyki.pl/eventnotify');
  req.onreadystatechange = e => {
    if(req.readyState === 4 && req.status === 200) {
      const response = req.responseText;

      if(response !== 'Userid is empty!') {
        const nfyWhat = $(response).find('.nfyWhat');
        nfyWhat.each((key, item) => {
          nfyWhatArray.push(item.innerHTML.split('\n')[0]);
        });
        resolve(nfyWhatArray);
      }
      
    }
  }
  req.send(formData);
});

const initializeWatchlist = () => {
  browser.storage.sync.get(['followed'], storage => {
    if(storage.followed != undefined) {
      if(storage.followed.length < 1) {
        browser.storage.sync.set({
          followed: []
        });
      }
    }
  });
}

const updateBadge = () => {
  const req = new XMLHttpRequest();

  req.open('GET', 'https://forum.pasja-informatyki.pl/async-notifications');
  req.onreadystatechange = e => {
    if(req.readyState === 4 && req.status === 200) {
      const response = req.response;

      if(Number(response) > 0)
        {
          browser.browserAction.setBadgeText({text: response});
          browser.storage.sync.get(['sounds'], storage => {
            if(storage.sounds == 'on') {
              playSound(audio);
            } else if(storage.sounds == 'onlyPriv') {
              getLastNotification.then((data) => {
                for(let i = 0; i < Number(response); i++) {
                  if(data[i].indexOf('Odebrano') != -1) {
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
  req.send();
}

setInterval(updateBadge, 1000*60);

browser.runtime.onInstalled.addListener(setDefaultSettings);
browser.runtime.onInstalled.addListener(initializeWatchlist);
browser.runtime.onInstalled.addListener(updateBadge);