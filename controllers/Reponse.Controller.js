import ResponseModel from "../models/Reponse.model.js";
import Forms from "../models/forms.model.js";
export const addResponse = async (req, res) => {
  try {
    const dataResponse = req.body;
    if (!dataResponse) {
      return res.status(400).send({
        succes: false,
        message: "merci de remplir les champs",
      });
    }

    const response = await ResponseModel.create(dataResponse);
    const formId = dataResponse.form;
    const form = await Forms.findById(formId);
    if (form) {
      form.addResponse(response._id);
      await form.save();
    }
    res.status(201).send({
      succes: true,
      message: "response added successfully",
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      succes: false,
      message: "An error occurred",
      error,
    });
  }
};
