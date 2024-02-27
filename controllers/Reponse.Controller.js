import ResponseModel from "../models/Reponse.model.js";
import Forms from "../models/forms.model.js";
import { ObjectId } from "mongodb";
import multer from "multer";
import path from "path";
import FormField from "../models/formField.model.js";
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

const storage = (multer.diskStorage = {
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    // cb(null,file.originalname) originale name tetssajel bil esm ili uploada bih user wa9tili ena 7achti beha b date t3 lyoum...bech na3ref images enhii bi4abt
    //.replace(/:/g, "-") kn jit t5dem bil mac mch lezma he4i 5ater y9belha SE par contre m3a windows la
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

//recuperer limage

// export const addResponse = async (req, res) => {
//   try {
//     const dataResponse = req.body;
//     if (!dataResponse) {
//       return res.status(400).send({
//         succes: false,
//         message: "merci de remplir les champs",
//       });
//     }

//     const response = await ResponseModel.create(dataResponse);
//     const formId = dataResponse.form;
//     const form = await Forms.findById(formId);
//     if (form) {
//       form.addResponse(response._id);
//       await form.save();
//     }
//     res.status(201).send({
//       succes: true,
//       message: "response added successfully",
//       response,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       succes: false,
//       message: "An error occurred",
//       error,
//     });
//   }
// };

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
//cloudinary Config
cloudinary.v2.config({
  cloud_name: "dqyyvvwap",
  api_key: "829332458549452",
  api_secret: "F4akaK4kP3eSh4cSjM-36tSbF60",
});
import cloudinary from "cloudinary";
import { getDataUri } from "./../utils/features.js";
import cloudinaryModel from "../models/testcloudinary.model.js";
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
