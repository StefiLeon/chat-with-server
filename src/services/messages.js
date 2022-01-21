import Message from '../models/message.js';
import GenericQueries from './genericQueries.js';

export default class MessageService extends GenericQueries{
    constructor(dao){
        super(dao, Message.model);
    }
    
    async getFormattedID(params) {
        let docs = await this.dao.findAll(params, this.model);
        console.log(docs);
        docs = docs.map(doc => {
            doc.id = doc._id;
            doc.author.id = doc.author._id;
            delete doc._id;
            delete doc['author']['_id'];
            delete doc.__v;
            return doc;
        })
        return docs;
    }

    async normalizeData(params) {
        let docs = await this.dao.findAll(params, this.model);
        console.log(docs);
        docs = docs.map(doc=> {
            doc._id = doc._id.toString();
            doc['author']['_id'] = doc['author']['_id'].toString();
            delete doc.__v;
            return doc;
        });
        let normalizedObject = {
            id: 'Messages',
            messages: docs
        }
        return normalizedObject;
    }
}