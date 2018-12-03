'use strict'
const Database = use("Database");
const Work = use("App/Models/Work");
const Save = use("App/Models/Save");

class SaveController {

  /**
   * API endpoint to accept saves payloads over HTTP
   */
  async saving({request}){
    try {
      const requestData = request.all();
      const work = await Work.findBy({ "workId": requestData.workId });
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
  async loading({params}){
      try {
        const workId = params.workId;
        const saves = await Database.table("saves")
        .where("workId", workId).orderBy("id", "desc");
        if (saves.length > 0) {
            return JSON.stringify({
                bodyJSON: saves[0].body,
                notesJSON: saves[0].notes,
                status: "success"
            })
        } else {
            return JSON.stringify({
                bodyJSON: null,
                notesJSON: null,
                status: "success"
            })
        }
      } catch (err) {
        console.log(err)
        return JSON.stringify({
            status: "fail"
        })
      }
  }
}

module.exports = SaveController
