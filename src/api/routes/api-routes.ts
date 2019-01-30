

import { Router } from 'express';
import { postsRoutes } from './../v1/routes/posts-routes';
import { userRoutes } from './../v1/routes/user-routes';

const API_VERSION = 'v1';

const apiRoutes = Router();
apiRoutes.use(`/${API_VERSION}/posts`, postsRoutes);
apiRoutes.use(`/${API_VERSION}/user`, userRoutes);

export { apiRoutes };