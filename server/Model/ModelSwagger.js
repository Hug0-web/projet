/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Identifiant unique MongoDB
 *         Profile_Picture:
 *           type: string
 *           format: binary
 *           description: Image de profil (URL ou fichier encodé)
 *         First_Name:
 *           type: string
 *         Last_Name:
 *           type: string
 *         Email:
 *           type: string
 *           format: email
 *         Phone_Number:
 *           type: string
 *         Password:
 *           type: string
 *     Contact:
 *       type: object
 *       required:
 *         - First_Name
 *         - Last_Name
 *         - Phone_Number
 *         - user
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unique du contact
 *         First_Name:
 *           type: string
 *           description: Prénom du contact
 *         Last_Name:
 *           type: string
 *           description: Nom du contact
 *         Phone_Number:
 *           type: string
 *           description: Numéro de téléphone
 *         user:
 *           type: string
 *           description: ID de l'utilisateur qui a créé le contact
 */
