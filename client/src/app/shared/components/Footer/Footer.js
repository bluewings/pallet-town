import React from 'react'
import ApplyStyles from 'helpers/ApplyStyles'

// jsx, styles
import template from './Footer.pug'
import styles from './Footer.scss'

class Footer extends React.Component {
  render () {
    return template.call(this)
  }
}

export default ApplyStyles(styles)(Footer)
