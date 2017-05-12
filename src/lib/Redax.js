export default class Redax {
  constructor(data, render) {
    this.db = data
    this.render = render

  }
  update(newData){
    this.db = newData;
    this.render()
  }
}
