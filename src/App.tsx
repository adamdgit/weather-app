
import Weather from './components/Weather'

function App() {

  return (
    <div className="App">

      <h1>{new Date().toLocaleString("en-AU", {weekday: 'long', day: 'numeric', dayPeriod: 'short'})}</h1>
      <Weather />

    </div>
  )
}

export default App
