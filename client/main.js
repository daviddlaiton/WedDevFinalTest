import React from "react";
import {Meteor} from "meteor/meteor";
import {Home} from "../imports/ui/Home.jsx";
import ReactDOM from "react-dom";

import './main.html';

Meteor.startup(()=>{
  ReactDOM.render(<Home />, document.getElementById("render-target"));
});
