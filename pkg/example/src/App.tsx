import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

export function Header({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState("hello");
  return (
    <header className="App-header" onClick={() => setState(Math.random().toFixed(2))}>
      <img src={logo} className="App-logo" alt="logo" />
      {children}
      {state}
    </header>
  );
}

function App() {
  return (
    <div className="App">
      <Header>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </Header>
    </div>
  );
}

export default App;
