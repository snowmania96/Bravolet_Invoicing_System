import Schema from "../model/Schema.js";

export const updateSchema = async (req, res) => {
  try {
    const schema = await Schema.findOne({ name: "InvoiceSchema" });
    if (!schema) {
      return res.status(404).json({ error: "Invoice Schema Not Found" });
    }
    const updatedSchema = await Schema.findOneAndUpdate(
      { name: "InvoiceSchema" },
      req.body,
      { new: true }
    );
    return res.status(200).json({ msg: "Update Invoice Schema Succeed" });
  } catch (err) {
    return res.status(400).json({ error: "Update Invoice Schema Error" });
  }
};

export const getSchema = async (req, res) => {
  try {
    const schema = await Schema.findOne({ name: "InvoiceSchema" });
    if (!schema) {
      const newSchema = await Schema.create({
        name: "InvoiceSchema",
        note: "",
      });
      return res.status(200).json(newSchema);
    }
    return res.status(200).json(schema);
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
