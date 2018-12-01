'use strict'
const Work = use("App/Models/Work");
const Save = use("App/Models/Save");

class SaveController {

  /**
   * API endpoint to accept saves payloads over HTTP
   */
  async saving({request}){

    try {
      const requestData = request.all();
      const work = await Work.findBy({ "workId": requestData.work  });
      const save = new Save();
      save.workId = work.workId;
      save.body = requestData.bodySave;
      save.notes = requestData.notesSave;
      await save.save();
      return JSON.stringify({
        status: "success"
      })
    } catch (err) {
      console.log(err)
      return JSON.stringify({
        status: "fail"
      })
    }
  }

  /**
   * API endpoint to serve the last save for the given Work ID back over HTTP
   */
  async loading({params, response}){
      try {

      } catch (err) {
        console.log(err)

      }

  }

}

module.exports = SaveController
