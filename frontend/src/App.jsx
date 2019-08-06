import React from 'react';
import logo from './logo.svg';
import './App.css';
import TaskBoardHeader from './components/TaskBoardHeader';
import TaskList from './components/TaskList';


function App() {
  return (
    <div className="App">
      <TaskBoardHeader />
      <TaskList />
    </div>
  );
}

export default App;
