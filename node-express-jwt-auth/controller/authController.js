module.exports.signup_get = (req, res) => {
    res.send("Easy sign");
}


module.exports.login_get = (req, res) => {
    res.send("Easy login");
}


module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await Users.create({ email, password });
      res.status(201).json(user);
    }
    catch(err) {
      console.log(err);
      res.status(400).send('error, user not created');
    }
   
  }


module.exports.login_post = (req, res) => {
    const {email, password} = req.body;
    console.log(email + " " + password);
    res.send("Easy post login");
}