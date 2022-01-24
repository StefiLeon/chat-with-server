import Author from "../models/author.js";
import GenericQueries from './genericQueries.js';

export default class AuthorService extends GenericQueries {
    constructor(dao) {
        super(dao, Author.model);
    }
    async findByAlias(alias) {
        return this.dao.findOne({alias}, Author.model);
    }
    async findById(id) {
        return this.dao.findOne({id}, Author.model);
    }
}