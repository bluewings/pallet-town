import React, { PropTypes } from 'react';
import Rx from 'rxjs/Rx';
import ApplyStyles from 'helpers/ApplyStyles';

import template from './MapView.pug';
import styles from './MapView.scss';
const s2 = require('s2-geometry').S2;

const naver = window.naver;

const LATLNG = {
  NAVER: new naver.maps.LatLng(37.3595704, 127.105399),
  HOME: new naver.maps.LatLng(37.284928, 126.974248),
};

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: { limitTo: 1000 },
      route: [],
    };
  }

  componentDidMount() {
    const self = this;

    this.inputLimitTo.value = this.state.value.limitTo;

    this.mapContainer.style.height = `${this.mapContainer.offsetWidth * 0.75}px`;

    this.map = new naver.maps.Map(this.mapContainer, {
      center: LATLNG.NAVER,
      zoom: 10,
      minZoom: 10,
      maxZoom: 14,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    });

var level = 15;
        var origin = s2.S2Cell.FromLatLng({
            lat: LATLNG.NAVER._lat,
            lng: LATLNG.NAVER._lng
        }, level);

        console.log('%c-=-=-=- check s2 origin', 'background-color:yellow')
        console.log(origin)
        var quadKey = origin.toHilbertQuadkey();
        console.log('%c-=-=-=- check s2 HilbertQuadkey', 'background-color:yellow')
        console.log(quadKey)

        const cells = []
        cells.push(quadKey)

        var radius = 4;

        var i = 1;

            cells.push(s2.S2Cell.FromFaceIJ(origin.face, [origin.ij[0], origin.ij[1] - i], origin.level)
                .toHilbertQuadkey());
            cells.push(s2.S2Cell.FromFaceIJ(origin.face, [origin.ij[0] - i, origin.ij[1] - i], origin.level)
                .toHilbertQuadkey());
            cells.push(s2.S2Cell.FromFaceIJ(origin.face, [origin.ij[0] - i, origin.ij[1]], origin.level)
                .toHilbertQuadkey());
            cells.push(s2.S2Cell.FromFaceIJ(origin.face, [origin.ij[0], origin.ij[1]], origin.level)
                .toHilbertQuadkey());
            // cells.push(s2.S2Cell.FromFaceIJ(origin.face, [origin.ij[0], origin.ij[1] + i], origin.level)
            //     .toHilbertQuadkey());
            // cells.push(s2.S2Cell.FromFaceIJ(origin.face, [origin.ij[0] - i, origin.ij[1]], origin.level)
            //     .toHilbertQuadkey());
            // cells.push(s2.S2Cell.FromFaceIJ(origin.face, [origin.ij[0] + i, origin.ij[1]], origin.level)
            //     .toHilbertQuadkey());

        if (false) {

        for (var i = 1; i < radius; i++) {
            // cross in middle
            cells.push(s2.S2Cell.FromFaceIJ(origin.face, [origin.ij[0], origin.ij[1] - i], origin.level)
                .toHilbertQuadkey());
            cells.push(s2.S2Cell.FromFaceIJ(origin.face, [origin.ij[0], origin.ij[1] + i], origin.level)
                .toHilbertQuadkey());
            cells.push(s2.S2Cell.FromFaceIJ(origin.face, [origin.ij[0] - i, origin.ij[1]], origin.level)
                .toHilbertQuadkey());
            cells.push(s2.S2Cell.FromFaceIJ(origin.face, [origin.ij[0] + i, origin.ij[1]], origin.level)
                .toHilbertQuadkey());

            for (var j = 1; j < radius; j++) {
                cells.push(s2.S2Cell.FromFaceIJ(origin.face, [origin.ij[0] - j, origin.ij[1] - i], origin.level)
                    .toHilbertQuadkey());
                cells.push(s2.S2Cell.FromFaceIJ(origin.face, [origin.ij[0] + j, origin.ij[1] - i], origin.level)
                    .toHilbertQuadkey());
                cells.push(s2.S2Cell.FromFaceIJ(origin.face, [origin.ij[0] - j, origin.ij[1] + i], origin.level)
                    .toHilbertQuadkey());
                cells.push(s2.S2Cell.FromFaceIJ(origin.face, [origin.ij[0] + j, origin.ij[1] + i], origin.level)
                    .toHilbertQuadkey());
            }
        }
        }

        const rslt = cells.map(s2.toId)
        console.log(rslt)
        const latlngs = rslt.map(s2.idToLatLng)
        console.log(latlngs)




// var polyline
var polyline;
latlngs.reduce((prev, each) => {

  return prev.then((paths) => {
    return new Promise(resolve => {

      setTimeout(function() {

        if (polyline) {
          polyline.setMap(null);
        }
        paths.push(each);

polyline = new naver.maps.Polyline({
    map: self.map,
    path: paths.map(e => {
      return new naver.maps.LatLng(e.lat, e.lng);
    })
});

        resolve(paths);
      }, 100);


    })

  });
  
  
}, Promise.resolve([]));


    // console.log(LATLNG)

    this.props.onPositionChange({
      lat: LATLNG.NAVER._lat,
      lng: LATLNG.NAVER._lng,
    });

    const images = Array.prototype.slice.call(this.mapContainer.querySelectorAll('img'), 0).filter(e => e.width === e.height && e.width === 256);
    if (images[0]) {
      images[0].parentElement.parentElement.className = 'tile-container';
    }

    // console.log(images)


    // console.log(this.mapContainer.querySelector('img').offsetWidth)


    const listener = naver.maps.Event.addListener(this.map, 'payload', () => {
        // console.log(pano.getPanoId());
        // naver.maps.Event.removeListener(listener);

      console.log('%cmap load done!!!');
    });

    const pointer = new naver.maps.Marker({
      position: LATLNG.NAVER,
      map: self.map,
      icon: {
        content: '<img src="/svg/pointer.svg" width="36"  />',
        size: new naver.maps.Size(36, 36),
        anchor: new naver.maps.Point(18, 36),
      },
    });

    pointer.setDraggable(true);

    // cons


    naver.maps.Event.addListener(pointer, 'dragend', (event) => {
      // console.log('pointer dragend')
      // console.log(event.coord);


      self.props.onPositionChange({
        lat: event.coord._lat,
        lng: event.coord._lng,
      });

      // new naver.maps.Marker({
      //   position: new naver.maps.LatLng(event.coord.y, event.coord.x),
      //   map: self.map,
      //     // icon: { content: '<img src="/svg/pointer.svg" width="30" style="background:yellow" />' },
      // });
    });

    window.addEventListener('resize', () => {
      self.mapContainer.style.height = `${self.wrap.offsetWidth * 0.75}px`;
      self.map.setSize(new naver.maps.Size(self.wrap.offsetWidth, self.mapContainer.offsetHeight));
    }, true);

    this.marker = {};

    this.polyline = new naver.maps.Polyline({
      map: self.map,
      route: [],
      clickable: true,
      strokeColor: '#0075FF',
      strokeOpacity: 1,
      strokeWeight: 4,
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
    });

    naver.maps.Event.addListener(this.map, 'click', (event) => {
      new naver.maps.Marker({
        position: new naver.maps.LatLng(event.coord.y, event.coord.x),
        map: self.map,
          // icon: { content: '<img src="/svg/pointer.svg" width="30" style="background:yellow" />' },
      });
    });

    naver.maps.Event.addListener(this.map, 'dragend', (event) => {
      console.log('dragend detected');

      return;

      const bounds = self.map.getBounds();
      console.log(bounds);
      const sw = [bounds._sw._lat, bounds._sw._lng];
      const ne = [bounds._ne._lat, bounds._ne._lng];
      fetch(`/api/forts?sw=${sw.join(',')}&ne=${ne.join(',')}`)
      .then(response => response.json())
      .then((forts) => {
        console.log('%c got data', 'background-color:yellow');
        forts.forEach((fort) => {
          if (!self.forts) {
            self.forts = {};
          }

          if (self.forts[fort.poke_id]) {
            return;
          }

          self.forts[fort.poke_id] = fort;

          let icon = 'razz-berry.svg';


          if (fort.poke_type === '2') {
            icon = 'new.svg';
          } else if (fort.poke_type === '1') {
            icon = 'pokestop.svg';
          }


          console.log(fort);
          if (icon) {
            new naver.maps.Marker({
              position: new naver.maps.LatLng(fort.poke_lat, fort.poke_lng),
              map: self.map,
              icon: {
                content: `<img src="/svg/${icon}" width="36" class="marker"/>`,

                size: new naver.maps.Size(36, 36),
                anchor: new naver.maps.Point(18, 36),

              },
            });
          }
        });
      });
    });


    // init stream
    const observables = [];
    self.observer = (type, payload) => {
      observables.forEach((observer) => { observer.next({ type, payload }); });
    };
    this.stream = Rx.Observable.create((observer) => {
      observables.push(observer);
      return () => {
        const index = observables.indexOf(observer);
        if (index > -1) {
          observables.splice(index, 1);
        }
      };
    });

    // 경로찾기 시작
    this.stream
      .filter(e => e.type === 'routestart')
      .map(e => e.payload)
      .subscribe(({ point }) => {
        self.start = point.id;
        // 시작 마커 표시
        if (self.marker.start) {
          self.marker.start.setMap(null);
        }
        if (self.marker.moving) {
          self.marker.moving.setMap(null);
        }
        self.marker.start = new naver.maps.Marker({
          position: point.latlng,
          map: self.map,
          icon: { content: '<div class="marker-start"></div>' },
        });
      });

    // 경로찾기 이동
    this.stream
      .filter(e => e.type === 'routemove')
      .map(e => e.payload)
      .subscribe(({ route, point }) => {
        // 이동선 표시
        self.polyline.setPath(route.map(e => e.latlng));
        if (self.marker.end) {
          const oldMarker = self.marker.end;
          setTimeout(() => { oldMarker.setMap(null); }, 0);
        }
        // 종료 마커 표시
        self.marker.end = new naver.maps.Marker({
          position: point.latlng,
          map: self.map,
          icon: { content: '<div class="marker-end"></div>' },
        });
        // 지도중심 이동
        self.map.morph(point.latlng);
      });

    // 경로찾기 종료
    this.stream
      .filter(e => e.type === 'routeend')
      .map(e => e.payload)
      .subscribe(({ route, info }) => {
        // 경로변경 알림
        if (info.start === self.start) {
          self.setState({ route });
          self.props.onRouteChange(info);
          delete self.start;
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    // frame changes
    if (this.props.frame !== nextProps.frame) {
      if (this.marker.moving) {
        const oldMarker = this.marker.moving;
        setTimeout(() => { oldMarker.setMap(null); }, 0);
      }
      if (this.state.route[nextProps.frame]) {
        this.marker.moving = new naver.maps.Marker({
          position: this.state.route[nextProps.frame].latlng,
          map: this.map,
          icon: { content: '<div class="marker-moving"></div>' },
        });
      }
    }
    // panorama id changes
    if (this.props.panoId !== nextProps.panoId) {
      // this.getRoute(nextProps.panoId, nextProps.limitTo);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.customs) {
      this.customs.forEach((each) => {
        each.setMap(null);
      });
    }
    this.customs = [];
    const self = this;

    this.props.markers.forEach((each) => {
      console.log(each);
      self.customs.push(new naver.maps.Marker({
        position: new naver.maps.LatLng(each.lat, each.lng),
        map: self.map,
        // icon: { content: '<div class="marker-moving"></div>' },
      }));
    });
    // console.log(this.props.markers)
  }


  handleValueChange(type, event) {
    const value = type === 'limitTo' ? (parseInt(event.target.value, 10) || 0) : event.target.value;
    this.setState({
      value: Object.assign(this.state.value, {
        [type]: value,
      }),
    });
  }

  handleSearchClick = (event) => {
    const self = this;
    event.preventDefault();
    naver.maps.Service.geocode({
      address: this.state.value.address,
    }, (status, response) => {
      if (status === naver.maps.Service.Status.ERROR) {
        alert('naver.maps.Service.Status.ERROR');
        self.inputAddress.select();
        return;
      }
      self.inputAddress.value = '';
      const { result: { items } } = response;
      if (items && items.length > 0) {
        self.map.setCenter(new naver.maps.LatLng(items[0].point.y, items[0].point.x));
      }
    });
  }

  render() {
    return template.call(this);
  }
}

MapView.propTypes = {
  panoId: PropTypes.string,
  limitTo: PropTypes.number,
  frame: PropTypes.number.isRequired,
  markers: PropTypes.array.isRequired,
  onRouteChange: PropTypes.func.isRequired,
  onPositionChange: PropTypes.func.isRequired,
};

MapView.defaultProps = {
  frame: 0,
  markers: [],
  onRouteChange: () => {},
  onPositionChange: () => {},
};

export default ApplyStyles(styles)(MapView);
