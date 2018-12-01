'use strict'

const Schema = use('Schema')

class SaveSchema extends Schema {
  up () {
    this.create('saves', (table) => {
      table.increments()
      table.timestamps()
      table.binary('workId', 36).notNullable().references('workId').inTable('works')
      table.longtext('body')
      table.longtext('notes')
    })
  }

  down () {
    this.drop('saves')
  }
}

module.exports = SaveSchema
