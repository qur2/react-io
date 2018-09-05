import React from 'react'
import {mount} from 'enzyme'
import {withIO} from '../withIO'
import {context} from '../context'
import {of} from 'rxjs'
import {map} from 'rxjs/operators'

describe('withIO', () => {
  it('adds io to props', () => {
    const Component = withIO()(({io}) => <div>{io()}</div>)

    const wrapper = mount(<Component />, {
      context: {io: () => 'io!'},
      childContextTypes: context,
    })

    expect(wrapper.text()).toBe('io!')
  })

  it('adds static io request to props', () => {
    const Component = withIO({
      val: '/path',
    })(({val}) => <div>{val}</div>)

    const wrapper = mount(<Component />, {
      context: {io: (request) => of(request)},
      childContextTypes: context,
    })

    expect(wrapper.text()).toBe('/path')
  })

  it('adds dynamic io request to props', () => {
    const Component = withIO(({path}) => ({
      val: path,
    }))(({val}) => <div>{val}</div>)

    const wrapper = mount(<Component path="/dynamicPath" />, {
      context: {io: (request) => of(request)},
      childContextTypes: context,
    })

    expect(wrapper.text()).toBe('/dynamicPath')
  })

  it('adds observable to props', () => {
    const Component = withIO(({io, path}) => ({
      val: io(path).pipe(map((val) => val + '!')),
    }))(({val}) => <div>{val}</div>)

    const wrapper = mount(<Component path="/dynamicPath" />, {
      context: {io: (request) => of(request)},
      childContextTypes: context,
    })

    expect(wrapper.text()).toBe('/dynamicPath!')
  })
})
