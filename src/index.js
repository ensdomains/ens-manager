import app from './App'
import './css/main.css'
import { setupWeb3} from './api/web3'

window.addEventListener('load', function() {
  setupWeb3()
})

app.render()
