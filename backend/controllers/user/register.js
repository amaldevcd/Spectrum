const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registerUser = async (req, res) => {
    try{
        console.log(req.body);
        const email = req.body.email;
        if(!email) {
            return res.status(400).json({message: 'Email is required'});
        }
        const oldUser = await User.findOne({email});

        if(oldUser) {
            return res.status(409).json({message: 'User already exists'});
        }
        const encryptedPassword = await bcrypt.hash(req.body.password, 10);

        req.body.password = encryptedPassword;
        let user = await User.create(req.body);
        const token = jwt.sign(
            { user_id: user._id, email},
            process.env.JWT_SECRET,
            {
              expiresIn: "10h",
            }
          );

        user._doc.token = token;
        res.status(200).json(user);
    } catch (error) {
        console.log(error); 
        res.status(500).json({message: 'Something went wrong'});
    }
}


module.exports = { registerUser }