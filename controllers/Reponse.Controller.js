import ResponseModel from "../models/Reponse.model.js";
import Forms from "../models/forms.model.js";
import { ObjectId } from "mongodb";
import multer from "multer";
import path from "path";
// Configuration  multer pour l emplacement de stockage des fichiers /images....files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads"); //   dossier  uploads= destination des fichiers
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const extension = path.extname(file.originalname);
//     cb(null, file.fieldname + "-" + uniqueSuffix + extension);
//   },
// });

// const upload = multer({ storage }); // Créez une instance multer avec la configuration de stockage

// export const addResponse = async (req, res) => {
//   try {
//     // Utilisez multer pour gérer le téléchargement du fichier
//     upload.single("file")(req, res, async (err) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send({
//           success: false,
//           message: "Erreur lors du téléchargement du fichier",
//         });
//       }

//       const dataResponse = req.body;
//       if (!dataResponse) {
//         return res.status(400).send({
//           success: false,
//           message: "Merci de remplir les champs",
//         });
//       }

//       const response = await ResponseModel.create(dataResponse);

//       // Vérifiez si un fichier a été téléchargé
//       if (req.file) {
//         response.file = {
//           filename: req.file.filename,
//           path: req.file.path,
//           // Ajoutez d'autres informations sur le fichier si nécessaire
//         };
//       }

//       const formId = dataResponse.form;
//       const form = await Forms.findById(formId);
//       if (form) {
//         form.addResponse(response._id);
//         await form.save();
//       }
//       res.status(201).send({
//         success: true,
//         message: "Réponse ajoutée avec succès",
//         response,
//       });
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Une erreur s'est produite",
//       error,
//     });
//   }
// };

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
