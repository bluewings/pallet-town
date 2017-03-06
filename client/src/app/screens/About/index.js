import React from 'react';
import About from './About';
// import adSchemaService from 'services/adSchema.service'

const getRoute = store => ({
    // options: {
    //   name: 'AD SCHEMAS',
    //   aside: true
    // },

  path: 'about',

  component({ params }) {
    return <About />;
  },

    // async onEnter (nextState, transition, callback) {
    //   nextState.params.adschemas = await adSchemaService.query()
    //   callback()
    // }
});

export default {
  getRoute,
};
