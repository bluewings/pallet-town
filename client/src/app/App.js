import React, { PropTypes } from 'react';
import normalize from 'normalize.css/normalize.css';
// import bootstrap from 'bootstrap/dist/css/bootstrap.css?root=../node_modules/bootstrap/dist/';
import bootstrap from 'bootstrap/dist/css/bootstrap.css';
// import fontAwesome from 'font-awesome/css/font-awesome.css?root=../node_modules/font-awesome/css/';
import fontAwesome from 'font-awesome/css/font-awesome.css';
import reactSelect from 'react-select/dist/react-select.css';
import commonCss from './styles/common.scss';
import Layout from 'components/Layout';


import codemirror from 'codemirror/lib/codemirror.css';
import 'codemirror/mode/pug/pug';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/yaml/yaml';
import codemirrorMonokai from 'codemirror/theme/monokai.css';
import 'codemirror/theme/bespin.css';
import 'codemirror/theme/elegant.css';
import codemirrorSolarized from 'codemirror/theme/solarized.css';

class App extends React.Component {

  getChildContext() {
    return this.props.context;
  }

  componentWillMount() {
    const { insertCss } = this.props.context;
    this.unmounts = [
      normalize, bootstrap, fontAwesome, reactSelect, commonCss,
      codemirror,
      codemirrorMonokai,
      codemirrorSolarized,
    ].map(css => insertCss(css));
  }

  componentWillUnmount() {
    this.unmounts.forEach((unmount) => unmount());
  }

  render() {
    return (
      <Layout children={this.props.children} />
    );
  }
}

const ContextType = {
  insertCss: PropTypes.func.isRequired,
};

App.propTypes = {
  context: PropTypes.shape(ContextType).isRequired,
  children: PropTypes.element.isRequired,
};

App.childContextTypes = ContextType;

export default App;
