const HEART = 'H';
const Spade = 'S';
const Diamond = 'D';
const CLUB = 'C';

class Game {
  constructor() {
    this.cards = [];
    this.player = null;
    this.dealer = null;
    this.stakes = 0;
    this.score = 500;
  }

  /**
   * 洗牌
   */
  shuffleCards() {
    const types = [HEART, Spade, Diamond, CLUB];
    const temp = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 1; j <= 13; j++) {
        temp.push(j + '-' + types[i]);
      }
    }
    let k = temp.length;
    while (k > 0) {
      let rand = Math.floor(Math.random() * k);
      this.cards[--k] = temp[rand];
      temp.splice(rand, 1);
    }
  }

  /**
   * 计算点数
   * @param cards
   * @returns {number}
   */
  static getSum(cards) {
    var sum = 0;
    var hasAce = false;
    cards.forEach((card)=> {
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
  static isBlackjack(cards) {
    return Game.getSum(cards) == 21 && cards.length == 2;
  }

  /**
   * 下注
   * @param score
   * @returns {boolean}
   */
  bet(score) {
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
  deal() {
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
  hit() {
    this.player.push(this.cards.pop());
  }

  /**
   * 停牌
   * 之后庄家开始操作，小于17点要牌，否则停牌
   */
  stand() {
    while (Game.getSum(this.dealer) < 17) {
      this.dealer.push(this.cards.pop());
    }
  }

  /**
   * 双倍
   * 赌注翻倍，玩家只能再获得一张牌
   */
  double() {
    this.score -= this.stakes;
    this.stakes += this.stakes;
    this.player.push(this.cards.pop());
    this.stand();
  }
}

export {Game};