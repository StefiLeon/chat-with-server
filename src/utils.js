import {fileURLToPath} from 'url';
import {dirname} from 'path';
import { normalize, schema } from 'normalizr';

//DIRNAME
const filename= fileURLToPath(import.meta.url);
const __dirname = dirname(filename);
export default __dirname;

//NORMALIZR
export const normalizedMessages = (data) => {
    const authors = new schema.Entity('authors', {}, {idAttribute: '_id'});
    const messages = new schema.Entity('messages', {
        author: authors
    }, {idAttribute: '_id'})
    const parentObject = new schema.Entity('parent', {
        messages: [messages]
    })
    const normalizedObject = normalize(data, parentObject);
    return normalizedObject;
}