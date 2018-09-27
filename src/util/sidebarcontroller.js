import EventEmitter from 'events'

export default class SideBarController extends EventEmitter {
  toggle () {
    this.emit('toggle')
  }
}
