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
      // An error will be catched if cannot find such a workId in the Work table
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
        // Select all saves which are linked to this workId, and sort them in descend order
        // based on the save id (equals to a version number)
        const saves = await Database.table("saves")
        .where("workId", workId).orderBy("id", "desc");
        // if one or more saves are found linked to this workId, return the lasted body save and notes save
        if (saves.length > 0) {
            return JSON.stringify({
                bodyJSON: saves[0].body,
                notesJSON: saves[0].notes,
                status: "success"
            })
        } 
        // if no saves are found at the beginning, just return null for body save and notes save
        else {
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
