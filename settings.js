$('input[name="theme"]').on('change', themeChanged);
$('input[name="sound"]').on('change', soundsChanged);
$('.save').on('click', saveSettings);

let userPreferences = {};

browser.storage.sync.get(['theme', 'sounds'], (options) => {
    userPreferences.theme = options.theme;
    userPreferences.sounds = options.sounds;
});

function checkPreferencesRadios() {
    browser.storage.sync.get(['theme', 'sounds'], (options) => {
        console.log(options.theme, options.sounds)
        $(`#${options.theme}`).attr('checked', true);
        $(`#${options.sounds}`).attr('checked', true);
    });
}

function themeChanged() {
    userPreferences.theme = this.getAttribute('id');
}

function soundsChanged() {
    userPreferences.sounds = this.getAttribute('id');
}

function saveSettings() {
    browser.storage.sync.set({
        theme: userPreferences.theme,
        sounds: userPreferences.sounds
    });
}

checkPreferencesRadios();