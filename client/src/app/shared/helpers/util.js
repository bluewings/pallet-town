const randomId = (prefix = 'tmp-', length) => {
  let key;
  if (length == null) {
    length = 8;
  }
  key = parseInt(Math.random() * 1000000, 10).toString(36) + parseInt(Math.random() * 1000000, 10).toString(36);
  if (prefix) {
    key = prefix + key;
  }
  return key.substr(0, 8);
};

const hashCode = (str) => {
  let chr;
  let hash;
  let i;
  hash = 0;
  if (typeof str === 'object' && str !== null) {
    str = JSON.stringify(str);
  }
  if (str.length === 0) {
    return hash;
  }
  i = 0;
  const len = str.length;
  while (i < len) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
    i++;
  }
  const base16 = hash.toString(16).replace(/[^a-z0-9]/g, '');
  const base36 = hash.toString(36).replace(/[^a-z0-9]/g, '');
  hash = (parseInt(base16.substr(0, 1), 16) + 10).toString(36) + base36;
  return hash;
};

export default { randomId, hashCode };
