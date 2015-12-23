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

var mainOptions = $$('.main-options-button')[0];
var playingOptions = $$('.right-navbar-custom-bg')[0];
new Tap(mainOptions);
new Tap(playingOptions);
mainOptions.addEventListener('tap', function (e) {showOptions();});
playingOptions.addEventListener('tap', function (e) {showOptions();});

var StoryData = JSON.parse(localStorage.getItem('data'));

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


var navigationId = 0;

$$('.case-custom-bg').html(StoryData[navigationId].text)
$$('#case1').html(StoryData[navigationId].case1)
$$('#case2').html(StoryData[navigationId].case2)

var leftOptionClick = $$('#case1')[0];
var rightOptionClick = $$('#case2')[0];
new Tap(leftOptionClick);
new Tap(rightOptionClick);
leftOptionClick.addEventListener('tap', function (e) {goInStory(e.srcElement);});
rightOptionClick.addEventListener('tap', function (e) {goInStory(e.srcElement);});

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
    $$('.content-block').css('opacity', '1');
  }, 800);
}

function checkEndGame() {
  if (navigationId === '7' || navigationId === '8' || navigationId === '10') {
    $$('.content-block').css('opacity', '0');

    setTimeout(function(){
      $$('.content-block .row').html(
        '<div class="col-100 answers-col">' +
          '<div class="answers-span">Teh end!</div>' +
        '</div>'
      );
      $$('.case-custom-bg').html(StoryData[navigationId].text);
      $$('.content-block').css('opacity', '1');

      var answerTouchEnd = $$('.answers-col')[0];
      new Tap(answerTouchEnd);
      answerTouchEnd.addEventListener('touchstart', function (e) {
        $$(this).css('background', 'rgba(0,122,255,.15)');
      });
      answerTouchEnd.addEventListener('touchend', function (e) {
        $$(this).css('background', 'rgba(44,143,175,0.75)');
      });
    }, 800);
    return true;
  }
  return false;
}








zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
