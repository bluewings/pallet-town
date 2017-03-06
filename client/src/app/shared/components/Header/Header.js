import React from 'react'
import ApplyStyles from 'helpers/ApplyStyles'
import { connect } from 'react-redux'

// actions
import { toggleAside } from 'stores/ui.actions'

// components
import { Link } from 'react-router'

// jsx, styles
import template from './Header.pug'
import styles from './Header.scss'

class Header extends React.Component {
  render () {
    return template.call(this, {Link})
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAside: () => dispatch(toggleAside())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplyStyles(styles)(Header))
