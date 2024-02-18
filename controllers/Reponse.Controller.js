import ResponseModel from "../models/Reponse.model.js";
import Forms from "../models/forms.model.js";
import { ObjectId } from "mongodb";
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

export const updateResponse = async (req, res) => {
  try {
    const idResponse = req.params.id;
    const updateDataResonse = req.body;

    if (!ObjectId.isValid(idResponse)) {
      return res.status(400).send({
        succes: false,
        message: "invalid id format",
      });
    }
    if (Object.keys(updateDataResonse).length === 0) {
      return res.status(400).send({
        success: false,
        message: "Aucune donnée de mise à jour fournie.",
      });
    }

    const UpdatedResponse = await ResponseModel.findOneAndUpdate(
      { _id: idResponse, "answers._id": updateDataResonse._id },
      { $set: { "answers.$.value": updateDataResonse.value } },
      { new: true }
    );

    if (!UpdatedResponse) {
      return res.status(404).send({
        succes: false,
        message: `accune reponse avec id : ${idResponse} trouvé`,
      });
    }

    res.status(200).send({
      succes: true,
      message: "Response updated successfully",
      UpdatedResponse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      succes: false,
      message: "An error occurred",
      error: error,
    });
  }
};
