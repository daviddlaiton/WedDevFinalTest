import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http";
import fetch from "node-fetch";

Meteor.methods({
  "agencies.getAll"() {
    return fetch("http://webservices.nextbus.com/service/publicJSONFeed?command=agencyList")
      .then((r) => {
        return r.json();
      }).then((data) => { return data; });
  }
});