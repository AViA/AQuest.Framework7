var audio, audioVolumeValue = 0.75;

setTimeout( function() {
  JSAPI.keepScreenOn(); // Cuz library loading too long, so we'll use it when it loads
  audio = new Media('mus/forest-quest-music.wav');
  audio.loop('on');
  audio.volume(audioVolumeValue);
  audio.play(); // We start to play audio when loader page ends
}, 750);

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

/*Loading text data*/
var StoryData = JSON.parse(localStorage.getItem('data'));
var localization = JSON.parse(localStorage.getItem('interfaceText_EN'));

$$('.main-play-button').html(localization.mainPagePlayButton);
/*! End*/

/*Loader & Image Cache handling*/
var bgImg = new Image();
bgImg.src = 'img/back_768x1024.png';
var optionsImg = new Image();
optionsImg.src = 'img/podlojka_option.png';
setTimeout(function() {
  mainView.router.load({pageName: 'home', reload: true});
},750);
/*! End*/

/*Init Audio*/
/*window.addEventListener("deviceready", function() {
}, false);*/
/*! End*/

/*Fixing answer blocks height when opening playing page*/
$$(document).on('pageInit', '.page[data-page="playing"]', function (e) {
  fixAnswerBlockHeights();
})
$$(document).on('pageReinit', '.page[data-page="playing"]', function (e) {
  fixAnswerBlockHeights();
})
/*! End*/

var  navigationId = 0;

/*Init buttons tap events*/
var playStart = $$('.main-play-button')[0];
var mainOptions = $$('.right-navbar-custom-bg')[0];
var playingOptions = $$('.right-navbar-custom-bg')[1];
new Tap(playStart);
new Tap(mainOptions);
new Tap(playingOptions);
playStart.addEventListener('tap', function (e) {
  e.preventDefault();
  mainView.router.load({pageName: 'playing'});
});
mainOptions.addEventListener('tap', function (e) {
  e.preventDefault();
  showOptions();
});
playingOptions.addEventListener('tap', function (e) {
  e.preventDefault();
  showOptions();
});
/*! End*/

/*Game Init*/
navigationId = 0;
newGame();
/*! End*/

function newGame() {

  $$('.main-play-button').html(localization.mainPagePlayButton);

  setTimeout(function() {
    navigationId = 0;
    $$('.content-block .row').html(
      '<div class="col-50 no-gutter answers-col answers-span"><div class="answ-center" id="case1"></div></div>' +
      '<div class="col-50 no-gutter answers-col answers-span"><div class="answ-center" id="case2"></div></div>'
    );

    $$('.case-custom-bg').html(StoryData[navigationId].text);
    $$('#case1').html(StoryData[navigationId].case1);
    $$('#case2').html(StoryData[navigationId].case2);


    var leftOptionClick = $$('#case1')[0];
    var rightOptionClick = $$('#case2')[0];
    new Tap(leftOptionClick);
    new Tap(rightOptionClick);
    leftOptionClick.addEventListener('tap', function (e) {
    $$('#case1').attr('disabled', 'disabled');
    $$('#case2').attr('disabled', 'disabled');
      setTimeout(function() {
        $$('#case1').removeAttr('disabled');
        $$('#case2').removeAttr('disabled');
      }, 1600);
      e.preventDefault();
      goInStory(e.srcElement);
    });
    rightOptionClick.addEventListener('tap', function (e) {
    $$('#case1').attr('disabled', 'disabled');
    $$('#case2').attr('disabled', 'disabled');
      setTimeout(function() {
        $$('#case1').removeAttr('disabled');
        $$('#case2').removeAttr('disabled');
      }, 1600);
      e.preventDefault();
      goInStory(e.srcElement);
    });
  }, 200);
}

function showOptions() {
  AQuest.modal({
    title: localization.modalOptionsTitle,
    text: localization.modalOptionsText,
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

  $$('#range').prop('value', audioVolumeValue);

  var volumeEvent = $$('#range')[0];
  new Tap(volumeEvent);
  volumeEvent.addEventListener('tap', function (e) { audio.volume(this.value); audioVolumeValue = this.value; });
  volumeEvent.addEventListener('touchmove', function (e) { audio.volume(this.value); audioVolumeValue = this.value; });
}

function goInStory(elem) {
  $$('.content-block').css('opacity', '0');
  if (elem.id == 'case1') {
    navigationId = StoryData[navigationId].case1Link;
    if (checkEndGame()) {return;}
  } else {
    navigationId = StoryData[navigationId].case2Link;
    if (checkEndGame()) {return;}
  }

  setTimeout(function(){
    $$('.case-custom-bg').html(StoryData[navigationId].text);
    $$('#case1').html(StoryData[navigationId].case1);
    $$('#case2').html(StoryData[navigationId].case2);

    fixAnswerBlockHeights();
    setTimeout(function(){ $$('.content-block').css('opacity', '1'); }, 10);
  }, 800);
}

function checkEndGame() {
  if (navigationId !== '0') { $$('.main-play-button').html(localization.mainPageContinueButton); }

  if (navigationId === '7' || navigationId === '8' || navigationId === '10') {
    $$('.content-block').css('opacity', '0');

    setTimeout(function(){
      $$('.content-block .row').html(
          '<div class="col-100 answers-col answers-span">' +
            '<div class="answ-center">The end!</div>' +
          '</div>'
      );

      $$('.case-custom-bg').html(StoryData[navigationId].text);
      $$('.content-block').css('opacity', '1');

      var answerTouchEnd = $$('.answers-col')[0];
      new Tap(answerTouchEnd);
      var backNewGame = $$('.left-navbar-custom-bg')[0];
      new Tap(backNewGame);
      answerTouchEnd.addEventListener('tap', function (e) {
        e.preventDefault();
        setTimeout(function(){
          mainView.router.back();
          newGame();
        }, 100)
      });
      backNewGame.addEventListener('tap', backNewGameTap, false);

      function backNewGameTap(e) {
          e.preventDefault();
          setTimeout(function(){
            mainView.router.back();
            newGame();
            backNewGame.removeEventListener('tap', backNewGameTap, false);
          }, 100);
      }
    }, 800);
    return true;
  }
  return false;
}

function fixAnswerBlockHeights () {
  $$('#case1').css('height', 'auto');
  $$('#case2').css('height', 'auto');
  if ($$('#case1').height() > $$('#case2').height()) {
    $$('#case2').css('height', $$('#case1').height());
  } else {
    $$('#case1').css('height', $$('#case2').height());
  }
}
