

import * as admin from 'firebase-admin';
import * as path from 'path';

const PATH_TO_FB_ADMIN_JSON = path.resolve(__dirname, '../../fb-admin/special-ed-firebase-adminsdk.json');

export class FirebaseAdminSandbox {

    private static instance: FirebaseAdminSandbox;

    public static getSingleSandbox() {
        if(this.instance === undefined) {
            this.instance = new FirebaseAdminSandbox();
        } 
        return this.instance;
    }
    public static async createIdTokenFromUid(uid: string) {
        if(this._isInit) {
            return await admin.auth().createCustomToken(uid);
        }

    }
    private static _isInit = false;

    
    private constructor() {
        this._initApp()
    }


    private _requireAdminConfig() {
        const isProd = process.env.NODE_ENV == 'prod';
        let serviceAccount: any;
        if(isProd) {
            serviceAccount = {
                type: 'fbadmin.type',
                project_id: 'fbadmin.project_id',
                private_key_id:'fbadmin.private_key_id',
                private_key: 'fbadmin.private_key',
                client_email: 'fbadmin.client_email',
                client_id: 'fbadmin.client_id',
                auth_uri: 'fbadmin.auth_uri',
                token_uri: 'fbadmin.token_uri',
                auth_provider_x509_cert_url: 'fbadmin.auth_provider_x509_cert_url',
                client_x509_cert_url: 'fbadmin.client_x509_cert_url'
              
            }
        } else {
            serviceAccount = require(PATH_TO_FB_ADMIN_JSON);
        }
        return serviceAccount;
    }
    private _initApp() {
        try {
            const serviceAccount = this._requireAdminConfig();
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: "https://special-ed.firebaseio.com"
            });
            FirebaseAdminSandbox._isInit = true;
        } catch (error) {
            console.log(error)
        }

    }


    async getUserByEmail(email: string): Promise<(admin.auth.UserRecord)> {
        try {
            return await admin.auth().getUserByEmail(email)
        } catch (error) {
            console.log("Error getting user by id:", error);
            throw error;
        }

    }
    async getUserById(uid: string): Promise<(admin.auth.UserRecord)> {
        try {
            return await admin.auth().getUser(uid)
        } catch (error) {
            console.log("Error getting user by id:", error);
            throw error;
        }

    }
    async getAllUsers(): Promise<(admin.auth.UserRecord)[]> {
        const batch = 100;
        let nextPageToken: string;
        let finishRead = false;
        const usersList: (admin.auth.UserRecord)[] = [];
        while(finishRead !== true) {
            try {
                const listUsersResult = await admin.auth().listUsers(batch, nextPageToken);
                usersList.concat(listUsersResult.users);
                if (!listUsersResult.pageToken) { 
                    finishRead = true;
                } else {
                    nextPageToken = listUsersResult.pageToken
                } 
            } catch (error) {
                finishRead = true;     
                console.log("Error listing users:", error);
                throw error;
            }
        }
        return usersList;
    }
    async verifyIdToken(idToken: string): Promise<(admin.auth.DecodedIdToken)> {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken)
            return decodedToken
        } catch (error) {
            console.log("Error verifying idToken:", error);
            throw error;
        }
    }
    async getUserByTokenId(idToken: string): Promise<(admin.auth.UserRecord) | undefined> {
        try {
            const decodedIdToken = await this.verifyIdToken(idToken);
            const user = await this.getUserById(decodedIdToken.uid);
            return user;
        } catch (error) {
            console.log("Error getting user by tokenId:", error);
            throw error;
        }
    }



}