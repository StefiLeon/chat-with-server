export default class Author {
    constructor(data) {
        this.data = data;
    }
    static get model() {
        return 'Authors';
    }
    static get schema(){
        return{
            email: {
                type: String,
                required: true,
                unique: true
            },
            nombre: {
                type: String,
                required: true
            },
            apellido: {
                type: String,
                required: true
            },
            edad: {
                type: Number,
                required: true
            },
            alias: {
                type: String,
                default: "Anónimo",
                unique: true
            },
            password: {
                type: String,
                required: true
            }
        }
    }
}