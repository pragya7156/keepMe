import React from 'react'
import { Switch, Route, BrowserRouter as Router, Redirect } from 'react-router-dom'
import { header, others } from './Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import ScrollToTop from './components/scrolltotop'
const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 3500,
  offset: "50px",
  texttransform: "lowercase",
  transition: transitions.SCALE,
};

function App() {

  const getRoutes = (header) => {
    return (
      header.map((route, key) => (
        <Route exact path={route.path} component={route.component} key={key} />
      )
      ))
  }

  const getEle = (others) => {
    return (
      others.map((route, key) => (
        <Route exact path={route.path} component={route.component} key={key} />
      )
      ))
  }
  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <Router>
        <ScrollToTop />
        <Switch>
          <Redirect from="/logout" to="/" />
          {getRoutes(header)}
          {getEle(others)}
        </Switch>
      </Router>
    </AlertProvider>
  );
}

export default App;
