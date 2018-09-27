import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Button } from 'react-bootstrap'

import LoginModal from './loginModal'

const CreateUserQuery = gql`
mutation createUser($name: String!) {
  addUser(name: $name) {
    id
    name
  }
}
`

const PublicChannelsQuery = gql`
query GetPublicChannels {
  channels {
    id
    name
  }
}
`

class Channels extends React.Component {
  constructor (props) {
    super(props)
    this.logout = this.logout.bind(this)
    this.auth = this.props.auth
    this.state = { modalIsOpen: false, loggedInUser: this.auth.getProfile() }
    this.sidebarcontroller = this.props.sidebarcontroller
    this.togglesidebar = this.sidebarcontroller.toggle.bind(this.sidebarcontroller)
  }

  openModal () {
    this.setState({ modalIsOpen: true })
  }

  closeModal () {
    this.setState({ modalIsOpen: false })
  }

  handleCreateUser (name) {
    this.props.createUser(name).then(({ data }) => {
      this.auth.setProfile(data.addUser)
      this.setState({ loggedInUser: data.addUser, modalIsOpen: false })
    }).catch(e => {
      console.log(e)
    })
  }

  componentWillUnmount () {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  componentDidMount () {
    this.subscription = this.props.data.subscribeToMore({
      document: gql`
        subscription newChannels {
          channelAdded {
            id
            name
          }
        }
      `,
      variables: {
        subscriptionFilter: {
          isPublic: {
            eq: true
          }
        }
      },
      updateQuery: (prev, { subscriptionData }) => {
        return {
          channels: [
            ...prev.channels,
            subscriptionData.data.channelAdded
          ]
        }
      }
    })
  }

  logout () {
    this.auth.logout()
    this.setState({})
  }

  startLogin () {
    // this.auth.login();
  }

  render () {
    const profile = this.state.loggedInUser
    return (
      <div>
        <LoginModal
          modalIsOpen={this.state.modalIsOpen}
          closeModal={this.closeModal.bind(this)}
          onSubmit={this.handleCreateUser.bind(this)}
        />
        <h3>
          Channels
          <a href='https://darahayes.com'>
            <img
              style={{ float: 'right', width: '30px', height: '30px' }}
              target='_blank'
              src='https://upload.wikimedia.org/wikipedia/commons/1/17/GraphQL_Logo.svg' />
          </a>
        </h3>
        {
          this.props.data.channels
            ? <ul>
              {
                this.props.data.channels.map(edge => (
                  <li key={edge.id}><Link to={`/channels/${edge.id}`} onClick={this.togglesidebar} style={{ color: 'white' }}>{edge.name}</Link></li>
                ))
              }
            </ul> : null
        }
        <Link to='/createChannel' style={{ color: 'white' }}>Create channel</Link>
        {
          !this.auth.loggedIn()
            ? <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px', textAlign: 'center' }}>
              <Button bsSize='large' bsStyle='link' style={{ color: 'white' }} onClick={this.openModal.bind(this)}>Login</Button>
            </div>
            : <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px', textAlign: 'center' }}>
              <div style={{ marginBottom: '5px' }}>
                {profile ? profile.name : ''}
              </div>
              {
                profile
                  ? <div>
                    <img src={profile.picture} style={{ marginBottom: '5px', width: '40px', height: '40px', borderRadius: '20px' }} />
                  </div>
                  : null
              }
              <div onClick={this.logout}>Logout</div>
            </div>
        }
        {
          this.props.data && this.props.data.channels && this.props.data.channels.length > 0
            ? <Redirect to={`/channels/${this.props.data.channels[0].id}`} />
            : null
        }
      </div>
    )
  }
}

const ChannelsWithData = compose(
  graphql(PublicChannelsQuery, {
    options: (props) => {
      return {
        variables: {
          wherePublic: {
            isPublic: {
              eq: true
            }
          },
          orderBy: [
            {
              field: 'name',
              direction: 'ASC'
            }
          ]
        }
      }
    }
  }),
  graphql(CreateUserQuery, {
    props: ({ mutate }) => ({
      createUser: (name) => mutate({ variables: { name: name } })
    })
  })
  // graphql(UpdateUserQuery, {
  //   props: ({ mutate }) => ({
  //     updateUser: (user) => mutate({ variables: { user: user }}),
  //   })
  // })
)(Channels)

export default ChannelsWithData
