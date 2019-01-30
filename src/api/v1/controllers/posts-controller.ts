import { ControllerFunction } from '../../../type-models';
import { PostsHandler } from './../handlers/posts-handler';

const postsHandler = new PostsHandler();

export class PostsController {

    public getPosts: ControllerFunction = (req, res, next) => {
        
        const page = res.locals.page; // page field was attached to local on validation middleware. 

        postsHandler.getPosts(page, (err, result) => {
            if (err) {
                return next(err);
            }
            return res.json(result);
        })
    }

    public getPostsTags: ControllerFunction = (req, res, next) => {

        const page = res.locals.page; // page field was attached to local on validation middleware. 
        const sort = res.locals.sort; // sort field was attached to local on validation middleware. 

        postsHandler.getPostsTags({page, sort}, (err, result) => {
            if (err) {
                return next(err);
            }
            return res.json(result);
        })
    }
}
