import { injectGlobal } from 'styled-components'

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400,400i,600,700,900');
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
    background: #333;
    font-family: "Source Sans Pro";
  }
  p {
    line-height: 1.8em;
  }
  button {
    border: none;
    color: #fff;
    background: $medBlue;
    border: 1px solid $medBlue;
    font-size: 14px;
    padding: 12px 20px;
    border-radius: 3px;
    margin-bottom: 10px;
    width: 100%;
    background: $medBlue;
    transition: 0.2s;
  }
  button:hover {
    background: $medBlueHigh;
    border: 1px solid $medBlueHigh;
    cursor: pointer;
  }
  button:focus {
    outline: 0;
  }
  button.right {
    background: #f00;
    float: right;
  }
  button.danger {
    border: 1px solid #f04848;
    background: #f04848;
  }
  button.danger:hover {
    background: #eb2929;
    border: 1px solid #eb2929;
  }
  input {
    font-size: 14px;
    padding: 12px 15px;
    margin-bottom: 10px;
    border: 1px solid #fff;
    border-radius: 3px;
  }
  input:focus {
    outline: 0;
    border: 1px solid $lightestBlue;
  }
  .input-group input {
    border-radius: 3px 0 0 3px;
    width: calc(100% - 200px);
  }
  .input-group button {
    border-radius: 0 3px 3px 0;
    width: 200px;
  }
  .notification-bar {
    z-index: 100;
  }
`
