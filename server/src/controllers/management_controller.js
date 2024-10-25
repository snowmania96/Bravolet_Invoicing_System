import bcrypt from "bcrypt";
import User from "../model/User.js";
import jwt from "jsonwebtoken";

function generateJwtToken(name) {
  return jwt.sign({ name }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
}

export const authAdmins = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(422).json({ message: "Please fill all the fields" });
    }

    const admin = await User.findOne({ name: name, role: "admin" });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      return res.status(200).json({
        name: name,
        token: generateJwtToken(admin.name),
      });
      // console.log(jwt.decode(generateJwtToken(admin._id)));
    } else {
      return res.status(422).json({ message: "Invalid password" });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Incorrect admin name or password" });
  }
};

export const fetchAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");

    return res.status(200).json(admins);
  } catch (error) {
    res.status(422).json({ message: error.message });
  }
};

export const createAdmins = async (req, res) => {
  try {
    const { name, password, contactEmail, phoneNumber, role, address, extra } =
      req.body;
    //  check if all fields are filled
    if (!name || !password) {
      return res.status(422).json({ message: "Please Fill All The Fields." });
    }

    if (role !== "admin") {
      return res.status(422).json({ message: "Have to be admin role" });
    }

    // check if user already created
    const userExist = await User.findOne({ name });
    if (userExist) {
      return res.status(422).json({ message: "User Already Exist." });
    }

    //Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    //add user to db
    const user = await User.create({
      name: name,
      password: hashedPassword,
      contactEmail: contactEmail,
      phoneNumber: phoneNumber,
      role: role,
      address: address,
      extra: extra,
    });

    if (user) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        token: generateJwtToken(user._id),
      });
    } else {
      return res.stattus(422).json({ message: "Login Failed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
