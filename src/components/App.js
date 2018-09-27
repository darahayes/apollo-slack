import '../styles/index.css'
import React from 'react'
import Channels from './channels'
import Sidebar from 'react-sidebar'

const mql = window.matchMedia(`(min-width: 800px)`)

const sideBarStyles = {
  backgroundColor: '#3c2a3b',
  color: 'white',
  width: '300px',
  padding: '15px'
}

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      docked: mql.matches,
      open: false
    }

    this.sidebarcontroller = this.props.sidebarcontroller

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this)
    this.toggleOpen = this.toggleOpen.bind(this)
    this.onSetOpen = this.onSetOpen.bind(this)
    this.sidebarcontroller.on('toggle', this.toggleOpen)
  }

  componentWillMount () {
    mql.addListener(this.mediaQueryChanged)
  }

  componentWillUnmount () {
    mql.removeListener(this.mediaQueryChanged)
  }

  onSetOpen (open) {
    this.setState({ open })
  }

  mediaQueryChanged () {
    this.setState({
      docked: mql.matches,
      open: false
    })
  }

  toggleOpen (ev) {
    this.setState({ open: !this.state.open })

    if (ev) {
      ev.preventDefault()
    }
  }

  renderMainContent () {
    return (
      <div>
        {
          this.props.children
            ? React.Children.toArray(this.props.children)
            : <h3>Select a channel</h3>
        }
      </div>
    )
  }

  render () {
    const sidebar = <Channels sidebarcontroller={this.sidebarcontroller} auth={this.props.auth} />

    const sidebarProps = {
      sidebar,
      docked: this.state.docked,
      open: this.state.open,
      onSetOpen: this.onSetOpen,
      styles: {
        sidebar: sideBarStyles
      }
    }

    return (
      <div className='app'>
        <Sidebar {...sidebarProps} st>
          {this.renderMainContent()}
        </Sidebar>
      </div>
    )
  }
}
