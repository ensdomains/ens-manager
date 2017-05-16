export default class Redax {
  constructor(data, render, middleware) {
    this.db = data
    this.render = render
    this.middleware = middleware
  }
  update(newData){
    let data = this.middleware.reduce((state, middleware) => middleware(state), newData)
    this.db = data;
    this.render()
  }
}
