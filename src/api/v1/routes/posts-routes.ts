import {PostsController} from './../controllers/posts-controller';
import {PostsValidator} from './../validators/posts-validator';
import { Router } from 'express';

const postsController = new PostsController();
const postsValidator = new PostsValidator();

const postsRoutes = Router();

postsRoutes.get('/:skip-:limit', postsValidator.validateGetPosts, postsController.getPosts);
postsRoutes.get('/tags/:skip-:limit,:sortBy,:sortOrder', postsValidator.validateGetPostTags, postsController.getPostsTags);

export { postsRoutes }