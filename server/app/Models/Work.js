'use strict'

const Model = use('Model')

class Work extends Model {
    static get primaryKey () {
        return 'workId'
    }

    static get incrementing () {
        return false
    }

    saves () {
        return this.hasMany('App/Models/Save')
    }
}

module.exports = Work
