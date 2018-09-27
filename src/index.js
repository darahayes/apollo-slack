import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import client from './util/newApolloClient'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { ApolloProvider } from 'react-apollo'

import CreateChannel from './components/createChannel'
import Messages from './components/messages'
import AuthService from './util/authService'
import SideBarController from './util/sidebarcontroller'

const auth = new AuthService()
const sidebarcontroller = new SideBarController()

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <Router onUpdate={() => window.scrollTo(0, 0)}>
      <App auth={auth} sidebarcontroller={sidebarcontroller}>
        <Switch>
          <Route path='/createChannel' component={CreateChannel} />
          <Route path='/channels/:channelId' render={(props) => <Messages {...props} auth={auth} sidebarcontroller={sidebarcontroller} />} />
        </Switch>
      </App>
    </Router>
  </ApolloProvider>
)

ReactDOM.render(<ApolloApp />, document.getElementById('root'))
registerServiceWorker()
