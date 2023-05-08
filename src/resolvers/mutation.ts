import { Skill, context, CV } from "../data/db";
import { GraphQLError } from 'graphql';
import {add, del, up, pubSub} from './../schema'

export const Mutation ={

addCv: (parent: any, args: { input: { skillIds: any; userId: string; name: any; age: any; job: any; }; }, ctx: any, info: any) => {
    let skills: Skill[] = [];
    console.log(args.input);
    for (let id of args.input.skillIds) {
        const result = context.skills.filter(skill => skill.id === id)
        if (result.length === 0) {
            throw new GraphQLError(`Element with id '${id}' not found.`,
            {
                extensions: {
                    http: {
                        status: 404,
                        headers: {
                        "x-custom-header": "Element not found",
                        },
                    },
                }
            });
        }
        skills.concat(result)
    }

    const _user = context.users.find(user => args.input.userId == user.id);
    const cv: CV = {
        id: "cv" + context.cvs.length!,
        name: args.input.name,
        age: args.input.age,
        job: args.input.job,
        skills: skills,
        user: _user!,
    }
    console.log(cv);
    context.cvs.push(cv)
    pubSub.publish(add, { add, cv: cv });

    return cv;
},

updateCv: (parent: any, args: { input: { id: string; name: string; age: number; job: string; skillIds: any; userId: string; }; }, ctx: any, info: any) => {
    let _cv = context.cvs.find(cv => cv.id === args.input.id);
    if (_cv === undefined) {
        throw new GraphQLError(`CV with ID ${args.input.id} not found`,
        {
            extensions: {
                http: {
                    status: 404,
                    headers: {
                    "x-custom-header": "CV not found",
                    },
                },
            }
        });
    }
   
    console.log(_cv);

    const index = context.cvs.indexOf(_cv!);
    _cv!.name = args.input.name;
    _cv!.age = args.input.age;
    _cv!.job = args.input.job;
   
    let skills: Skill[] = [];
    for (let id of args.input.skillIds) {
        const result = context.skills.filter(skill => skill.id === id);
        skills.concat(result);
    }
    _cv!.skills = skills;
    const _user = context.users.find(user => args.input.userId == user.id);
    _cv!.user = _user!;
    context.cvs[index] = _cv!
    pubSub.publish(up, { up, cv: _cv });

    return _cv;
},

deleteCv: (parent: any, args: { id: string; }, ctx: any, info: any) => {
    const _cv = context.cvs.find(cv => cv.id === args.id);
    console.log(_cv);
    if (_cv === undefined) {
        throw new GraphQLError(`CV with ID ${args.id} not found`,
        {
            extensions: {
                http: {
                    status: 404,
                    headers: {
                    "x-custom-header": "Cv not found",
                    },
                },
            }
        });
    }
    const index = context.cvs.indexOf(_cv!);
    context.cvs.splice(index, 1)
    pubSub.publish(del, { del, cv: _cv });
    return true;
}
}