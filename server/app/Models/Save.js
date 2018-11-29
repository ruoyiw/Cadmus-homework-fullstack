'use strict'

const Model = use('Model')

class Save extends Model {
    static get primaryKey () {
        return 'saveId'
    }
}

module.exports = Save
