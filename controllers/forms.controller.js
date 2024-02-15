import FormField from "../models/formField.model.js";
import FormsModel from "../models/forms.model.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
export const AddForms = async (req, res) => {
  try {
    const { title, description, formFields, style } = req.body;

    if (!title || !description || formFields.length == null) {
      return res.status(500).send({
        succes: false,
        message: "merci de verifier vos champs",
      });
    }

    // Creation du formulaire
    const form = await FormsModel.create({
      title,
      description,
      style: {
        backgroundColor: style.backgroundColor || "#FFFFFF",
        textColor: style.textColor || "#000000",
        fontFamily: style.fontFamily || "Arial",
        fontSize: style.fontSize || 14,
      },
    });

    // Creation des champs de formulaire associés
    const createdFields = await FormField.create(
      formFields.map((field) => ({ ...field, form: form._id }))
    );

    // Association des champs au formulaire
    form.formFields = createdFields.map((field) => field._id);
    await form.save();

    res.status(201).json({ success: true, data: form });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      succes: false,
      message: "An error occurred in adding forms",
      error,
    });
  }
};

export const updateFoms = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const formId = req.params.id;
    const upadateData = req.body;

    if (!ObjectId.isValid(formId)) {
      return res.status(400).send({
        succes: false,
        message: "id de formulaire est non valide",
      });
    }
    const updateForms = await FormsModel.findByIdAndUpdate(
      formId,
      { $set: upadateData },
      { new: true }
    ).session(session);
    if (!updateForms) {
      return res.status(404).send({
        succes: false,
        message: "formulaire non trouvé avec cet id",
      });
    }
    if (upadateData.formFields) {
      //a supprimer just test pour le backend
      if (!Array.isArray(upadateData.formFields)) {
        return res.status(400).send({
          succes: false,
          message: "champs du formulaire founrnie doivent etre un tableaux",
        });
      }
    }

    await Promise.all(
      upadateData.formFields.map(async (field) => {
        try {
          const existingField = await FormField.findById(field._id).session(
            session
          );
          if (!existingField) {
            return res.status(404).send({
              succes: false,
              message: `champ du formulaire avec id ${field._id} n'existe pas`,
            });
          }
          //c'est pour modifier tous les propriete d'un fildes si les valeurs sont presente
          Object.assign(existingField, field);

          await existingField.save();
        } catch (error) {
          return res.status(500).send({
            succes: false,
            message: `Une erreur s'est produite lors de la mise à jour du champ de formulaire avec id ${field._id}`,
            error,
          });
        }
      })
    );
    await session.commitTransaction();
    session.endSession();
    res.status(200).send({
      succes: "true",
      message: "Update formulaire avec succes",
      updateForms,
    });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({
      succes: false,
      message: "une erreur produite lors de l'update du formulaire ",
      error,
    });
  }
};
