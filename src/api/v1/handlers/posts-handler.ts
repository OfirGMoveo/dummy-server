import { HandlerFunction } from '../../../type-models';
import { DbSandbox, SortOptions, PageOptions } from './../../../utils/db-sandbox';

export class PostsHandler {

    public getPosts: HandlerFunction<PageOptions, Array<any>> = (params, cb) => {
        DbSandbox.getPosts(params)
            .then((res) => cb(null, res))
            .catch(err => cb(err, null));
    }

    public getPostsTags: HandlerFunction<{sort: SortOptions, page: PageOptions}, Array<any>> = (params, cb) => {
        DbSandbox.getPostsTags(params.page, params.sort)
            .then((res) => cb(null, res))
            .catch(err => cb(err, null));
    }
}
