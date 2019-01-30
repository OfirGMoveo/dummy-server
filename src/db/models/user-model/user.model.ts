import { Schema, model, Document } from 'mongoose';
import { BoundTo, Mesh } from './../../../type-models';
import { StrongSchema, createStrongSchema } from './../../../type-models/mongoose-types';

export interface IUser {
    name: string;
    uid: string;
    email: string;
    level: number;
    favoriteList: Array<Schema.Types.ObjectId>;
    markedList: Array<Schema.Types.ObjectId>;
    meta: Object;
    createdAt: Date; //  timestamps fields
    updatedAt: Date; //  timestamps fields
}

/**
 * schema method implementations here, and will be accessible from I...Model.
 * 'this' refer to the defined model, use 'BoundTo' to reflect it in compile time. 
 */
class UserMethods {
    /**
     * print this doc _id.
     */
    printId: BoundTo<IUserModel> = function() { console.log(this._id); };
    // more methods ...
}

const UserSchema = createStrongSchema(({
    name:           { type: String,   required: true },
    uid:            { type: String,   required: true },
    email:          { type: String,   required: true },
    level:          { type: Number,   default: 1 },
    meta:           { type: Schema.Types.Mixed, default: {} },
    // additional fields
    favoriteList:   { type: [{type: Schema.Types.ObjectId, ref: 'posts'}], default: [] },
    markedList:     { type: [{type: Schema.Types.ObjectId, ref: 'posts'}], default: [] },
} as StrongSchema<IUser>), new UserMethods(), { timestamps: true })

UserSchema.set('toJSON', { transform: function(doc, ret, option) { return ret; }})

export type IUserModel = Mesh<IUser, UserMethods, Document>; 

export const User = model<IUserModel>('users', UserSchema) 


