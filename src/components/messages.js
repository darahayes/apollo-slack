import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Emoji from 'react-emoji-render'
import { Glyphicon } from 'react-bootstrap'

const ChannelMessagesQuery = gql`
query GetChannels($channelId: Int!) {
  channel(id: $channelId) {
    id
    name
    messages {
      id
      text
      createdAt
      sender {
        id
        name
      }
    }
  }
}
`

const CreateMessageQuery = gql`
mutation CreateMessage($userId: Int!, $text: String!, $channelId: Int!) {
  addMessage(userId: $userId, text: $text, channelId: $channelId) {
    id
    text
    sender {
      id
      name
    }
  }
}
`

class Messages extends React.Component {
  constructor (props) {
    super(props)
    this.onNewMessageChange = this.onNewMessageChange.bind(this)
    this.submitMessage = this.submitMessage.bind(this)
    this.sidebarcontroller = this.props.sidebarcontroller
    this.toggle = this.sidebarcontroller.toggle.bind(this.sidebarcontroller)
    this.auth = this.props.auth
    this.auth.on('authChange', () => {
      this.setState({ loggedIn: this.auth.loggedIn() })
    })

    this.state = {
      newMessage: '',
      loggedIn: this.auth.loggedIn()
    }
  }

  scrollToBottom () {
    this.messagesEnd && this.messagesEnd.scrollIntoView({ behavior: 'smooth' })
  }

  componentDidUpdate () {
    this.scrollToBottom()
  }

  subscribeToNewMessages () {
    this.subscription = this.props.data.subscribeToMore({
      document: gql`
        subscription messageAddedToChannel($channelId: Int!) {
          messageAddedToChannel(channelId: $channelId) {
            id
            text
            createdAt
            sender {
              id
              name
            }
          }
        }
      `,
      variables: {
        channelId: this.props.match && this.props.match.params ? this.props.match.params.channelId : null
      },
      updateQuery: (prev, { subscriptionData }) => {
        const messages = [
          ...prev.channel.messages,
          subscriptionData.data.messageAddedToChannel
        ]
        return {
          channel: {
            ...prev.channel,
            messages: messages
          }
        }
      }
    })
  }

  componentWillReceiveProps (newProps) {
    if (
      !newProps.data.loading &&
      newProps.data.channel
    ) {
      if (
        !this.props.data.channel ||
        newProps.data.channel.id !== this.props.data.channel.id
      ) {
        // If we change channels, subscribe to the new channel
        this.subscribeToNewMessages()
      }
    }
  }

  onNewMessageChange (e) {
    this.setState({
      newMessage: e.target.value
    })
  }

  submitMessage (e) {
    if (e) {
      e.preventDefault()
    }
    const that = this
    if (this.state.newMessage && this.state.newMessage !== '') {
      this.props.createMessage({
        text: this.state.newMessage,
        channelId: this.props.data.channel.id,
        userId: this.auth.getProfile() ? this.auth.getProfile().id : 1
      }).then(() => {
        that.setState({
          newMessage: ''
        })
      })
    }
  }

  renderMessageInput () {
    if (this.auth.loggedIn()) {
      return (
        <div className='messageInputWrapper'>
          <form onSubmit={this.submitMessage}>
            <button className='btn btn-info' style={{ float: 'right' }} type='submit' onClick={this.submitMessage}>Send!</button>
            <div style={{ overflow: 'hidden' }}>
              <input value={this.state.newMessage} onChange={this.onNewMessageChange} type='textarea' placeholder={`Message ${this.props.data.channel.name}`} className='form-control' />
            </div>
          </form>
        </div>
      )
    }
  }

  render () {
    return this.props.data.channel
      ? (
        <div className='messagePage'>
          <div className='messageHeaderWrapper'>
            <span>
              <Glyphicon className='sidebarToggle' onClick={this.toggle} glyph='menu-hamburger' />
              <h3 className='channelTitle'>{this.props.data.channel.name}</h3>
            </span>
          </div>
          <div className='messageListWrapper'>
            <ul>
              {
                this.props.data.channel.messages.map((message, i) => (
                  <li key={i}>
                    <div className='messageBlock'>
                      <div className='messageContent'>
                        <div className='messageHeader'>
                          {
                            <h6>
                              {
                                message.sender
                                  ? (message.sender.name || message.sender.username)
                                  : 'Anonymous'
                              }
                            </h6>
                          }
                          {
                            <span className='text-muted'>
                              {message.createdAt ? new Date(message.createdAt).toISOString().substr(11, 5) : new Date().toISOString().substr(11, 5)}
                            </span>
                          }
                        </div>
                        <div>
                          <Emoji text={message.text} />
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              }
            </ul>
            <div ref={el => { this.messagesEnd = el }} />
          </div>
          {
            this.renderMessageInput()
          }
        </div>
      ) : <h5>Loading...</h5>
  }
}

const MessagesWithData = compose(
  graphql(ChannelMessagesQuery, {
    options: (props) => {
      const channelId = props.match && props.match.params ? props.match.params.channelId : null
      return {
        variables: {
          channelId,
          messageOrder: [
            {
              field: 'createdAt',
              direction: 'ASC'
            }
          ]
        }
      }
    }
  }),
  graphql(CreateMessageQuery, {
    props: ({ mutate }) => ({
      createMessage: (message) => mutate({ variables: { text: message.text, channelId: message.channelId, userId: message.userId } })
    })
  })
)(Messages)

export default MessagesWithData
