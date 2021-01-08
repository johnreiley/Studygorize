// import logo from './logo.svg';
import { Component } from 'react';
import './App.css';

class App extends Component {
  onSubmit = (e) => {
    e.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <div className="App-content">
          <div className="row">
            <div className="App-header">
              <h1 className="theme-font text-light text-uppercase">Studygorize Party</h1>
            </div>
          </div>
          <div className="row">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="roomCodeInput" className="text-uppercase text-light">Room Code</label>
                <input type="text" id="roomCodeInput" className="form-control" maxLength="4" placeholder="enter 4-letter code" />
              </div>
              <div className="form-group">
                <label htmlFor="nameInput" className="text-uppercase text-light">Name</label>
                <input type="text" id="nameInput" className="form-control" maxLength="12" placeholder="enter your name" />
              </div>
              <button type="submit" id="joinBtn" className="btn btn-light text-uppercase">Join</button>
            </form>
          </div>
          <div className="row">
            <footer className="text-light text-center">
              Create your own Studygorize account at
              <strong><a className="text-light" href="https://studygorize.web.app" target="_blank"> studygorize.web.app</a></strong>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
