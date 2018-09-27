import EventEmitter from 'events'

export default class AuthService extends EventEmitter {
  constructor () {
    super()
    this.loggedInUser = null
  }

  setProfile (user) {
    this.loggedInUser = user
    localStorage.setItem('loggedInUser', JSON.stringify(user))
    this.emit('authChange')
  }

  getProfile () {
    return this.loggedInUser || JSON.parse(localStorage.getItem('loggedInUser'))
  }

  logout () {
    this.loggedInUser = null
    localStorage.removeItem('loggedInUser')
    this.emit('authChange')
  }

  loggedIn () {
    // Checks if there is a saved token and it's still valid
    return !!this.getProfile()
  }
}
