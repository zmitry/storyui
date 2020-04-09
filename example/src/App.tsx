import React from "react";
import logo from "./logo.svg";
import "./App.css";

export function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      {children}
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
