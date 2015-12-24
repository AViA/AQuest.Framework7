window.addEventListener("deviceready", function() {
  JSAPI.KeepScreenOn(); // Cuz library loading too long, so we'll use it when it loads
});

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
/*! End*/

/*Loader & Image Cache handling*/
var bgImg = new Image();
bgImg.src = 'img/back_768x1024.png';
var optionsImg = new Image();
optionsImg.src = 'img/podlojka_option.png';
setTimeout(function() {
  mainView.router.load({pageName: 'home'});
  audio.play(); // We start to play audio when loader page ends
},750);
/*! End*/

/*Init Audio*/
var audio, audioVolumeValue = 0.5;
window.addEventListener("deviceready", function() {
  audio = new Media('mus/forest-quest-music.wav');
  audio.loop('on');
  audio.volume(audioVolumeValue);
}, false);
/*! End*/

/*Fixing answer blocks height when opening playing page*/
$$(document).on('pageInit', '.page[data-page="playing"]', function (e) {
  fixAnswerBlockHeights();
})
$$(document).on('pageReinit', '.page[data-page="playing"]', function (e) {
  fixAnswerBlockHeights();
})
/*! End*/

/*Init Options button tap events*/
var mainOptions = $$('.main-options-button')[0];
var playingOptions = $$('.right-navbar-custom-bg')[0];
new Tap(mainOptions);
new Tap(playingOptions);
mainOptions.addEventListener('tap', function (e) { e.preventDefault(); showOptions();});
playingOptions.addEventListener('tap', function (e) { e.preventDefault(); showOptions();});
/*! End*/

/*Game Init*/
newGame();
/*! End*/

function newGame() {

  $$('.main-play-button .test_').html('Play');

  setTimeout(function() {
    navigationId = 0;
    $$('.content-block .row').html(
      '<div class="col-50 no-gutter answers-col"><div class="answers-span" id="case1"></div></div>' +
      '<div class="col-50 no-gutter answers-col"><div class="answers-span" id="case2"></div></div>'
    );

    $$('.case-custom-bg').html(StoryData[navigationId].text);
    $$('#case1').html(StoryData[navigationId].case1);
    $$('#case2').html(StoryData[navigationId].case2);


    var leftOptionClick = $$('#case1')[0];
    var rightOptionClick = $$('#case2')[0];
    new Tap(leftOptionClick);
    new Tap(rightOptionClick);
    leftOptionClick.addEventListener('tap', function (e) {goInStory(e.srcElement);});
    rightOptionClick.addEventListener('tap', function (e) {goInStory(e.srcElement);});
  }, 200);
}

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

  $$('#range').prop('value', audioVolumeValue);

  var volumeEvent = $$('#range')[0];
  new Tap(volumeEvent);
  volumeEvent.addEventListener('touchmove', function (e) { audio.volume(this.value); audioVolumeValue = this.value; });
  volumeEvent.addEventListener('tap', function (e) { audio.volume(this.value); audioVolumeValue = this.value; });
}

function goInStory(elem) {
  if (elem.id == 'case1') {
    navigationId = StoryData[navigationId].case1Link;
    if (checkEndGame()) {return;}
  } else {
    navigationId = StoryData[navigationId].case2Link;
    if (checkEndGame()) {return;}
  }

    $$('.content-block').css('opacity', '0');
    $$(elem).css('background', 'rgba(0,122,255,.15)');
    setTimeout(function(){
      $$(elem).css('background', 'rgba(44,143,175,0.75)');
    }, 120);

  setTimeout(function(){
    $$('.case-custom-bg').html(StoryData[navigationId].text);
    $$('#case1').html(StoryData[navigationId].case1);
    $$('#case2').html(StoryData[navigationId].case2);

    var case1Height = $$('#case1').css('height');
    var case2Height = $$('#case2').css('height');
    if (case1Height > case2Height) {
      $$('#case2').css('height', case1Height);
    } else {
      $$('#case1').css('height', case2Height);
    }

    $$('.content-block').css('opacity', '1');
  }, 800);
}

function checkEndGame() {
  if (navigationId !== '0') { $$('.main-play-button .test_').html('Continue'); }

  if (navigationId === '7' || navigationId === '8' || navigationId === '10') {
    $$('.content-block').css('opacity', '0');

    setTimeout(function(){
      $$('.content-block .row').html(
        '<a href="" class="teh-end">' +
          '<div class="col-100 answers-col">' +
            '<div class="answers-span">Teh end!</div>' +
          '</div>' +
        '</a>'
      );

      $$('.case-custom-bg').html(StoryData[navigationId].text);
      $$('.content-block').css('opacity', '1');

      var answerTouchEnd = $$('.answers-col')[0];
      new Tap(answerTouchEnd);
      /*answerTouchEnd.addEventListener('touchstart', function (e) {
        $$(this).css('background', 'rgba(0,122,255,.15)');
      });
      answerTouchEnd.addEventListener('touchend', function (e) {
        $$(this).css('background', 'rgba(44,143,175,0.75)');
      });*/
      answerTouchEnd.addEventListener('tap', function (e) {
        setTimeout(function(){
          mainView.router.back();
          newGame();
        }, 1000)
      });
    }, 800);
    return true;
  }
  return false;
}

function fixAnswerBlockHeights () {
  if ($$('#case1').height() > $$('#case2').height()) {
    $$('#case2').css('height', $$('#case1').height());
  } else {
    $$('#case1').css('height', $$('#case2').height());
  }
}
