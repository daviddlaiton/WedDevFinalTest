import { Meteor } from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import { HTTP } from "meteor/http";
import fetch from "node-fetch";
import { check } from "meteor/check";

Meteor.methods({
    "routes.getSchedules"(filAgency,filRoute) {
        check(filAgency, String);
        check(filRoute, String);
        let arr = filAgency.split("/");
        let agency = arr[1];

        let rArr = filRoute .split("/");
        let route = rArr[1];
        return fetch("http://webservices.nextbus.com/service/publicJSONFeed?command=schedule&a="+ agency + "&r=" + route)
            .then((r) => {
                return r.json();
            }).then((data) => { return data; });
    },

    "routes.getRoute"(filAgency) {
        check(filAgency, String);
        let arr = filAgency.split("/");
        let agency = arr[1];
        return fetch("http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a="+agency)
            .then((r) => {
                return r.json();
            }).then((data) => { return data; });
    },

    "agencies.getAll"() {
        return fetch("http://webservices.nextbus.com/service/publicJSONFeed?command=agencyList")
          .then((r) => {
            return r.json();
          }).then((data) => { return data; });
        }
});