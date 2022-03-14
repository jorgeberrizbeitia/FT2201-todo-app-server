const router = require("express").Router();
const TodoModel = require("../models/Todo.model")

// aqui van todas nuestras rutas de todos

router.get("/", async (req, res, next) => {
  try {
    // const response = await TodoModel.find({}, {title: 1})
    const response = await TodoModel.find().select("title")
    res.json(response)
  } catch(err) {
    next(err)
  }
})

router.post("/", async (req, res, next) => {

  const { title, description, isUrgent } = req.body

  try {

    const response = await TodoModel.create({ title, description, isUrgent })
    res.json(response)

  } catch(err) {
    next(err)
  }

})

router.get("/:id", async (req, res, next) => {

  const { id } = req.params

  try {
    const response = await TodoModel.findById(id)
    res.json(response)
  } catch(err) {
    next(err)
  }
})

// Ruta para borrar elementos de la BD
router.delete("/:id", async (req, res, next) => {

  const { id } = req.params

  try {
    await TodoModel.findByIdAndDelete(id)
    res.json("Elemento borrado")
  } catch(err) {
    next(err)
  }
})

// Ruta para modificar elementos
router.patch("/:id", async (req, res, next) => {

  const { id } = req.params
  const { title, description, isUrgent } = req.body

  try {

    await TodoModel.findByIdAndUpdate(id, { title, description, isUrgent })
    res.json("Elemento actualizado")

  } catch(err) {
    next(err)
  }

})



module.exports = router;
