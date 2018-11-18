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

// watchlist start

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

const questionsList = new Array();
const followList = new Array();

const watchlistBadge = (questionsList) => {
    browser.storage.local.get(['lastQuestions'], storage => {

        if(storage.lastQuestions != undefined)
            if(JSON.stringify(storage.lastQuestions) != JSON.stringify(questionsList)) {
                browser.browserAction.setBadgeText({text: '#'})
                browser.storage.sync.get(['sounds'], storage => {
                    if(storage.sounds == 'on' || storage.sounds == 'onlyWatchlist') {
                        playSound(audio);
                    }
                });
            }
    });
}

const getFirstQuestions = (object, value) => {

    if(value >= 0) {
        const req = new XMLHttpRequest();
        req.open('GET', object[value].link, true);

        req.onreadystatechange = (e) => {
            if(req.readyState === 4 && req.status === 200) {

                const doc = req.responseText;
                const title = $(doc).find('div.qa-q-item-main > div.qa-q-item-title > a > span');
                const urls = $(doc).find('div.qa-q-item-main > div.qa-q-item-title > a');

                questionsList.push({
                    tag: object[value].name,
                    title: html_unescape(title[0].innerHTML).trunc(65).toString(),
                    url: urls[0].getAttribute('href').replace('../', 'https://forum.pasja-informatyki.pl/')
                });

                value = value - 1;
                getFirstQuestions(followList, value);
            }
        }
        req.send();
    } else {
        watchlistBadge(questionsList);
    }
}

const notifyWatchlist = () => {
    followList.length = 0;
    browser.storage.sync.get(['followed'], storage => {
        if(storage.followed != undefined && storage.followed.length > 0) {
            for(let i = 0; i < storage.followed.length; i++) {
                followList.push({
                    name: storage.followed[i].name,
                    link: storage.followed[i].link
                });
            }
            getFirstQuestions(followList, followList.length - 1);
        }
    });
    if(questionsList.length > followList.length)
        questionsList.length = 0;
}

// watchlist end

setInterval(updateBadge, 1000*60);
setInterval(notifyWatchlist, 1000*60*5);

browser.runtime.onInstalled.addListener(setDefaultSettings);
browser.runtime.onInstalled.addListener(initializeWatchlist);
browser.runtime.onInstalled.addListener(updateBadge);