import React from "react";
import {Meteor} from "meteor/meteor";
import ReactDOM from "react-dom";

import Home from "../imports/ui/Home.jsx";
Meteor.startup(()=>{
  ReactDOM.render(<Home />, document.getElementById("render-target"));
});
