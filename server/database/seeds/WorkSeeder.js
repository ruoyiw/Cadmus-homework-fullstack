'use strict'

/*
|--------------------------------------------------------------------------
| WorkSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')

class WorkSeeder {
  async run () {
    await Factory.model('App/Models/Work').create()
  }
}

module.exports = WorkSeeder
