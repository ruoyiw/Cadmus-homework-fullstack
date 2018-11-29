'use strict'

const Schema = use('Schema')

class WorkSchema extends Schema {
  up () {
    this.create('works', (table) => {
      table.binary('workId', 36).unique().notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('works')
  }
}

module.exports = WorkSchema
