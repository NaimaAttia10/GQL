import {  context } from "../data/db";
import { GraphQLError } from 'graphql';

export const Query ={

hello: () => "Hello World!",
            cvs: (parent: any, args: any, ctx: any, info: any) => {
                return context.cvs;
            },
          
            cv: (parent: any, args: { id: string; }, ctx: any, info: any) => {
                const foundCV = context.cvs.find((cv:any)=>cv.id===args.id);
                if(!foundCV) throw new GraphQLError("CV Not Found !",
                {
                    extensions: {
                        http: {
                            status: 404,
                            headers: {
                            "x-custom-header": "CV Not Found",
                            },
                        },
                    }
                });  
                return context.cvs.find(cv => cv.id === args.id);
            },
           
            getCvSkills: (parent: any, args: { cvid: string; }, ctx: any, info: any) => {
                return context.cvs.find(cv => cv.id === args.cvid)?.skills;
            },

            getCvUsers: (parent: any, args: { cvid: string; }, ctx: any, info: any) => {
                const cV = context.cvs.find(cv => cv.id === args.cvid)
                const user = context.cvs.find(cv => cv.id === args.cvid)?.user
                if (!user) {
                    throw new GraphQLError(`User with ID ${cV?.id} not found`,
                    {
                        extensions: {
                            http: {
                                status: 404,
                                headers: {
                                "x-custom-header": "User not found",
                                },
                            },
                        }
                    });}
                return context.cvs.find(cv => cv.id === args.cvid)?.user;
            }}