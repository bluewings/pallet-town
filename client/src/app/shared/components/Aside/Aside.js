import React from 'react'
import ApplyStyles from 'helpers/ApplyStyles'
import { connect } from 'react-redux'

// components
import { Link } from 'react-router'
import routes from '../../../config/routes'

// jsx, styles
import template from './Aside.pug'
import styles from './Aside.scss'

class Aside extends React.Component {
  constructor (props) {
    super(props)
    const menus = (routes.getRoutes() || []).reduce((prev, curr) => {
      return prev.concat((curr.childRoutes || [])
        .filter((each) => each.options && each.options.name && each.options.aside)
        .map((each) => ({
          name: each.options.name,
          path: (curr.path + each.path).replace(/\/+/g, '/'),
          submenus: each.options.submenus
        })))
    }, [])
    this.state = { menus}
  }

  shouldComponentUpdate (nextProps, nextState) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps)
  }

  render () {
    return template.call(this, { Link})
  }
}

const mapStateToProps = (state) => {
  return {
    templates: state.app.template.items
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplyStyles(styles)(Aside))
