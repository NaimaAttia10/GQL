import { createPubSub, createSchema } from "graphql-yoga";
import { Subscription } from "./resolvers/Subscription";
import { Query } from "./resolvers/Query";
import { Mutation } from "./resolvers/mutation";
const fs = require("fs");
const path = require("path");

export const up= 'update' ;
export const del = 'delete';
export const add = 'add';

export const pubSub = createPubSub();
export const schema = createSchema({
    typeDefs: fs.readFileSync(
        path.join(__dirname, "schema/schema.graphql"),
        "utf-8"
    ),
    resolvers : {
        Subscription,
        Query,
        Mutation   
    }
})