
import { ObjectID } from 'mongodb';
import { Post, User, IUserModel, IPostModel } from './../db/models';
import { auth } from 'firebase-admin';

export interface PageOptions { skip: number, limit: number }
export interface SortOptions { by: ('popularity' | 'alfa'), order: 1 | -1 }

export class DbSandbox {

    // #region - posts
    /**
     * @description assume arguments are valid.
     * @returns an array of all posts in the range of [ skip - limit ] documents.
     * */
    public static async getPosts(page?: PageOptions) { 

        const p = (await Post.find())[0]
        p.printId();

        const aggregations = page ? [
            { $skip: page.skip },
            { $limit: page.limit }
        ] : undefined;

        return await (aggregations ? Post.aggregate(aggregations) : Post.find());
    }
    
    /**
     * @description assume arguments are valid.
     * @returns an array of all posts then apply the filter and in the range of [ skip - limit ] documents.
     * */
    public static async getFilteredPosts(filterParams: {}, page?: PageOptions) { 

    }
    
    /**
     * @description assume arguments are valid.
     * @param page paging options
     * @param sort sort options 
     * @returns { Array<{ name: string, count: number }> } 
     *      all the tags in the range of page.skip - page.limit, sorted by 'sort' .
     * */
    public static async getPostsTags(page?: PageOptions, sort?: SortOptions): Promise<Array<{ name: string, count: number }>> {

        let field: string, order: number;
        if(sort) {
            field = (sort.by === 'popularity')? 'count': 'name';
            order = sort.order;
        } 

        const aggregations: any[]= [
            { $unwind: '$tags' },
            { $group : { _id: '$tags' , count: { $sum: 1 } } },
            { $project: {name: '$_id', count: true, _id: 0 } },
        ];
 
        sort? aggregations.push({ $sort: {[field]: order } }) : undefined, 
        page? aggregations.push({ $skip: page.skip }) : undefined,
        page? aggregations.push({ $limit: page.limit }) : undefined

        const tags: Array<{ name: string, count: number }> = await Post.aggregate(aggregations);
        return tags;
    }
    // #endregion

    // #region - user
    /**
     * UseCases : 
     *  * check if the user is new or not (if its the first sign-in add the user to db).
     *  * find the user in authenticated routes.
     * */
    private static async findUserByUID(uid: string) {
        const matchedUser = await User.aggregate([{$match: { _id: uid }}]);
        return matchedUser.length > 0 ? (matchedUser[0] as IUserModel) : undefined;
    }

    private static async createUser(userRecord: auth.UserRecord) {
        const {email, uid, displayName} = userRecord;
        const user = new User({ email, uid, name: (displayName || 'NO_NAME')  });
        return await user.save({});
    }

    public static async signUser(userRecord: auth.UserRecord) {
        let user = await this.findUserByUID(userRecord.uid); 
        if(!user) {
            user = await this.createUser(userRecord);
        }
        return user;
    }

    public static async getUserProfileData(uid: string) {
        const user = await this.findUserByUID(uid); 
        const populatedUser = await user.populate({ path: 'favoriteList markedList', populate: { path: 'author'} }).execPopulate();
        return populatedUser;
    }
    // #endregion


}

