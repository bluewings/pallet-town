const fetch = require('node-fetch');
const FormData = require('form-data');
const entries = require('object.entries');

if (!Object.entries) {
  entries.shim();
}

const stringpad = (function link() {
  const result = ['pokemongomap.info', '', ':', 'split', '/', '://', 'href', 'location', ';', 'length', '.', 'error', 'use strict', 'stringpad', '=', 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', '1.7', 'charAt', 'indexOf', 'C', 'fromCharCode', 'push', 'join', 'charCodeAt', '5', '1'];
  const padding = result[14];
  const writeCallbacks = result[15];
  function clean(selector, elems) {
    const ret = writeCallbacks[result[18]](selector[result[17]](elems));
    if (ret === -1) {
      throw result[19];
    }
    return ret;
  }
  /* eslint-disable */
  function escape(s) {
    let _0xD679 = 0;
    let originalEvent;
    let _0xD57A;
    let k = s[result[9]];
    const values = [];
    s = String(s);
    if (k === 0) {
      return s;
    }
    if (k % 4 !== 0) {
      throw result[19];
    }
    if (s[result[17]](k - 1) === padding) {
      _0xD679 = 1;
      if (s[result[17]](k - 2) === padding) {
        _0xD679 = 2;
      }
      k -= 4;
    }
    originalEvent = 0;
    for (;originalEvent < k; originalEvent += 4) {
      _0xD57A = clean(s, originalEvent) << 18 | clean(s, originalEvent + 1) << 12 | clean(s, originalEvent + 2) << 6 | clean(s, originalEvent + 3);
      values[result[21]](String[result[20]](_0xD57A >> 16, _0xD57A >> 8 & 255, _0xD57A & 255));
    }
    switch (_0xD679) {
      case 1:
        _0xD57A = clean(s, originalEvent) << 18 | clean(s, originalEvent + 1) << 12 | clean(s, originalEvent + 2) << 6;
        values[result[21]](String[result[20]](_0xD57A >> 16, _0xD57A >> 8 & 255));
        break;
      case 2:
        _0xD57A = clean(s, originalEvent) << 18 | clean(s, originalEvent + 1) << 12;
        values[result[21]](String[result[20]](_0xD57A >> 16));
        break;
    }
    return values[result[22]](result[1]);
  }
  function toString(object, value) {
    const str = object[result[23]](value);
    if (str > 255) {
      throw result[24];
    }
    return str;
  }
  function pad(str) {
    if (arguments[result[9]] !== 1) {
      throw result[25];
    }
    str = String(str);
    let udataCur;
    let out_byte;
    const values = [];
    const _len = str[result[9]] - str[result[9]] % 3;
    if (str[result[9]] === 0) {
      return str;
    }
    udataCur = 0;
    for (;udataCur < _len; udataCur += 3) {
      out_byte = toString(str, udataCur) << 16 | toString(str, udataCur + 1) << 8 | toString(str, udataCur + 2);
      values[result[21]](writeCallbacks[result[17]](out_byte >> 18));
      values[result[21]](writeCallbacks[result[17]](out_byte >> 12 & 63));
      values[result[21]](writeCallbacks[result[17]](out_byte >> 6 & 63));
      values[result[21]](writeCallbacks[result[17]](out_byte & 63));
    }
    switch (str[result[9]] - _len) {
      case 1:
        out_byte = toString(str, udataCur) << 16;
        values[result[21]](writeCallbacks[result[17]](out_byte >> 18) + writeCallbacks[result[17]](out_byte >> 12 & 63) + padding + padding);
        break;
      case 2:
        out_byte = toString(str, udataCur) << 16 | toString(str, udataCur + 1) << 8;
        values[result[21]](writeCallbacks[result[17]](out_byte >> 18) + writeCallbacks[result[17]](out_byte >> 12 & 63) + writeCallbacks[result[17]](out_byte >> 6 & 63) + padding);
        break;
    }
    return values[result[22]](result[1]);
  }
  /* eslint-enable */
  return {
    escape,
    pad,
  };
}());

const getForts = ({ sw, ne }) => {
  const [fromlat, fromlng] = (sw || '').split(',');
  const [tolat, tolng] = (ne || '').split(',');
  return fetch('https://www.pokemongomap.info/')
    .then((res) => {
      const cookie = res.headers.raw()['set-cookie'][0].replace(/;.*$/, '');
      const form = new FormData();
      form.append('fromlat', fromlat);
      form.append('tolat', tolat);
      form.append('fromlng', fromlng);
      form.append('tolng', tolng);
      form.append('fpoke', 1);
      form.append('fgym', 1);
      return fetch('https://www.pokemongomap.info/includes/uy22ewsd1.php', {
        method: 'post',
        headers: {
          Cookie: cookie,
          Referer: 'https://www.pokemongomap.info/',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: form,
      });
    })
    .then(res => res.json())
    .then((json) => {
      const jqueryscrollzoom = 1.852;
      return Object.entries(json).map(([k, item]) => ({
        gym_team: stringpad.escape(item.g74jsdg),
        confirm: stringpad.escape(item.xgxg35),
        poke_lat: parseFloat(Number(stringpad.escape(item.z3iafj)) / jqueryscrollzoom / 1e6),
        poke_lng: parseFloat(Number(stringpad.escape(item.f24sfvs)) / jqueryscrollzoom / 1e6),
        poke_type: stringpad.escape(item.y74hda),
        poke_id: stringpad.escape(item.zfgs62),
        cleantitle: item.rgqaca,
        poke_title: item.rfs21d,
      }));
    });
};

exports.getForts = getForts;
