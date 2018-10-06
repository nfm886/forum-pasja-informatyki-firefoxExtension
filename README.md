# Powiadomienia z Pasją

Rozszerzenie do przeglądarki Mozilla Firefox, przygotowane z myslą o forum.pasja-informatyki.pl

Dodatek znajduje się w [Addons Mozilla](https://addons.mozilla.org/pl/firefox/addon/powiadomienia-z-pasją/), skąd też zachęcam do pobrania.

### CHANGELOG

Wersja 3.0
  - Dodano możliwość obserwowania wybranych tagów z forum
  - Kilka mniejszych usprawnień

Wersja 2.1.1
 - Usunięcie brzydkich styli w stronie ustawień rozszerzenia.

Wersja 2.1
  - Dodano możliwość ustawienia jednego z dwóch motywów: Jasny (domyślny) i Ciemny.
  - Dodano możliwość włączenia dźwięków dla powiadomień: wszystkich, tylko wiadomości prywatnych lub wyłączenia (domyślnie).

Wersja 2.0
 - Asynchroniczne generowanie powiadomień z odpowiedzi na zapytanie wysyłane na */eventnotify* end-point.
 - Asynchroniczne sprawdzanie (co 60 sekund) liczby nowych powiadomień z odpowiedzi na zapytanie wysłane na */async-notifications* end-point.
 
Wersja 1.0
 - Niedostępna w tym repozytorium, kod źródłowy można podejrzeć w [repozytorium dla Chrome](https://github.com/nfm886/forum-pasja-informatyki-chromeExtension).

### Instalacja z repozytorium

Do zainstalowania dodatku lokalnie z repozytorium potrzebny będzie *npm* i globalnie zainstalowany pakiet ```web-ext```

Zaczynamy od zainstalowania pakietu web-ext

```sh
$ npm install --global web-ext
```

Następnie tworzyny katalog dla rozszerzenia i klonujemy repozytorium

```sh
$ mkdir Powiadomienia-z-Pasją && cd Powiadomienia-z-Pasją
$ git clone https://github.com/nfm886/forum-pasja-informatyki-firefoxExtension.git .
```

Teraz wystarczy uruchmić narzędzie web-ext
```sh
$ web-ext run
```

Odpali się przeglądarka Mozilla Firefox wraz z zainstalowanym dodatkiem.

Aby przeładować pakiet z dodadkiem wystarczy nacisnąć klawisz R w terminalu, kończymy pracę kombinacją klawiszy CTRL + C.

Debuggowanie rozszerzenia możemy włączyć przechodząc pod adres ```about:debugging``` i naciskając "*Debuguj*" w boxie z informacją o dodatku.

### TODO

  - ~~Dodać możliwość obserwowania wybranych tagów z forum~~
  - Informowanie o nowych tagach poprzez plakietkę.

### LICENSE
----

MIT
