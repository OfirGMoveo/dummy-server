import { Schema, model, Document } from 'mongoose';
import { BoundTo, Mesh } from './../../../type-models';
import { StrongSchema, createStrongSchema } from './../../../type-models/mongoose-types';


export interface IPost {
    name: string;
    desc: string;
    tags: Array<string>;
    subject: string;
    author: Schema.Types.ObjectId;
    meta: Object;
    createdAt: Date; //  timestamps fields
    updatedAt: Date; //  timestamps fields
}

/**
 * schema method implementations here, and will be accessible from I...Model.
 * 'this' refer to the defined model, use 'BoundTo' to reflect it in compile time. 
 */
class PostMethods {
    /**
     * print this doc _id.
     */
    printId: BoundTo<IPostModel> = function() { console.log(this._id); };
    // more methods ...
}

const PostSchema = createStrongSchema(({
    name:       { type: String,   required: true },
    desc:       { type: String,   required: true },
    tags:       { type: [String], required: true, minlength: 1 },
    subject:    { type: String,   required: true },
    author:     { type: Schema.Types.ObjectId, ref: 'user', required: true },
    meta:       { type: Schema.Types.Mixed,   default: {} }
} as StrongSchema<IPost>), new PostMethods(), { timestamps: true })

PostSchema.set('toJSON', { transform: function(doc, ret, option) { return ret; }})

export type IPostModel = Mesh<IPost, PostMethods, Document>; 

export const Post = model<IPostModel>('posts', PostSchema) 



