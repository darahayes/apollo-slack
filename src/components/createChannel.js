import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class CreateChannel extends React.Component {
  constructor (props) {
    super(props)
    this.addChannel = this.addChannel.bind(this)
    this.onChannelNameChange = this.onChannelNameChange.bind(this)
    this.onIsPublicChanged = this.onIsPublicChanged.bind(this)
    this.state = {
      channel: {
        name: '',
        isPublic: false
      }
    }
  }

  onChannelNameChange (e) {
    this.setState({
      channel: {
        isPublic: this.state.channel.isPublic,
        name: e.target.value
      }
    })
  }

  onIsPublicChanged (e) {
    this.setState({
      channel: {
        name: this.state.channel.name,
        isPublic: e.target.checked
      }
    })
  }

  addChannel (e) {
    if (e) {
      e.preventDefault()
    }
    const that = this
    this.props.addChannel(this.state.channel).then((result) => {
      that.setState({
        channel: {
          name: '',
          isPublic: false
        }
      })
      this.props.history.push(`/channels/${result.data.addChannel.id}`)
    })
  }

  render () {
    return (
      <div style={{ paddingRight: '20px', paddingLeft: '20px' }}>
        <h1>New Channel</h1>
        <form onSubmit={this.addChannel}>
          <button className='btn btn-info' style={{ float: 'right' }} type='button' onClick={this.addChannel}>Create</button>
          <div style={{ overflow: 'hidden' }}>
            <input onChange={this.onChannelNameChange} type='text' placeholder='Channel Name' className='form-control' aria-label='Channel Name' />
          </div>
        </form>
      </div>
    )
  }
}

const CreateChannelQuery = gql`
mutation addChannel($name: String!) {
  addChannel(name: $name) {
    id
    name
  }
}
`

export default graphql(CreateChannelQuery, {
  props: ({ mutate }) => ({
    addChannel: (channel) => mutate({ variables: { name: channel.name } })
  })
})(CreateChannel)
