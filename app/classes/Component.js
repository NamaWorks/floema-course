import EventEmitter from 'events'
import each from 'lodash/each'

export default class Component extends EventEmitter {
  constructor ({
    element,
    elements = {}
  }) {
    super()

    this.selector = element
    this.selectorChildren = { ...elements }

    this.create()

    this.addEventListeners()
  }

  create () {
    if (this.selector instanceof window.HTMLElement) {
      this.element = this.selector
    } else {
      this.element = document.querySelector(this.selector)
      console.log(this.element)
    }

    this.elements = {}

    // Iterate over selectorChildren object using lodash's each
    each(this.selectorChildren, (entry, key) => {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
        this.elements[key] = entry
      } else {
        this.elements[key] = document.querySelectorAll(entry)
      }
      console.log(this.elements[key], entry)
    })
  }

  addEventListeners () {
  }

  removeEventListeners () {
  }
}
