import { Basics } from "./basics";
import { User } from "./user";

export type Payments = {
    id:number;
    stripeId:string;
    basics: Basics;
    user:User
}