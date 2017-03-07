

let { items } = require('pokemon-go-node-api/items.json');

const inventory = require('./inventory.json');
// console.log(inventory,items);


items = Array.prototype.slice.call(items);

// Array.prototype.slice.call
// console.log(items);
inventory.items.forEach((item) => {
//   console.log(newItems[0]);
  const found = items.filter(e =>
    //   console.log(e.id);
       e.id === item.item_id);

       if (found && found[0]) {
           item.name = found[0].name;
       }
  console.log(item);
  console.log(found);
  console.log()
    // console.log(items[item.item_id])
});

console.log('-=-=-=-=-=-=-')
console.log(inventory.items);
// console.log(items);
