import ResponseModel from "../models/Reponse.model.js";
import Forms from "../models/forms.model.js";
import { ObjectId } from "mongodb";
import multer from "multer";
import path from "path";
import FormField from "../models/formField.model.js";
import cloudinary from "cloudinary";
import { getDataUri } from "./../utils/features.js";
import cloudinaryModel from "../models/testcloudinary.model.js";
const storage = (multer.diskStorage = {
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

// export const updateResponse = async (req, res) => {
//   try {
//     const idResponse = req.params.id;
//     const updateDataResonse = req.body;

//     if (!ObjectId.isValid(idResponse)) {
//       return res.status(400).send({
//         succes: false,
//         message: "invalid id format",
//       });
//     }
//     if (Object.keys(updateDataResonse).length === 0) {
//       return res.status(400).send({
//         success: false,
//         message: "Aucune donnée de mise à jour fournie.",
//       });
//     }

//     const UpdatedResponse = await ResponseModel.findOneAndUpdate(
//       { _id: idResponse, "answers._id": updateDataResonse._id },
//       { $set: { "answers.$.value": updateDataResonse.value } },
//       { new: true }
//     );

//     if (!UpdatedResponse) {
//       return res.status(404).send({
//         succes: false,
//         message: `accune reponse avec id : ${idResponse} trouvé`,
//       });
//     }

//     res.status(200).send({
//       succes: true,
//       message: "Response updated successfully",
//       UpdatedResponse,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       succes: false,
//       message: "An error occurred",
//       error: error,
//     });
//   }
// };
//cloudinary Config
cloudinary.v2.config({
  cloud_name: "dqyyvvwap",
  api_key: "829332458549452",
  api_secret: "F4akaK4kP3eSh4cSjM-36tSbF60",
});

export const cloudinaryTest = async (req, res) => {
  try {
    // const { name } = req.body;
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    await cloudinaryModel.create({
      images: [image],
      // name,
    });

    res.status(201).send({
      success: true,
      message: "cloudinary Created Successfully",
      url: cdb.secure_url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      succes: false,
      message: "somthing was warrning",
    });
  }
};

// export const addResponse = async (req, res) => {
//   try {
//     const dataResponse = req.body;
//     console.log(dataResponse);
//     if (!dataResponse) {
//       return res.status(400).send({
//         success: false,
//         message: "Merci de remplir les champs",
//       });
//     }

//     // Vérifier si la requête contient des images
//     if (req.files && req.files.length > 0) {
//       // Parcourir chaque fichier/image téléchargé
//       for (const file of req.files) {
//         const imageDataUri = getDataUri(file);

//         // Télécharger l'image sur Cloudinary
//         const uploadedImage = await cloudinary.v2.uploader.upload(
//           imageDataUri.content
//         );

//         // Récupérer l'URL de l'image sur Cloudinary
//         const imageUrl = uploadedImage.secure_url;

//         // Récupérer l'ID du champ d'image à partir de la requête
//         const imageFieldId = req.body[file.fieldname];

//         // Rechercher le champ correspondant dans la base de données
//         const imageField = await FormField.findById(imageFieldId);

//         if (imageField && imageField.type === "image") {
//           // Mettre à jour la valeur de l'image dans la réponse avec l'URL de l'image sur Cloudinary
//           const answerWithImage = {
//             field: imageField._id,
//             value: imageUrl,
//           };
//           dataResponse.answers.push(answerWithImage);
//         }
//       }
//     }

//     const response = await ResponseModel.create(dataResponse);
//     const formId = dataResponse.form;
//     const form = await Forms.findById(formId);
//     if (form) {
//       form.addResponse(response._id);
//       await form.save();
//     }
//     res.status(201).send({
//       success: true,
//       message: "Response added successfully",
//       response,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "An error occurred",
//       error,
//     });
//   }
// };
export const addResponse = async (req, res) => {
  try {
    const dataResponse = req.body;
    console.log(dataResponse);
    if (!dataResponse) {
      return res.status(400).send({
        success: false,
        message: "Merci de remplir les champs",
      });
    }

    // Vérifier si la requête contient des images ou des fichiers PDF
    if (req.files && req.files.length > 0) {
      // Parcourir chaque fichier/image téléchargé
      for (const file of req.files) {
        const fileDataUri = getDataUri(file);

        // Vérifier le type de fichier
        const fileType = file.mimetype;
        let uploadedFile;

        if (
          fileType === "image/jpeg" ||
          fileType === "image/png" ||
          fileType === "image/gif" ||
          fileType === "image/bmp"
        ) {
          // Si c'est une image, traitez-la comme avant
          uploadedFile = await cloudinary.uploader.upload(fileDataUri.content);
        } else if (fileType === "application/pdf") {
          // Si c'est un fichier PDF, traitez-le différemment
          uploadedFile = await cloudinary.uploader.upload(file.path, {
            resource_type: "raw",
            format: "pdf",
          });
        }

        // Récupérer l'URL du fichier sur Cloudinary
        const fileUrl = uploadedFile.secure_url;

        // Récupérer l'ID du champ de fichier à partir de la requête
        const fileFieldId = req.body[file.fieldname];

        // Rechercher le champ correspondant dans la base de données
        const fileField = await FormField.findById(fileFieldId);

        if (fileField && fileField.type === "file") {
          // Mettre à jour la valeur du fichier dans la réponse avec l'URL du fichier sur Cloudinary
          const answerWithFile = {
            field: fileField._id,
            value: fileUrl,
          };
          dataResponse.answers.push(answerWithFile);
        }
      }
    }

    const response = await ResponseModel.create(dataResponse);
    const formId = dataResponse.form;
    const form = await Forms.findById(formId);
    if (form) {
      form.addResponse(response._id);
      await form.save();
    }
    res.status(201).send({
      success: true,
      message: "Response added successfully",
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An error occurred",
      error,
    });
  }
};

// export const updateResponse = async (req, res) => {
//   try {
//     const idResponse = req.params.id;
//     const updateDataResponse = req.body;

//     if (!ObjectId.isValid(idResponse)) {
//       return res.status(400).send({
//         success: false,
//         message: "Format d'ID invalide",
//       });
//     }

//     if (Object.keys(updateDataResponse).length === 0) {
//       return res.status(400).send({
//         success: false,
//         message: "Aucune donnée de mise à jour fournie",
//       });
//     }

//     const response = await ResponseModel.findById(idResponse);
//     if (!response) {
//       return res.status(404).send({
//         success: false,
//         message: `Aucune réponse avec l'ID ${idResponse} trouvée`,
//       });
//     }

//     // Vérifier si la requête contient des images ou des fichiers PDF
//     if (req.files && req.files.length > 0) {
//       // Parcourir chaque fichier/image téléchargé
//       for (const file of req.files) {
//         const fileDataUri = getDataUri(file);

//         // Vérifier le type de fichier
//         const fileType = file.mimetype;
//         let uploadedFile;

//         if (
//           fileType === "image/jpeg" ||
//           fileType === "image/png" ||
//           fileType === "image/gif" ||
//           fileType === "image/bmp"
//         ) {
//           // Si c'est une image, traitez-la comme avant
//           uploadedFile = await cloudinary.uploader.upload(fileDataUri.content);
//         } else if (fileType === "application/pdf") {
//           // Si c'est un fichier PDF, traitez-le différemment
//           uploadedFile = await cloudinary.uploader.upload(file.path, {
//             resource_type: "raw",
//             format: "pdf",
//           });
//         }

//         // Récupérer l'URL du fichier sur Cloudinary
//         const fileUrl = uploadedFile.secure_url;

//         // Rechercher le champ correspondant dans la réponse
//         const answer = response.answers.find(
//           (answer) => answer._id.toString() === updateDataResponse._id
//         );

//         if (answer && answer.field.type === "file") {
//           // Supprimer l'ancien fichier de Cloudinary
//           await cloudinary.uploader.destroy(answer.value.public_id);

//           // Mettre à jour la valeur du fichier dans la réponse avec l'URL du nouveau fichier sur Cloudinary
//           answer.value = {
//             public_id: uploadedFile.public_id,
//             url: fileUrl,
//           };
//         }
//       }
//     }

//     // Mettre à jour les autres champs de réponse
//     response.answers.forEach((answer) => {
//       if (answer._id.toString() === updateDataResponse._id) {
//         answer.value = updateDataResponse.value;
//       }
//     });

//     const updatedResponse = await response.save();

//     res.status(200).send({
//       success: true,
//       message: "Réponse mise à jour avec succès",
//       updatedResponse,
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

export const updateResponse = async (req, res) => {
  try {
    const idResponse = req.params.id;
    const updateDataResponse = req.body;
    console.log(updateDataResponse);
    if (!ObjectId.isValid(idResponse)) {
      return res.status(400).send({
        success: false,
        message: "Format d'ID invalide",
      });
    }

    if (Object.keys(updateDataResponse).length === 0) {
      return res.status(400).send({
        success: false,
        message: "Aucune donnée de mise à jour fournie",
      });
    }

    const response = await ResponseModel.findById(idResponse);
    if (!response) {
      return res.status(404).send({
        success: false,
        message: `Aucune réponse avec l'ID ${idResponse} trouvée`,
      });
    }

    // Vérifier si la requête contient des images ou des fichiers PDF
    if (req.files && req.files.length > 0) {
      // Parcourir chaque fichier/image téléchargé
      for (const file of req.files) {
        const fileDataUri = getDataUri(file);

        // Vérifier le type de fichier
        const fileType = file.mimetype;
        let uploadedFile;

        if (
          fileType === "image/jpeg" ||
          fileType === "image/png" ||
          fileType === "image/gif" ||
          fileType === "image/bmp"
        ) {
          // Si c'est une image, utilisez la fonction cloudinaryTest pour la télécharger
          const uploadResult = await cloudinaryTest(req, res); // Appel à la fonction cloudinaryTest
          uploadedFile = {
            public_id: uploadResult.public_id,
            secure_url: uploadResult.url,
          };
        } else if (fileType === "application/pdf") {
          // Si c'est un fichier PDF, traitez-le différemment
          uploadedFile = await cloudinary.uploader.upload(file.path, {
            resource_type: "raw",
            format: "pdf",
          });
        }

        // Récupérer l'URL du fichier sur Cloudinary
        const fileUrl = uploadedFile.secure_url;

        // Rechercher le champ correspondant dans la réponse
        const answer = response.answers.find(
          (answer) => answer._id.toString() === updateDataResponse._id
        );

        if (answer && answer.field.type === "file") {
          // Supprimer l'ancien fichier de Cloudinary
          await cloudinary.uploader.destroy(answer.value.public_id);

          // Mettre à jour la valeur du fichier dans la réponse avec l'URL du nouveau fichier sur Cloudinary
          answer.value = {
            public_id: uploadedFile.public_id,
            // url: updateDataResponse.value,
            url: updateDataResponse.value.url,
          };
        }
      }
    }

    // Mettre à jour les autres champs de réponse
    response.answers.forEach((answer) => {
      if (answer._id.toString() === updateDataResponse._id) {
        answer.value = updateDataResponse.value;
      }
    });

    const updatedResponse = await response.save();

    res.status(200).send({
      success: true,
      message: "Réponse mise à jour avec succès",
      updatedResponse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Une erreur s'est produite",
      error,
    });
  }
};
