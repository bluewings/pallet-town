const express = require('express');
const url = require('url');
const service = require('./service');

const router = express.Router();

router.get('/', (req, res) => {
  const { sw, ne } = url.parse(req.url, true).query;
  // const query = Object.assign({
  //   sw: '',
  //   ne: '',
  // }, url.parse(req.url, true).query);
  // if (!query.sw) {
  //   query.sw = '37.3521114,127.0960212';
  // }
  // if (!query.ne) {
  //   query.ne = '37.3666857,127.1202012';
  // }


  // query.sw = query.sw.split(',');
  // query.ne = query.ne.split(',');

  service.getForts({ sw, ne })
    .then((items) => {
      res.json(items);
    });

  // console.log('--- req.body ---');
  // console.log(req.body);
  // console.log('--- req.param ---');
  // console.log(req.param);
  // console.log('--- query ---');
  // const query = url.parse(req.url, true).query;
  // sw: [37.3521114, 127.0960212],
  // ne: [37.3666857, 127.1202012],
});

module.exports = router;
