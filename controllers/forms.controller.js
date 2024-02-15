import FormField from "../models/formField.model.js";
import FormsModel from "../models/forms.model.js";

export const AddForms = async (req, res) => {
  try {
    const { title, description, formFields, style } = req.body;

    // Création du formulaire
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

    // Création des champs de formulaire associés
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
