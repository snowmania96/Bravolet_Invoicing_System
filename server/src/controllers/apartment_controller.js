import Apartment from "../model/Apartment.js";

export const createApartment = async (req, res) => {
  try {
    const { name, address, photo, information } = req.body;

    //Check if the fields are filled
    if (!name || !address) {
      return res.status(422).json({ error: "Have to fill required fields" });
    }

    //check if apartment already created
    const apartmentExist = await Apartment.findOne({ name });
    if (apartmentExist) {
      return res.status(422).json({ error: "Already Exist" });
    }

    //Add apartment info to db
    const apartment = await Apartment.create({
      name: name,
      photo: photo,
      address: address,
      information: information,
    });
    if (apartment) {
      res.status(200).json({ msg: "Successfully created." });
    } else {
      return res.status(422).json({ error: "Creation Failed." });
    }
  } catch (err) {
    console.log("Create Apartment Error");
  }
};

export const getApartments = async (req, res) => {
  try {
    const aprtments = await Apartment.find({});
    return res.status(200).json(aprtments);
  } catch (err) {
    console.log("Get Apartments Error");
  }
};

export const getApartmentsForm = async (req, res) => {
  try {
    const apartments = await Apartment.find(
      {},
      { _id: 0, __v: 0, createdAt: 0, updateAt: 0, role: 0 }
    );
    return res.status(200).json(apartments);
  } catch (err) {
    console.log("Get Apartments Form Error");
  }
};

export const deleteApartment = async (req, res) => {
  try {
    //find the apartment to be deleted
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return res.status(404).json({ error: "Apartment not found" });
    }

    //Delete the Apartment
    await Apartment.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Apartment has been deleted" });
  } catch (err) {
    console.log("Delete Apartment Error");
  }
};

export const updateApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) {
      return res.status(404).json({ error: "Apartment Not Found" });
    }
    const updatedApartment = await Apartment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json({ msg: "Update Apartment Succeed" });
  } catch (err) {
    console.log("Update Apartment Error");
  }
};

export const getApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) {
      return res.status(404).json({ msg: "Apartment not found" });
    }
    res.status(200).json(apartment);
  } catch (err) {}
};
