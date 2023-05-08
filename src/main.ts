import { createServer } from "node:http";
import { createPubSub, createYoga } from "graphql-yoga";
import { schema } from "./schema";

const pubSub = createPubSub();
const yoga = createYoga({ schema,context:{pubSub:pubSub} });

const server = createServer(yoga);
server.listen(4000, () => {
    console.info(`Server is running on http://localhost:4000/graphql` );
});