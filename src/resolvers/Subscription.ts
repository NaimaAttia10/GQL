import { pubSub} from "../schema"

export const Subscription ={
cvUpdates: {
    subscribe: () => pubSub.subscribe("Updates"),
    resolve: (payload: any) => { return payload }
}}