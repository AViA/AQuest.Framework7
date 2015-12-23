var AQuest = new Framework7({
  modalTemplate: '<div class="modal {{#unless buttons}}modal-no-buttons{{/unless}}">' +
  '<div class="modal-inner">' +
    '{{#if title}}' +
      '<div class="modal-title">{{title}}</div>' +
    '{{/if}}' +
    '{{#if text}}' +
       '<div class="modal-text">{{text}}</div>' +
    '{{/if}}' +
    '{{#if afterText}}' +
      '{{afterText}}' +
    '{{/if}}' +
  '</div>' +
  '{{#if buttons}}' +
    '<div class="modal-buttons">' +
      '{{#each buttons}}' +
        '<span class="modal-button {{#if bold}}modal-button-bold{{/if}} modal-button-font-big">{{text}}</span>' +
      '{{/each}}' +
    '</div>' +
  '{{/if}}' +
  '</div>'
});

var $$ = Dom7;

var mainView = AQuest.addView('.view-main', {
  domCache: true
});
/*Init Audio*/

/*window.addEventListener("deviceready", function() {*/
  var audio = new Sound('mus/forest-quest-music.wav');
  audio.loop('on');
  audio.volume = .0;
  audio.play();
/*}, false);*/
/*! End*/

/*Options buttons touch eventHandlers*/
var mainOptions = $$('.main-options-button')[0];
var playingOptions = $$('.right-navbar-custom-bg')[0];
new Tap(mainOptions);
new Tap(playingOptions);
mainOptions.addEventListener('tap', function (e) {showOptions();});
playingOptions.addEventListener('tap', function (e) {showOptions();});
/*! End*/

function showOptions() {
  AQuest.modal({
    title: 'OPTIONS',
    text: 'VOLUME',
    afterText: '<div class="range-slider-custom">' +
          '<input type="range" id="range" min="0" max="1" value=".5" step=".01">' +
        '</div>',
    buttons: [
      {
        text: 'OK',
        bold: true
      }
    ]
  });
  $$('#range').prop('value', audio.volume);
  var volumeEvent = $$('#range')[0];
  new Tap(volumeEvent);
  volumeEvent.addEventListener('touchmove', function (e) { audio.volume = this.value; });
  volumeEvent.addEventListener('tap', function (e) { audio.volume = this.value; });
}

/*Answer divs touch events*/
var answerTouch0 = $$('.answers-col')[0];
var answerTouch1 = $$('.answers-col')[1];
new Tap(answerTouch0);
new Tap(answerTouch1);
answerTouch0.addEventListener('touchstart', function (e) {
  $$(this).css('background', 'rgba(0,122,255,.15)');
});
answerTouch0.addEventListener('touchend', function (e) {
    /*$$(this).css('background', '#fff');*/

    /*$$(this).css('background', 'rgba(0,85,32,.85)');*/

    $$(this).css('background', '#2e91ac');
});
answerTouch1.addEventListener('touchstart', function (e) {
  $$(this).css('background', 'rgba(0,122,255,.15)');
});
answerTouch1.addEventListener('touchend', function (e) {
    /*$$(this).css('background', '#fff');*/

    /*$$(this).css('background', 'rgba(0,85,32,.85)');*/

    $$(this).css('background', '#2e91ac');

    /*$$(this).css('background-image', 'url("img/podlojka_option.png")');
    $$(this).css('background-repeat', 'no-repeat');
    $$(this).css('background-position', 'center center');
    $$(this).css('-o-background-size', '100% 100%, auto');
    $$(this).css('-moz-background-size', '100% 100%, auto');
    $$(this).css('-webkit-background-size', '100% 100%, auto');
    $$(this).css('background-size', '100% 100%, auto');
    $$(this).css('box-shadow', '1px 2px 3px rgba(0,0,0,0.6)');*/

    /*$$(this).toggleClass('.case-custom-bg');*/
});
/*! End*/
