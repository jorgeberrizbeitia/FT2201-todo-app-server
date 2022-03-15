const router = require("express").Router();
const UserModel = require("../models/User.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middleware/isAuthenticated");

// signup
router.post("/signup", async (req, res, next) => {

  const { email, password, username } = req.body

  if (!email || !password || !username) {
    res.status(400).json({ errorMessage: "Llenar todos los campos" })
    return;
  }

  // aqui aplican todos sus validadores de BE

  try {

    // checkear si el usuario ya existe
    const foundUser = await UserModel.findOne({ email })
    if (foundUser) {
      res.status(400).json({ errorMessage: "Usuario ya existe" })
      return;
    }

    // aqui si todo lo anterior va bien, crearemos el usuario
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    await UserModel.create({
      username, 
      email,
      password: hashedPassword
    })

    res.status(201).json()

  } catch(err) {
    next(err)
  }
})

// login
router.post("/login", async (req, res, next) => {

  const { email, password } = req.body

  // BE validations
  if (!email || !password ) {
    res.status(400).json({ errorMessage: "Llenar todos los campos" })
    return;
  }

  // validar las credenciales del usuario
  try {

    const foundUser = await UserModel.findOne({ email })

    if (!foundUser) {
      res.status(401).json({ errorMessage: "Usuario no registrado" })
      return;
    }

    // validacion de contraseña
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password)
    if (!isPasswordCorrect) {
      res.status(401).json({ errorMessage: "contraseña invalida" })
      return;
    }

    // aqui creariamos nuestra sesion.
    // en vez de eso, acá es donde creamos el Token y lo enviamos

    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      name: foundUser.username
    }

    const authToken = jwt.sign(
      payload,
      process.env.TOKEN_SECRET,
      { algorithm: "HS256", expiresIn: "6h" }
    )

    res.status(200).json( { authToken } )

  } catch(err) {
    next(err)
  }

})

router.get("/verify", isAuthenticated, (req, res, next) => {

  // una ruta para verificar si el usuario tiene un token valido cuando vuelva a la pagina

  res.status(200).json()


})

module.exports = router;