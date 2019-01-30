
import * as express from 'express';
import { ErrorRequestHandler } from 'express';
import * as bodyParser from 'body-parser'
import './db/mongoose-init'; // apply connection
import { apiRoutes, generalRouter } from './api/routes'
import * as expressValidator from 'express-validator';


// ======================== Entity approach =========================== //


class App {
    public instance : express.Application;
    constructor() {
        this.instance = express();
        this.initAppUsage();
    }

    private initAppUsage() {
        // must be called in this order.
        this.setBodyParser();
        this.setValidator();
        this.setAccessControlHeaders();
        this.setRoutesConnection();
        this.setErrorHandler();
    }

    private setBodyParser() {
        this.instance.use(bodyParser.json());
        this.instance.use(bodyParser.urlencoded({ extended: true }));	
    }

    private setValidator() {
        // this line must be immediately after any of the bodyParser middlewares!
        this.instance.use(expressValidator({
            customValidators: {
                validatePageParams: (skip: string, limit: string) => {
                    return (!skip && !limit) || ((Number.parseInt(skip) != NaN && Number.parseInt(limit) != NaN));
                },
                validateSortParams: (by: string, order: string) => {
                    return (!by && !order) || ((order == '-1' || order == '1') && by != undefined) ;
                }
            }
        })); 
    }

    private setAccessControlHeaders() {
        this.instance.use(function(req, res, next) {
          res.header("Access-Control-Allow-Origin", "*");		
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");		
          next();		
        });

    }

    private setRoutesConnection() {
        this.instance.use('/', generalRouter);
        this.instance.use('/api', apiRoutes);
    }

    private setErrorHandler() {
        // catch not-found 404 and forward to error handler
        this.instance.use(function(req, res, next) {
            const err = new Error('Not Found') as Error & { status: number };
            err.status = 404;
            next(err);
        });
        
        
        // error handler
        this.instance.use(((err, req, res, next) => {
            if (err) {
            const status = 400 || err.status;
            res.status(status).json({error : err.message});
            }
        }) as ErrorRequestHandler);
    }

}

export const app = new App().instance;
