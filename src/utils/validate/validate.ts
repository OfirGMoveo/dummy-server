
import { ValidateCustomFunc, ValidateOptions, ValidateResult } from './models';
import { validatorCollection, ValidatorName } from './validators';

class ValidateChain {
    /**
     * enforce only one execution, single call to 'validate' method.
     */
    private used: boolean = false; 
    /**
     * store on each chained call the validator result and error msg.
     */
    private validatorsResultQueue:  Array<[boolean, Array<string>, string]> = [];    
    /**
     * object of which the validators executed on.
     */
    private target: Readonly<object>; 
    /**
     * @example
     *  (T & T & F)  or  (T & T) , this array will be storing [F, T] .
     */ 
    private groupedAccumulatedValidationResult: Array<[boolean, Array<string>]> = [];

    constructor(target: object) { this.target = target }

    // #region - validators access
    public empty: ValidateChainFunc = (fields: string[], errorMsg?: string) => {
        this.pushValidatorResultToQueue('empty', fields, errorMsg);
        return this;
    } 
    public exists: ValidateChainFunc = (fields: string[], errorMsg?: string) => {
        this.pushValidatorResultToQueue('exists', fields, errorMsg);
        return this;
    } 
    public parsedNumber: ValidateChainFunc = (fields: string[], errorMsg?: string) => {
        this.pushValidatorResultToQueue('parsedNumber', fields, errorMsg);
        return this;
    } 
    // #endregion

    // #region - groups operators
    public or() {
        this.reduceValidatorsResults();
        return this;
    }
    // #endregion
 
    /**
     * @description chaining a custom validation function.
     * 
     * @param fields array of fields of the values then will be provided to 'fn'.
     * @param fn custom validation function, it will be provides with the corresponding values to the fields array (same order).
     * @param errorMsg custom error message.
     */
    public custom(fields: string[], fn: ValidateCustomFunc, errorMsg?: string) {
        try {
            const customChainResult = execCustomCainFunc(this.target, fields, fn);
            this.validatorsResultQueue.push([customChainResult, fields, (errorMsg || 'custom validation failed')]);
        } catch (error) {
            this.validatorsResultQueue.push([false, fields, 'custom validation failed']);
        }
        return this;
    }

    /* final execution method */
    public validate(options: ValidateOptions = { safe: false }): ValidateResult {
        if(!this.used) { // run only once.   
            this.used = true; 
            if(this.validatorsResultQueue.length > 0) {
                this.reduceValidatorsResults();
            }
            const finalResult = this.calculateFinalResult();
            
            if(finalResult.overallResult) {
                return { pass: finalResult.overallResult, errors: undefined };
            } else if(options.safe) {
                return { pass: finalResult.overallResult, errors: finalResult.errors };
            } else {
                throw new Error(JSON.stringify(finalResult.errors));
            }
        }
    }

    // #region - internal
    /**
     * reduce the entire validatorsResultQueue to a single boolean value, 
     * implementing 'and' between all the values in the queue.
     * the single value pushed to 'groupedAccumulatedValidationResult' and the 'validatorsResultQueue' cleared.
     */
    private reduceValidatorsResults() {
        let acc = true;
        const errors: Array<string> = [];
        for(let i = 0; i < this.validatorsResultQueue.length; i++) {
            const [result, , errMsg] = this.validatorsResultQueue[i];
            acc = (acc && result);                      // accumulating the result. NOTE: 'acc' can be set to 'result', more clear this way 
            !result ? errors.push(errMsg) : undefined;  // if validation failed storing 'errMsg'                          
        }
        this.groupedAccumulatedValidationResult.push([acc, errors]);        // storing the current reduced result for final calculation.
        this.validatorsResultQueue = []; // this.validatorsResultQueue.splice(0);  // emptying the 'validatorsResultQueue'.
    }

    private pushValidatorResultToQueue(validatorName: ValidatorName, fields: string[], errorMsg?: string) {
        const validator = validatorCollection[validatorName];
        const validatorResult = validator.fn(this.target, fields);
        this.validatorsResultQueue.push([validatorResult, fields, errorMsg || validator.msg]);
    }

    private calculateFinalResult() {
        let overallResult = false; // will be right only for 'or' operator 
        let overallErrors = [];
        for(let i = 0; i < this.groupedAccumulatedValidationResult.length; i++) {
            const [groupedResult, errors] = this.groupedAccumulatedValidationResult[i];
            if(!groupedResult) {
                overallErrors.push(...errors);
            }
            overallResult = overallResult || groupedResult; // TODO : support more boolean operators 
        }
        return { overallResult, errors: overallErrors }
    }
    // #endregion
}

function execCustomCainFunc(target: object, fields: string[], fn: ValidateCustomFunc) {
    const values = fields.map(f => target[f]);
    return fn(...values);
}

interface ValidateChainFunc { (fields: string[], errorMsg?: string): ValidateChain } 

export class Validate { static take(obj: object) { return new ValidateChain(obj); } }