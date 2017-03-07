const pokemon = require('../pokemon');

const pogobuf = require('pogobuf');
const POGOProtos = require('node-pogo-protos');

// const { items } = require('pokemon-go-node-api/items.json');

// console.log(items);
class Pokemon {
  constructor() {

  }

  setPosition(lat, lng) {
    const self = this;
    if (lat && lng) {
      this.lat = parseFloat(lat);
      this.lng = parseFloat(lng);

      self.client.setPosition(this.lat, this.lng);
      self.client.init();
    }
    return true;
  }

  login(username, password, { lat, lng }) {
    console.log('trying to login');

    const self = this;

    return new pogobuf.GoogleLogin().login(username, password)
    .then((token) => {
        // Initialize the client
      self.client = new pogobuf.Client({
        authType: 'google',
        authToken: token,
      });
      // if (lat && lng) {
      self.setPosition(lat, lng);
      // }
        //

        // Uncomment the following if you want to see request/response information on the console
        // client.on('request', console.dir);
        // client.on('response', console.dir);

        // Perform the initial request
      return self.client.init();
    });
  }

  getInventory() {
    const self = this;
    return new Promise((resolve, reject) => {
      self.client.getInventory(0)
      .then((inventory) => {
        if (!inventory.success) throw Error('success=false in inventory response');

        // Split inventory into individual arrays and log them on the console
        inventory = pogobuf.Utils.splitInventory(inventory);
        console.log('Full inventory:', inventory);
        inventory.items.forEach((item) => {
          item.name = (pogobuf.Utils.getEnumKeyByValue(POGOProtos.Inventory.Item.ItemId, item.item_id) || '').replace(/^Item\s+/, '');
        });
        inventory.pokemon.forEach((pokemon) => {
          pokemon.name = pogobuf.Utils.getEnumKeyByValue(POGOProtos.Enums.PokemonId, pokemon.pokemon_id);
        });
        resolve(inventory);
      });
    });
    // return ;
  }

  getMapObjects() {
    const cellIDs = pogobuf.Utils.getCellIDs(this.lat, this.lng, 5, 17);
    return new Promise((resolve, reject) => {
      this.client.getMapObjects(cellIDs, Array(cellIDs.length).fill(0))
        .then((mapObjects) => {
          resolve(mapObjects.map_cells);

          mapObjects.map_cells.forEach((cell) => {
            // console.log(`Cell ${cell.s2_cell_id.toString()}`);
            // console.log(`Has ${cell.catchable_pokemons.length} catchable Pokemon`);
            cell.catchable_pokemons.forEach((catchablePokemon) => {
              console.log(` - A ${pogobuf.Utils.getEnumKeyByValue(POGOProtos.Enums.PokemonId,
                    catchablePokemon.pokemon_id)} is asking you to catch it.`);
            });
          });
        });
    });
  }

  destroy() {
    console.log('i am dying');
  }
}


const clients = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('socket.id', socket.id);

    const pokemon = new Pokemon();

    clients[socket.id] = pokemon;

    const onmessage = (type, handle) => {
      socket.on(type, ({ reqid, payload }) => {
        const promise = handle(payload);
        if (promise && typeof promise.then === 'function') {
          promise.then((response) => {
            socket.emit('callback', {
              reqid,
              payload: response,
            });
          });
        } else {
          socket.emit('callback', {
            reqid,
            payload: promise,
          });
        }
      });
    };

    socket.emit('news', { hello: 'world' });
    socket.on('event', (data) => {
      console.log(data);
    });
    socket.on('msg', (data) => {
      console.log(data);
    });
    socket.on('disconnect', () => {
      clients[socket.id].destroy();
      delete clients[socket.id];
    });

    onmessage('login', ({ username, password, position }) => pokemon.login(username, password, position));
    onmessage('getinventory', () => pokemon.getInventory());
    onmessage('setposition', ({ lat, lng }) => pokemon.setPosition(lat, lng));
    onmessage('getmapobjects', () => pokemon.getMapObjects());
  });
};
