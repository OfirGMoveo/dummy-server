
import { ValidateFunc } from './models';



export type ValidatorName = 'empty' | 'exists' | 'parsedNumber';

/* -- validators implementations -- */

export const validatorCollection: { [key in ValidatorName]?: {fn: ValidateFunc, msg:  string} } = {
    empty: {
        fn: (targetRef, fields) => {
            let isValid = true;
            for(let i = 0; i < fields.length && isValid; i++) {
                const field = fields[i];
                const value = targetRef[field]
                isValid = (value === undefined || value === null); // true --> validate
            }
            return isValid;
        }, msg: 'error on empty validate'
    },

    parsedNumber: {
        fn: (targetRef, fields) => {
            let isValid = true;
            for(let i = 0; i < fields.length && isValid; i++) {
                const field = fields[i];
                const value = targetRef[field]
                isValid = (Number.parseInt(value) !== NaN); // true --> validate
            }
            return isValid;
        }, msg: 'error on parsedNumber validate'
    },
    
    exists: {
        fn: (targetRef, fields) => {
            let isValid = true;
            for(let i = 0; i < fields.length && isValid; i++) {
                const field = fields[i];
                const value = targetRef[field]
                isValid = (value !== undefined && value !== null); // true --> validate
            }
            return isValid;
        }, msg: 'error on exists validate'
    }
}
