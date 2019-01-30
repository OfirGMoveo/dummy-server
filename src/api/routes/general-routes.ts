
import {Router} from 'express';

const generalRouter = Router();
generalRouter.all('/test', (req, res, next) => {
    res.send();
}); 

export { generalRouter };