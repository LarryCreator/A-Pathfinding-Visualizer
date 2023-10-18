import logo from './logo.svg';
import './App.css';
import './styles/style.css'
import NavBar from './components/navbar';
import {useState, useEffect} from 'react';
import Button from './components/button.js';
import AlgoVisualizer from './components/algoVisualizer.js';


function App() {
  const [algoState, setAlgoState] = useState(false);
  const [algorithm, setAlgorithm] = useState('a*');
  const [navBarHeight, setNavBarHeight] = useState(0);

  const run = ()=>{
    setAlgoState(true);
  }
  const stopRunning = ()=>{
    setAlgoState(false);
  }
  const getNavBarSize = (size)=>{
    setNavBarHeight(size);
  }
  const clearPath = ()=>{
    const event = new Event('clearPath');//listening on canvasController inside AlgoVisualizer component
    document.dispatchEvent(event);
  }
  const clearBoard = ()=>{
    const event = new Event('clearBoard');//listening on canvasController inside AlgoVisualizer component
    document.dispatchEvent(event);
  }
  const genMaze = ()=>{
    const event = new Event('genMaze');//listening on canvasController inside AlgoVisualizer component
    document.dispatchEvent(event);
  }

  return (
    <div className="App">
      <NavBar passData={getNavBarSize}>
        <Button content='Generate Maze' key='5' func={genMaze}/>
        <Button id='runButton' content='Run Algorithm' key='2' func={run}/>
        <Button content='Clear Path' key='3' func={clearPath}/>
        <Button content='Clear Board' key='4' func={clearBoard}/>
      </NavBar>
      <AlgoVisualizer navBarHeight={navBarHeight} algo={algorithm} shouldRun={algoState} stopRunning={stopRunning}/>
    </div>
  );
}



export default App;
