import {Game} from './game';
var game = new Game();

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
$hit.addEventListener('click', () => {
  game.hit();
  showCards();
  if (Game.getSum(game.player) > 21) {
    showResult('BUST!')
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
  if (Game.isBlackjack(game.player)) {
    if (Game.isBlackjack(game.dealer)) {
      showResult('PUSH!');
      game.score += game.stakes;
    } else {
      game.score += game.stakes * 3;
      showResult('BLACKJACK!');
    }
    return;
  }
  if (Game.getSum(game.dealer) > 21) {
    game.score += game.stakes * 2;
    showResult('WIN!');
    return;
  }
  if (Game.getSum(game.dealer) > Game.getSum(game.player)) {
    showResult('LOSE!');
  } else if (Game.getSum(game.dealer) == Game.getSum(game.player)) {
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
  if (Game.getSum(game.player) > 21) {
    showResult('BUST!');
    return;
  }
  if (Game.getSum(game.dealer) > 21) {
    game.score += game.stakes * 2;
    showResult('WIN!');
    return;
  }
  if (Game.getSum(game.dealer) > Game.getSum(game.player)) {
    showResult('LOSE!');
  } else if (Game.getSum(game.dealer) == Game.getSum(game.player)) {
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
  if (Game.getSum(game.player) < 21) {
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
      img.style.left = (i * 40 + 20) + 'px';
    }
    dealerImages.appendChild(img);
  });
  $dealerCards.appendChild(dealerImages);
  if (showAll) {
    $dealerSum.innerText = Game.getSum(game.dealer);
  }

  game.player.forEach(function (card, i) {
    var img = document.createElement('img');
    img.src = 'img/cards/' + card + '.png';
    img.style.left = (i * 40 + 20) + 'px';
    playerImages.appendChild(img);
  });
  $playerCards.appendChild(playerImages);
  $playerSum.innerText = Game.getSum(game.player);
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
