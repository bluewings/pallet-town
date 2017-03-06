import React, { PropTypes } from 'react';
import ApplyStyles from 'helpers/ApplyStyles';
import JSONTree from 'react-json-tree';
// components & others
// import Layout from 'components/Layout';
// import InputDateRange from 'components/InputDateRange';
import { Link } from 'react-router';

// import numeral from 'numeral';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import MapView from './components/MapView';
import io from 'socket.io-client';

// jsx, styles
import template from './Home.pug';
import styles from './Home.scss';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      splitView: true,
      route: {},
      nmapOptions: { frame: 0 },
      username: '@gmail.com',
      password: '',
      position: '',
      mapObjects: {},
      markers: [],
    };
    this.callbacks = {};
  }

  emit(type, payload, callback) {
    const self = this;
    const reqid = Math.random().toString(36).substr(-6);

    if (!self.socket) {
      return
    }
    if (typeof callback === 'function') {
      self.callbacks[reqid] = callback;
    }

console.log(type, payload)

    return new Promise((resolve, reject) => {
      self.socket.emit(type, {
        reqid,
        payload,

      });
    });
  }

  componentDidMount() {
// localhost로 연결한다.

    const self = this;
    this.inputUsername.value = this.state.username;
    this.inputPassword.value = this.state.password;

    const socket = io();

    this.socket = socket;
    socket.on('callback', ({ reqid, payload }) => {
  // console.log('>>> get callback');
  // console.log(arguments)
  // console.log(val1, val2)
      if (self.callbacks[reqid]) {
        self.callbacks[reqid](payload);
        delete self.callbacks[reqid];
      }
    });


    socket.emit('msg', 'hey now!');
    console.log('>>>>>>>');
// 서버에서 news 이벤트가 일어날 때 데이터를 받는다.
    socket.on('news',

  (data) => {
    console.log('%c socket Data', 'background-color:yellow');
    // console.
    console.log(data);
  // //서버에 my other event 이벤트를 보낸다.
  //   socket.emit('my other event',
  //     { my: 'data' });
  });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.splitView !== this.state.splitView) {
      window.dispatchEvent(new Event('resize'));
    }


// var socket =
//   io.connect('http://localhost:3001');

// // 서버에서 news 이벤트가 일어날 때 데이터를 받는다.
// socket.on('news',

//   function (data) {
//     console.log('%c socket Data', 'background-color:yellow');
//     // console.
//     console.log(data);
//   // //서버에 my other event 이벤트를 보낸다.
//   //   socket.emit('my other event',
//   //     { my: 'data' });
// });
  }

  handleLoginClick = () => {
    const { username, password, position } = this.state;
    const [lat, lng] = (position || '').split(',');
    this.emit('login', {
      username, password, position: { lat, lng },
    }, (response) => {
      console.log('>>> get result from callback', response);
    });
  }

  handlePositionChange = ({ lat, lng }) => {
    console.log('position change');

    this.setState({
      position: `${lat},${lng}`,
    });
    if (lat && lng) {
      this.emit('setposition', { lat, lng }, (inventory) => {
        // self.setState({ inventory });
      });
    }
  }


  handleButtonClick(type, event) {
    const self = this;
    if (type === 'getinventory') {
      this.emit('getinventory', null, (inventory) => {
        self.setState({ inventory });
      });
    }
    if (type === 'getmapobjects') {
      this.emit('getmapobjects', null, (mapObjects) => {
        

        const markers = mapObjects.reduce((prev, curr) => {
          
          curr.catchable_pokemons.forEach(pokemon => {
            prev.push({
              type: 'catchable',
              pokemonId: pokemon.pokemon_id,
              lat: pokemon.latitude,
              lng: pokemon.longitude,
            })
          })
          return prev;
        }, []);

        self.setState({ mapObjects, markers });

        



      });
    }
    // if (type === 'setposition') {
    //   this.emit('setposition', null, (inventory) => {
    //     // self.setState({ inventory });
    //   });
    // }
  }

  handleValueChange(type, event) {
    // console.log(type, event.target.value);
    // console.log(arguments);
    this.setState({
      [type]: event.target.value,
    });
  }

  handleSampleSelect = (sample) => {
    const { panoId, limitTo } = sample;
    this.setState({ nmapOptions: Object.assign({}, this.state.nmapOptions, { panoId, limitTo }) });
  }

  handleRouteChange = (route) => {
    this.setState({ route });
  }

  handleFrameChange = (frame) => {
    this.setState({ nmapOptions: Object.assign({}, this.state.nmapOptions, { frame }) });
  }

  handleToggleViewClick = () => {
    this.setState({
      splitView: !this.state.splitView,
    });
  }

  render() {
    const { markers, nmapOptions, splitView, route: { distance, route } } = this.state;

    return template.call(this, {
      // variables
      distance,
      nmapOptions,
      markers,
      route: route || [],
      inventory: this.state.inventory || {},
      mapObjects: this.state.mapObjects || {},
      // samples: samples.map(e => ({
      //   name: e[2],
      //   panoId: e[0],
      //   limitTo: e[1],
      //   limitToStr: e[1] > 1000 ? `${numeral(e[1] / 1000).format('0,0.0')}km` : `${e[1]}m`,
      // })),
      splitView,
      // components
      DropdownButton,
      MenuItem,
      MapView,
      JSONTree,
    });
  }
}

Home.propTypes = {
  items: PropTypes.array.isRequired,
};

Home.defaultProps = {
  items: [],
};

export default ApplyStyles(styles)(Home);
