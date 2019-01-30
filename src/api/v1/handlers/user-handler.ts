import { auth } from 'firebase-admin';
import { HandlerFunction } from '../../../type-models';
import { DbSandbox } from './../../../utils/db-sandbox';
import { IUserModel } from './../../../db/models';

export class UserHandler {

    public signUser: HandlerFunction<{user : auth.UserRecord}, {user: IUserModel}> = (params, cb) => {
        DbSandbox.signUser(params.user)
            .then((res) => cb(null, {user: res}))
            .catch(err => cb(err, null));
    }

    public getUserProfileData: HandlerFunction<string, {user: IUserModel}> = (uid, cb) => {
        DbSandbox.getUserProfileData(uid)
            .then((res) => cb(null, {user: res}))
            .catch(err => cb(err, null));
    }
}
