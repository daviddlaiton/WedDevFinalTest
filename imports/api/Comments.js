import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { HTTP } from "meteor/http";
import fetch from "node-fetch";
import { check } from "meteor/check";

export const Comments = new Mongo.Collection("comments");

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish("comments", function tasksPublication() {
        return Comments.find();
    });
}

Meteor.methods({
    "comments.get"(filAgency, filRoute) {
    },

    "comments.add"(commetToAdd, userId, pAgency, pRoute) {
        check(commetToAdd, String);
        check(userId, String);
        check(pAgency, String);
        check(pRoute, String);

        Comments.insert({
            comment :  commetToAdd,
            dateCreated: new Date(),
            user: userId,
            agency : pAgency,
            route : pRoute
        }
        );
    }
});