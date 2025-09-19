import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('can be imported', () => {
    expect(App).toBeDefined()
  })

  it('is a function', () => {
    expect(typeof App).toBe('function')
  })

  it('exists', () => {
    expect(App).toBeTruthy()
  })
})
