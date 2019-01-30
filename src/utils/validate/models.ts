
export type ValidateFunc = (targetRef: object, fields: string[]) => boolean;

export type ValidateCustomFunc = (...values: any[]) => boolean;


export interface ValidateOptions {
    /** 
     * if set to true, 'validate' method will not throw the errors of failed validation,
     * it will return a result object (ValidateResult).  
     * */
    safe: boolean; 
}

export interface ValidateResult {
    /** 
     * if set to true the target object has passed all validation. 
     * */
    pass: boolean;
    /**
     * if 'pass' is true 'errors' will be undefined (not []).   
     * */
    errors: Array<string>; 
}
