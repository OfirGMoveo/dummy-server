import { ControllerFunction } from '../../../type-models';
import { UserHandler } from './../handlers/user-handler';

const userHandler = new UserHandler();

export class UserController {

    public signUser: ControllerFunction = (req, res, next) => {
        const user = req['user'];

        if(!user) { return next(new Error('failed to find user.')); }

        userHandler.signUser({user}, (err, result) => {
            if (err) {
                return next(err);
            }
            return res.status(200).send(result);
        })
    }

    public getUserProfileData: ControllerFunction = (req, res, next) => {
        const user = req['user']; 

        if(!user) { return next(new Error('failed to find user.')); }
        
        userHandler.getUserProfileData(user.uid, (err, result) => {
            if (err) {
                return next(err);
            }
            return res.status(200).send(result);
        })
    }
}
