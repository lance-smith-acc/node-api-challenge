const express = require('express');
const Project = require('./helpers/projectModel');
const Action = require('./helpers/actionModel')
const router = express.Router();

// Endpoints
// Gets all projects
router.get("/", (req,res) => {
    const {projects} = req.query;
    Project.get(projects)
        .then(pro => {
            res.status(200).json(pro);
        })
    .catch(err => {
        console.log(err);
        rse.status(500).json({
            message:"The information could not be retrieved."
        })
    }
    )
})

// Gets projects by id
router.get("/:id", (req,res) => {
    const {id} = req.params;
    Project.get(id)
    .then(pro => {
        res.status(200).json(pro);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({errMessage:'The projects could not be retrieved.' })
        });
})

// gets actions by project id
router.get("/:id/actions", (req,res) => {
    const {id} = req.params;
    Project.getProjectActions(id)
    .then(act => {
        res.status(200).json(act);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({errMessage:'The actions could not be retrieved.' })
        });
})

// gets actions by action id
router.get("/:id/actions/:actid", (req,res) => {
    const id = req.params.id;
    const actID = req.params.actid
    Project.getProjectActions(id)
    .then(a => {
        res.status(200).json(a[actID-1]);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({errMessage:'The action information could not be retrieved.' })
        });
})


// Posts new post
router.post("/", (req,res) => {
    const projInfo = req.body;

    if(!projInfo.name || !projInfo.description){
        res.status(400).json({errorMessage:"Please provide name and description for the project."})
    }
    else {
      Project.insert(projInfo)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({errMessage:'There was an error while saving the project to the database' })
        });
    }
    
})

// Posts new action by project id
router.post("/:id/actions", (req,res) => {
    const actionInfo = {...req.body, project_id:req.params.id};

    if(!actionInfo.description || !actionInfo.notes){
        res.status(400).json({errorMessage:"Please provide a description and notes for the action."})
    }
    else {
      Action.insert(actionInfo)
        .then(post => {
          if(!post){
            res.status(404).json({errorMessage:"The project with the specified ID does not exist."})
          }
          else {
            res.status(201).json(post);
          }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({errMessage:'There was an error while saving the action to the database' })
        });
    }
    
})

// deletes project by id
router.delete("/:id", (req,res) => {
  const {id} = req.params;

  Project.remove(id)
      .then(post => {
          if (post > 0) {
              res.status(200).json({ message: "The project has been removed" });
          } else {
              res.status(404).json({ message: "The project with the specified ID does not exist." });
          }
      })
      .catch(err => {
          console.log(err)
          res.status(500).json({errMessage:'The post could not be removed' })
      });
})

// deletes action by id
router.delete("/:id/actions/:actid", (req,res) => {
  const id = req.params.id;
    const actID = req.params.actid

  Project.getProjectActions(id)
      .then(post => {
          const actionID = post[actID-1].id;
          Action.remove(actionID)
          .then(act => {
              if (act > 0) {
              res.status(200).json({ message: "The action has been removed" });
          } else {
              res.status(404).json({ message: "The action with the specified ID does not exist." });
          }
          })
          .catch(err => {
          console.log(err)
          res.status(500).json({errMessage:'The post could not be removed' })
      });
      })
})

// updates project by id
router.put("/:id", (req,res) => {
  const {id} = req.params;
  const projInfo = req.body;

    if(!projInfo.name || !projInfo.description){
        res.status(400).json({errorMessage:"Please provide name and description for the project."})
    }
    else {
      Project.update(id, projInfo)
        .then(post => {
          if(!post){
            res.status(404).json({errorMessage:"The project with the specified ID does not exist."})
          }
          else {
            res.status(201).json(post);
          }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({errMessage:'There was an error while saving the project to the database' })
        });
    }
  })

// changes actions by id
router.put("/:id/actions/:actid", (req,res) => {
  const {id} = req.params;
  const actID = req.params.actid
  const actionInfo = {...req.body, project_id:id};

Project.getProjectActions(id)
    .then(post => {
        const actionID = post[actID-1].id;
      Action.update(actionID, actionInfo)
        .then(a => {
          if(!a){
            res.status(404).json({errorMessage:"The action with the specified ID does not exist."})
          }
          else {
            res.status(201).json(a);
          }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({errMessage:'There was an error while saving the project to the database' })
        });
    })
  })


module.exports = router;
// export default server; ES2015 Modules

