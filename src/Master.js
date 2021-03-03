import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import CurrencyDetails from "./DetailsPage/CurrencyDetails";
import App from "./HomePage/App";

export default function Master(props) {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact render={(props) => <App {...props}/>}/>
          <Route path="/details" render={(props) => <CurrencyDetails {...props}/>}/>
        </Switch>
      </div>
    </Router>
  );
}

