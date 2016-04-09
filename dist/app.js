(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _game = require('./game');

var game = new _game.Game();

var $dealerCards = document.querySelector('#dealer .cards');
var $playerCards = document.querySelector('#player .cards');
var $dealerSum = document.querySelector('#dealer .sum');
var $playerSum = document.querySelector('#player .sum');

var $hit = document.getElementById('hit');
var $stand = document.getElementById('stand');
var $double = document.getElementById('double');

var $bet = document.querySelector('.deal .bet');
var $deal = document.getElementById('deal');
var $start = document.getElementsByClassName('deal')[0];

var $stakes = document.getElementById('stakes');
var $score = document.getElementById('score');

$score.innerText = game.score;

var $overlay = document.getElementById('overlay');
var $result = document.getElementById('result');

/**
 * 下注，每次下注后显示总分和赌注
 */
$bet.addEventListener('click', function (e) {
  if (e.target.className == 'score') {
    var score = parseInt(e.target.innerText);
    if (game.bet(score)) {
      $stakes.innerText = game.stakes;
      $score.innerText = game.score;
      $deal.className = '';
    }
  }
});

/**
 * 下注后即可开始游戏，开始游戏后隐藏下注区域
 * 显示庄家和明牌和自己的牌，显示当前可进行的操作
 */
$deal.addEventListener('click', function () {
  if (this.className == 'disabled') {
    return;
  }
  game.deal();
  $start.style.visibility = 'hidden';
  showCards();
  showActions();
});

/**
 * 玩家要牌
 * 超过21弹出BUST消息，否则刷新当前可进行操作
 */
$hit.addEventListener('click', function () {
  game.hit();
  showCards();
  if (_game.Game.getSum(game.player) > 21) {
    showResult('BUST!');
  } else {
    showActions();
  }
});

/**
 * 停牌
 * 之后庄家自动完成操作，显示结果
 */
$stand.addEventListener('click', function () {
  game.stand();
  hideActions();
  showCards(true);
  if (_game.Game.isBlackjack(game.player)) {
    if (_game.Game.isBlackjack(game.dealer)) {
      showResult('PUSH!');
      game.score += game.stakes;
    } else {
      game.score += game.stakes * 3;
      showResult('BLACKJACK!');
    }
    return;
  }
  if (_game.Game.getSum(game.dealer) > 21) {
    game.score += game.stakes * 2;
    showResult('WIN!');
    return;
  }
  if (_game.Game.getSum(game.dealer) > _game.Game.getSum(game.player)) {
    showResult('LOSE!');
  } else if (_game.Game.getSum(game.dealer) == _game.Game.getSum(game.player)) {
    game.score += game.stakes;
    showResult('PUSH!');
  } else {
    game.score += game.stakes * 2;
    showResult('WIN!');
  }
});

/**
 * 双倍
 * 之后庄家自动完成操作，显示结果
 */
$double.addEventListener('click', function () {
  game.double();
  hideActions();
  $stakes.innerText = game.stakes;
  $score.innerText = game.score;
  showCards(true);
  if (_game.Game.getSum(game.player) > 21) {
    showResult('BUST!');
    return;
  }
  if (_game.Game.getSum(game.dealer) > 21) {
    game.score += game.stakes * 2;
    showResult('WIN!');
    return;
  }
  if (_game.Game.getSum(game.dealer) > _game.Game.getSum(game.player)) {
    showResult('LOSE!');
  } else if (_game.Game.getSum(game.dealer) == _game.Game.getSum(game.player)) {
    game.score += game.stakes;
    showResult('PUSH!');
  } else {
    game.score += game.stakes * 2;
    showResult('WIN!');
  }
});

$overlay.addEventListener('click', function () {
  reset();
});

/**
 * 显示玩家可进行的操作
 */
function showActions() {
  $stand.style.visibility = 'visible';
  if (_game.Game.getSum(game.player) < 21) {
    $hit.style.visibility = 'visible';
    console.log(game.player.length);
    if (game.player.length == 2) {
      $double.style.visibility = 'visible';
    } else {
      $double.style.visibility = 'hidden';
    }
  }
}

/**
 * 隐藏操作按钮
 */
function hideActions() {
  $stand.style.visibility = 'hidden';
  $hit.style.visibility = 'hidden';
  $double.style.visibility = 'hidden';
}

/**
 * 显示双方的牌面
 * @param showAll 是否全部显示正面
 */
function showCards(showAll) {
  var playerImages = document.createDocumentFragment();
  var dealerImages = document.createDocumentFragment();

  game.dealer.forEach(function (card, i) {
    var img = document.createElement('img');
    img.style.top = '16px';
    if (!showAll && i == 0) {
      img.src = 'img/cards/back.png';
      img.style.left = '20px';
    } else {
      img.src = 'img/cards/' + card + '.png';
      img.style.left = i * 40 + 20 + 'px';
    }
    dealerImages.appendChild(img);
  });
  $dealerCards.appendChild(dealerImages);
  if (showAll) {
    $dealerSum.innerText = _game.Game.getSum(game.dealer);
  }

  game.player.forEach(function (card, i) {
    var img = document.createElement('img');
    img.src = 'img/cards/' + card + '.png';
    img.style.left = i * 40 + 20 + 'px';
    playerImages.appendChild(img);
  });
  $playerCards.appendChild(playerImages);
  $playerSum.innerText = _game.Game.getSum(game.player);
}

/**
 * 显示游戏结果
 * @param text
 */
function showResult(text) {
  $result.innerText = text;
  $overlay.style.visibility = 'visible';
}

/**
 * 重置游戏
 */
function reset() {
  game.stakes = 0;
  $stakes.innerText = 0;
  $score.innerText = game.score;
  $start.style.visibility = 'visible';
  $deal.className = 'disabled';
  $dealerCards.innerHTML = '';
  $dealerSum.innerText = '';
  $playerCards.innerHTML = '';
  $playerSum.innerText = '';
  hideActions();
  $overlay.style.visibility = 'hidden';
}

},{"./game":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HEART = 'H';
var Spade = 'S';
var Diamond = 'D';
var CLUB = 'C';

var Game = function () {
  function Game() {
    _classCallCheck(this, Game);

    this.cards = [];
    this.player = null;
    this.dealer = null;
    this.stakes = 0;
    this.score = 500;
  }

  /**
   * 洗牌
   */


  _createClass(Game, [{
    key: 'shuffleCards',
    value: function shuffleCards() {
      var types = [HEART, Spade, Diamond, CLUB];
      var temp = [];
      for (var i = 0; i < 4; i++) {
        for (var j = 1; j <= 13; j++) {
          temp.push(j + '-' + types[i]);
        }
      }
      var k = temp.length;
      while (k > 0) {
        var rand = Math.floor(Math.random() * k);
        this.cards[--k] = temp[rand];
        temp.splice(rand, 1);
      }
    }

    /**
     * 计算点数
     * @param cards
     * @returns {number}
     */

  }, {
    key: 'bet',


    /**
     * 下注
     * @param score
     * @returns {boolean}
     */
    value: function bet(score) {
      if (this.score - score >= 0) {
        this.score -= score;
        this.stakes += score;
        return true;
      }
      return false;
    }

    /**
     * 开始一轮游戏
     * 庄家和玩家各发两张牌
     */

  }, {
    key: 'deal',
    value: function deal() {
      this.shuffleCards();
      this.player = [];
      this.dealer = [];
      this.player.push(this.cards.pop());
      this.player.push(this.cards.pop());
      this.dealer.push(this.cards.pop());
      this.dealer.push(this.cards.pop());
    }

    /**
     * 要牌
     */

  }, {
    key: 'hit',
    value: function hit() {
      this.player.push(this.cards.pop());
    }

    /**
     * 停牌
     * 之后庄家开始操作，小于17点要牌，否则停牌
     */

  }, {
    key: 'stand',
    value: function stand() {
      while (Game.getSum(this.dealer) < 17) {
        this.dealer.push(this.cards.pop());
      }
    }

    /**
     * 双倍
     * 赌注翻倍，玩家只能再获得一张牌
     */

  }, {
    key: 'double',
    value: function double() {
      this.score -= this.stakes;
      this.stakes += this.stakes;
      this.player.push(this.cards.pop());
      this.stand();
    }
  }], [{
    key: 'getSum',
    value: function getSum(cards) {
      var sum = 0;
      var hasAce = false;
      cards.forEach(function (card) {
        var num = parseInt(card.split('-')[0]);
        if (num > 10) {
          num = 10;
        }
        if (num == 1) {
          hasAce = true;
        }
        sum += num;
      });
      if (hasAce && sum < 12) {
        sum += 10;
      }
      return sum;
    }

    /**
     * 判断 blackjack
     * @param cards
     * @returns {boolean}
     */

  }, {
    key: 'isBlackjack',
    value: function isBlackjack(cards) {
      return Game.getSum(cards) == 21 && cards.length == 2;
    }
  }]);

  return Game;
}();

exports.Game = Game;

},{}]},{},[1]);
