const router = require("express").Router();
const isAuthenticated = require("../middleware/isAuthenticated")

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

const authRoutes = require("./auth.routes")
router.use("/auth", authRoutes)

const todosRoutes = require("./todo.routes")
router.use("/todos", isAuthenticated, todosRoutes)

module.exports = router;
