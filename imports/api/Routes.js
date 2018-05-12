import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http";
import fetch from "node-fetch";

Meteor.methods({
    "routes.getSchedules"() {
        return fetch("http://webservices.nextbus.com/service/publicJSONFeed?command=schedule&a=sf-muni&r=N")
            .then((r) => {
                return r.json();
            }).then((data) => { return data; });
    },

    "routes.getAll"(va) {
        console.log(va);
        return fetch("http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a=sf-muni")
            .then((r) => {
                return r.json();
            }).then((data) => { return data; });
    }
});