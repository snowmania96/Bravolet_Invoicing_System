import User from "../model/User.js";

export const createGuest = async (req, res) => {
  try {
    const { name, address, vatNumber, phoneNumber, email, extra, role } =
      req.body;

    //Check if the fields are filled
    if (!name) {
      return res.status(422).json({ error: "Have to fill required fields" });
    }

    //check if guest already created
    const guestExist = await User.findOne({ name });
    if (guestExist) {
      return res.status(422).json({ error: "Already Exist" });
    }

    //Add guest info to db
    const guest = await User.create({
      name: name,
      address: address,
      vatNumber: vatNumber,
      phoneNumber: phoneNumber,
      contactEmail: email,
      extra: extra,
      role: role,
    });
    if (guest) {
      return res.status(200).json(guest);
    } else {
      return res.status(422).json({ message: "Creation Failed." });
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getGuests = async (req, res) => {
  try {
    const guests = await User.find({ role: "user" });
    return res.status(200).json(guests);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deleteGuest = async (req, res) => {
  try {
    //find the guest to be deleted
    const guest = await User.findById(req.params.id);

    if (!guest) {
      return res.status(404).json({ error: "guest not found" });
    }

    //Delete the guest
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "guest has been deleted" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateGuest = async (req, res) => {
  try {
    const guest = await User.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ error: "guest Not Found" });
    }
    const updatedguest = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ msg: "Update guest Succeed" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getGuest = async (req, res) => {
  try {
    const guest = await User.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ msg: "guest not found" });
    }
    res.status(200).json(guest);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
