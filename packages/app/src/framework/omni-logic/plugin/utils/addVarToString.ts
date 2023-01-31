import { isArray } from "lodash";

const keysRegEx = /\{(.*?)\}/gm;

function replace(match: string, item: any) {
    return item[match.replace('{', '').replace('}', '')];
}

export const addVarToString = (from: string, to: {
    [x: string]: any
}) => {
    if(isArray(from)) return from;
    const key = from?.replace('{', '').replace('}', '')
    if(to?.hasOwnProperty(key) && typeof to[key] === 'object') return to[key]
    return from.replace(keysRegEx, (match: string) =>
        replace(match, to)
    );
}