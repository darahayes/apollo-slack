import React from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { Modal, Button, FormGroup, FormControl } from 'react-bootstrap'

const LoginQuery = gql`
mutation Login($cred: LoginUserInput!) {
  loginUser(input: $cred) {
    user {
      id
      username
    }
    token
  }
}
`

const CreateUserQuery = gql`
mutation CreateUser($user: CreateUserInput!) {
  createUser(input: $user) {
    user {
      id
      username
    }
    token
  }
}
`

class LoginModal extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      name: ''
    }
  }

  onNameChanged (e) {
    this.setState({
      name: e.target.value
    })
    console.log(this.state)
  }

  handleSubmit (e) {
    if (e) {
      e.preventDefault()
    }
    const { name } = this.state
    if (name.length > 0) {
      this.props.onSubmit(name)
    }
  }

  render () {
    return (
      <div>
        <Modal show={this.props.modalIsOpen} onHide={this.props.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>What's Your Name?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.handleSubmit}>
              <FormGroup controlId='formBasicText'>
                <FormControl
                  type='text'
                  value={this.state.name}
                  placeholder='Your Name'
                  autoComplete='off'
                  onChange={this.onNameChanged.bind(this)}
                />
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.closeModal}>Close</Button>
            <Button onClick={this.handleSubmit} type='submit'>Submit</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default compose(
  graphql(LoginQuery, {
    props: ({ mutate }) => ({
      login: (cred) => mutate({ variables: { cred: cred } })
    })
  }),
  graphql(CreateUserQuery, {
    props: ({ mutate }) => ({
      createUser: (user) => mutate({ variables: { user: user } })
    })
  })
)(LoginModal)
