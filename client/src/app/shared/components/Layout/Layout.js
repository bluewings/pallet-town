import React, { PropTypes } from 'react'
import ApplyStyles from 'helpers/ApplyStyles'
import { connect } from 'react-redux'

// components
import Header from '../Header'
import Aside from '../Aside'
import Footer from '../Footer'

// jsx, styles
import template from './Layout.pug'
import styles from './Layout.scss'

class Layout extends React.Component {
  render () {
    return template.call(this, {React, Header, Aside, Footer})
  }
}

Layout.propTypes = {
  children: PropTypes.element.isRequired
}

const mapStateToProps = (state) => {
  return {
    showAside: state.app.ui.showAside,
    showEditTools: state.app.ui.showEditTools,
    isTemplateView: state.app.ui.isTemplateView
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplyStyles(styles)(Layout))
