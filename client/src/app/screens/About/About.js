import React, { PropTypes } from 'react'
import ApplyStyles from 'helpers/ApplyStyles'

// components & others
import Layout from 'components/Layout'
import { Link } from 'react-router'

// jsx, styles
import template from './About.pug'
import styles from './About.scss'

class About extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    return template.call(this, {Layout, Link})
  }
}

// About.propTypes = {
//   items: PropTypes.array.isRequired
// }

// About.defaultProps = {
//   items: []
// }

export default ApplyStyles(styles)(About)
