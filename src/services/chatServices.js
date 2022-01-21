import Dao from '../models/dao.js';
import AuthorService from './authors.js';
import MessageService from './messages.js';

const dao = new Dao();

export const authorService = new AuthorService(dao);
export const messageService = new MessageService(dao);