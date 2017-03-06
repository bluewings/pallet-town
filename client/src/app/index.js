import React from 'react';
import App from './App';
import Home from './screens/Home';
// import templateService from 'services/template.service';
// import adSchemaService from 'services/adSchema.service';
// import { fetchTemplates } from 'stores/template.actions';
// import { fetchAdSchemas } from 'stores/adSchema.actions';

// const context = {
//   insertCss: (...styles) => {

//     return
//     const removeCss = styles.map(x => x._insertCss())
//     return () => {
//       removeCss.forEach(f => f())
//     }
//   }
// }

const getRoute = (store, context) => ({
  path: '/',

  component({ children, params }) {
    if (!children) {
      children = <Home />;
    }
    return <App context={context} children={children} />;
  },

  // async onEnter(nextState, transition, callback) {
  //   const [templates, adSchemas] = await Promise.all([
  //     templateService.query(),
  //     adSchemaService.query(),
  //   ]);
  //   store.dispatch(fetchTemplates(templates));
  //   store.dispatch(fetchAdSchemas(adSchemas));
  //   callback();
  // },

  childRoutes: [
    /* eslint-disable global-require */
    require('./screens/About').default.getRoute(store),
    // require('./screens/AdSchema').default.getRoute(store),
    //require('./screens/Templates').default.getRoute(store),
    //require('./screens/Template').default.getRoute(store),
    /* eslint-enable */
  ],
});

export default {
  options: {},
  getRoute,
};

