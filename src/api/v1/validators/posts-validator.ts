import { ValidatorFunction } from '../../../type-models';
import { Validate } from './../../../utils/validate';
import { Request } from 'express';


export class PostsValidator {

    public validateGetPosts: ValidatorFunction = (req, res, next) => {
        const validatePageResult = Validate.take(req.query)
            .empty(['limit', 'skip']).or()
            .parsedNumber(['limit', 'skip'])
            .validate({safe: true});

            console.log(validatePageResult);
        if(validatePageResult.pass) {
            res.locals.page = createPageIfDefinedFromQuery(req)
            next();
        } else {
            next(new Error('Get: /posts - query params invalid.'));
        }

        /*
        req.checkQuery(['limit', 'skip']).optional().isNumeric();

        // query('limit').custom({

        // })
        req.getValidationResult()
            .then(result => {
                if(result.isEmpty()) {
                    const limit = req.query['limit'] || req.params['limit'];
                    const skip = req.query['skip'] || req.params['skip'];
                    res.locals.page = { limit: Number.parseInt(limit), skip: Number.parseInt(skip) }; 
                    next();
                } else {
                    next(new Error('Get: /posts - query params invalid.'))

                }
            })
            .catch((err) => {
                next(err)
            });
        */
    }


    public validateGetPostTags: ValidatorFunction = (req, res, next) => {
        const validatePageResult = Validate.take(req.query)
            .empty(['limit', 'skip']).or()
            .parsedNumber(['limit', 'skip'])
            .validate({safe: true});

        const validateSortResult = Validate.take(req.query)
            .empty(['sortBy', 'sortOrder']).or()
            .exists(['sortBy']).custom(['sortOrder'], (sortOrder) => (sortOrder == '-1' || sortOrder == '1'))
            .validate({safe: true});

        if(validatePageResult.pass) {
            res.locals.page = createPageIfDefinedFromQuery(req);
        } else {
            return next(new Error('Get: /posts/tags - query params invalid.'));
        }
    
        if(validateSortResult.pass) {
            res.locals.sort = createSortIfDefinedFromQuery(req);
        } else {
            return next(new Error('Get: /posts/tags - query params invalid.'));
        }

        /*
        if(parsedLimit != NaN && parsedSkip != NaN ) { // both defined and valid integers
            req.body.page = { limit: parsedLimit, skip: parsedSkip }; 
        } else if(!skip && !limit) {
            req.body.page = undefined; // page undefined returning all the tags 
        } else {
            return next(new Error('Get: /posts/tags - query params invalid.'))
        }

        const sortBy = req.query['sortBy'] || req.params['sortBy'];
        const sortOrder = req.query['sortOrder'] || req.params['sortOrder'];
        if(sortBy && ~['-1','1'].indexOf(sortOrder)) { // sortBy defined sortOrder is '-1' or '1'
            req.body.sort = { by: sortBy, order: Number.parseInt(sortOrder) }; 
        } else if(!sortBy && !sortOrder) {
            req.body.sort = undefined; // sort undefined returning un sorted 
        } else {
            return next(new Error('Get: /posts/tags - query params invalid.'))
        }

        next();
        */
    }
}


function createPageIfDefinedFromQuery(req: Request) {
    const limit = req.query['limit']; //|| req.params['limit'];
    const skip = req.query['skip']; // || req.params['skip'];
    const page = limit && skip ? { limit: Number.parseInt(limit), skip: Number.parseInt(skip) } : undefined; 
    return page;
}
function createSortIfDefinedFromQuery(req: Request) {
    const sortBy = req.query['sortBy']; //|| req.params['limit'];
    const sortOrder = req.query['sortOrder']; // || req.params['skip'];
    const sort = sortBy && sortOrder ? { sortBy, sortOrder: Number.parseInt(sortOrder) } : undefined; 
    return sort;
}