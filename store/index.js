const Immutable = require('immutable');
const sha512 = require('sha512');
const uuid = require('uuid/v4');
const _ = require('lodash');

let state = Immutable.fromJS({});

const GameStatus = {
  open: 'open',
  start: 'start',
};

class Room extends Immutable.Record({
  name: '',
  lock: false,
  password: '',
  players: new Immutable.List(),
  status: GameStatus.start,
  result: '',
  average: null,
  min: null,
  max: null,
}) {
  mask () {
    return this.update('players', players =>
      players.map(p => p.delete('token'))
    );
  }

  validPoints () {
    return this.get('players').reduce((arr, player) => {
      const p = player.point;
      if (_.isNumber(p) && p >= 0 && p <= 100) {
        arr.push(p);
      }
      return arr;
    }, []);
  }

  min () {
    const value = _.min(this.validPoints());
    return _.isNumber(value) ? value : null;
  }

  max () {
    const value = _.max(this.validPoints());
    return _.isNumber(value) ? value : null;
  }

  average () {
    const points = this.validPoints();

    if (!points.length) return null;

    const sum = points.reduce((a, b) => a + b, 0);
    return _.round(sum / points.length, 3);
  }

  result () {
    //const first = this.get('players').first();
    //const p = first.point;

    if (!(_.isNumber(p) && p >= 0 && p <= 100)) return '';

    // 異なるポイントの要素があったら非合意
    // @todo 異なるポイントの要素が連続する3つ以内じゃなかったら。
    
    // const difference = this.get('players').find(player => player.point !== p);
    console(this.get('players'));
    const maxplayer = this.get('players').maxBy(player => player.point);
    const minplayer = this.get('players').minBy(player => player.point);
    const difference = true;
    const max = maxplayer.point;
    const min = minplayer.point;
    console(max);
    console(min);
    if (max === min) {
        difference = false;
    }else if (max === 89 && min === 55){
        difference = false;
    }else if (max === 89 && min === 34){
        difference = false;
    }else if (max === 55 && min === 34){
        difference = false;
    }else if (max === 55 && min === 21){
        difference = false;
    }else if (max === 34 && min === 21){
        difference = false;
    }else if (max === 34 && min === 13){
        difference = false;
    }else if (max === 21 && min === 13){
        difference = false;
    }else if (max === 21 && min === 8){
        difference = false;
    }else if (max === 13 && min === 8){
        difference = false;
    }else if (max === 13 && min === 5){
        difference = false;
    }else if (max === 8 && min === 5){
        difference = false;
    }else if (max === 8 && min === 3){
        difference = false;
    }else if (max === 5 && min === 3){
        difference = false;
    }else if (max === 5 && min === 2){
        difference = false;
    }else if (max === 3 && min === 2){
        difference = false;
    }else if (max === 3 && min === 1){
        difference = false;
    }else if (max === 2 && min === 1){
        difference = false;
    }else if (max === 2 && min === 0.5){
        difference = false;
    }else if (max === 1 && min === 0.5){
        difference = false;
    }else if (max === 1 && min === 0){
        difference = false;
    }else if (max === 0.5 && min === 0){
        difference = false;
    }
    return difference ? '' : 'consensus';
  }
}

const Player = Immutable.Record({
  id: '',
  name: '',
  token: '',
  point: null
});

const HASH_KEY = 'HOGEHOGE';

const actions = {
  mask: (room) => room
    .update('players', players =>
      players.map(p => p.delete('token'))
    ),

  // マスクした部屋情報を得る
  // 部屋がなければ作る
  findOrCreate: (roomName) => {
    if (!state.has(roomName)) {
      console.log(`create room >>> [${roomName}]`);
      state = state.set(roomName, new Room({ name: roomName }));
    }

    return state.get(roomName).mask();
  },

  // 部屋に参加する
  join: (roomName, playerName) => {
    console.log(`join room >>> [${roomName}][${playerName}]`);

    let room = state.has(roomName) ? state.get(roomName) : new Room({ name: roomName });

    let player = room.get('players').find(p => p.name === playerName);
    if (!player) {
      const id = uuid();
      player = new Player({
        id,
        name: playerName,
        token: sha512(id + HASH_KEY).toString('hex')
      });
      room = room.update('players', players => players.push(player));
    }

    state = state.set(roomName, room);

    return player;
  },

  // 部屋から退出する
  leave: (roomName, playerId) => {
    console.log(`leave room >>> [${roomName}][${playerId}]`);

    let room = state.get(roomName).update('players', players => players.filter(p => p.get('id') !== playerId));
    state = state.set(roomName, room);

    return room.mask();
  },

  // ゲームを開始する
  startGame: (roomName) => {
    console.log(`start game >>> [${roomName}]`);

    // ゲームを初期状態に更新する
    const room = state.get(roomName)
      .set('status', GameStatus.start)
      .set('average', 0)
      .set('result', '')
      .update('players', players => players.map(p => p.set('point', null)));

    state = state.set(roomName, room);

    return room.mask();
  },

  openGame: (roomName) => {
    console.log(`open game >>> [${roomName}]`);

    const room = state.get(roomName).set('status', GameStatus.open);

    state = state.set(roomName, room);

    return room.mask();
  },

  pointSelect: (roomName, playerId, point) => {
    // ポイントを更新する
    const room = state.get(roomName)
      .update('players', players =>
        players.map(p => {
          if (p.get('id') !== playerId) return p;
          return p.set('point', point);
        })
      )
      .update(v => {
        return v
        .set('average', v.average())
        .set('min', v.min())
        .set('max', v.max())
        .set('result', v.result());
      });

    state = state.set(roomName, room);

    return room.mask();
  }
};


module.exports = actions;
