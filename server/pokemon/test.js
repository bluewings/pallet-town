const items = require('pokemon-go-node-api');


// const pokemon = require('../pokemon');

const pogobuf = require('pogobuf');
const POGOProtos = require('node-pogo-protos');

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
    //   self.setPosition(lat, lng);
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
        resolve(inventory);
      });
    });
    // return ;
  }

  getMapObjects() {
    console.log(this.lat, this.lng);

    const cellIDs = pogobuf.Utils.getCellIDs(this.lat, this.lng, 5, 17);
// console.log(cellIDs);
    // return true;
    return new Promise((resolve, reject) => {
      this.client.getMapObjects(cellIDs, Array(cellIDs.length).fill(0))
    .then((mapObjects) => {
      resolve(mapObjects.map_cells);

      mapObjects.map_cells.forEach((cell) => {
        console.log(`Cell ${cell.s2_cell_id.toString()}`);
        console.log(`Has ${cell.catchable_pokemons.length} catchable Pokemon`);
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


console.log(items);


const poke = new Pokemon()

poke.login('cha.yun.ho.3@gmail.com', 'pkocsw97', {})

.then(rslt => {
    // console.log(rslt);
    return poke.getInventory()
})
.then(inventory => {

    const fs = require('fs');

    fs.writeFile('inventory.json', JSON.stringify(inventory, null, 2), 'utf8', (err) => {
        console.log('done');
    });
    // console.log(inventory);

})