import { expect } from 'chai'

import { Store } from '../src'

class MainStore extends Store {

}

class SubStore extends Store {
  state = { name: '' }

  setName(name) {
    this.setState({ name })
  }
}

const createStore = (initialState, otherStoreInitialState) => {
  const store = new MainStore(initialState)
  store.mount('subStore', new SubStore())
  store.mount('otherStore', new SubStore(otherStoreInitialState))
  return store
}

describe('composition', () => {
  describe('with no initial state', () => {
    it('mounts both substores and exposes them', () => {
      const store = createStore()
      expect(store.state).to.eql({
        subStore: { name: '' },
        otherStore: { name: '' }
      })
    })
  })

  it('passes changes from subStore to main', (done) => {
    const store = createStore()
    store.subscribe(state => {
      expect(state).to.eql({
        subStore: { name: 'foo' },
        otherStore: { name: '' }
      })
      done()
    })
    store.subStore.setName('foo')
  })

  describe('intial state', () => {
    it('is passed to subStore based on namespace', () => {
      const store = createStore({ subStore: { name: 'bar' } })
      expect(store.state).to.eql({
        subStore: { name: 'bar' },
        otherStore: { name: '' }
      })
    })
  })
})
