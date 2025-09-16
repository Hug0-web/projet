const express = require('express');
const mongoose = require('mongoose');
const ContactModel = require('../Model/ContactModel');
const UserModel = require('../Model/UserModel')
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Gestion des contacts
 */

/**
 * @swagger
 * /contact/{id}:
 *   get:
 *     tags: [Users]  
 *     summary: Récupère tous les contacts d’un utilisateur
 *     description: Retourne la liste des contacts liés à l'utilisateur.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des contacts de l'utilisateur.
 *       403:
 *         description: Accès refusé.
 *       404:
 *         description: Utilisateur non trouvé.
 */

router.get('/:id', authMiddleware, async (req, res) => {

    try {

        if (req.user.userId !== req.params.id) {

            return res.status(403).json({ error: 'Accès refusé' });

        }


        const user = await UserModel.findById(req.params.id).populate('contacts');

        

        if (!user) {

            return res.status(404).json({ error: 'Utilisateur non trouvé' });

        }

        res.json(user.contacts);

    } catch(e) {

        res.status(500).json({ error: e.message });

    }

});

/**
 * @swagger
 * /contact/{id}/create:
 *   post:  
 *     tags: [Contacts]  
 *     summary: Crée un nouveau contact pour l'utilisateur
 *     description: Ajoute un contact et l'associe à l'utilisateur passé en paramètre.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - First_Name
 *               - Last_Name
 *               - Phone_Number
 *             properties:
 *               First_Name:
 *                 type: string
 *               Last_Name:
 *                 type: string
 *               Phone_Number:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact créé avec succès
 *       400:
 *         description: Champs requis manquants.
 *       403:
 *         description: Accès refusé.
 */

router.post('/:id/create', authMiddleware, async (req, res) => {

    try {


        const { First_Name, Last_Name, Phone_Number } = req.body;

        if (!First_Name || !Last_Name || !Phone_Number) {

            return res.status(400).json({ error: 'Champs requis manquants' });

        }

        if (req.user.userId !== req.params.id) {

            return res.status(403).json({ error: 'Accès refusé' });

        }

        const contact = await ContactModel.create({ First_Name: First_Name, Last_Name: Last_Name, Phone_Number: Phone_Number, users: req.params.id });

        await UserModel.findByIdAndUpdate(req.params.id, { $push: { contacts: contact._id } }, { new: true });

        const populated = await contact.populate('users');               

        res.status(201).json(populated);

    } catch(e) {

        res.status(500).json({ error: e.message });

    }

});

/**
 * @swagger
 * /contact/{userId}/update/{contactId}:
 *   patch:
 *     tags: [Contacts]  
 *     summary: Met à jour un contact d'un utilisateur
 *     description: Seuls les champs envoyés seront modifiés.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: contactId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               First_Name:
 *                 type: string
 *               Last_Name:
 *                 type: string
 *               Phone_Number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact mis à jour.
 *       403:
 *         description: Accès refusé.
 *       404:
 *         description: Contact non trouvé.
 */

router.patch('/:userId/update/:contactId', authMiddleware, async (req, res) => {
  try {
    const { userId, contactId } = req.params;

    
    if (req.user.userId !== userId) {

        return res.status(403).json({ error: 'Accès refusé' });

    }

    const contact = await ContactModel.findOne({ _id: contactId, users: userId });

    if (!contact) {

        return res.status(404).json({ error: 'Contact non trouvé' });

    }

    
    const updated = await ContactModel.findByIdAndUpdate(contactId, req.body, { new: true, runValidators: true });

    res.status(200).json(updated);

    } catch (e) {

    res.status(500).json({ error: e.message });

    }

});


/**
 * @swagger
 * /contact/{userId}/delete/{contactId}:
 *   delete:
 *     tags: [Contacts]  
 *     summary: Supprime un contact d'un utilisateur
 *     description: Supprime le contact et enlève sa référence dans l'utilisateur.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *       - in: path
 *         name: contactId
 *         required: true
 *     responses:
 *       200:
 *         description: Contact supprimé avec succès
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Contact non trouvé
 */

router.delete('/:userId/delete/:contactId', authMiddleware, async (req, res) => {
  try {

    const { userId, contactId } = req.params;

    if (req.user.userId !== userId) {

        return res.status(403).json({ error: 'Accès refusé' });
      
    }

    const contact = await ContactModel.findOneAndDelete({_id: contactId, users: userId});

    if (!contact) {

        return res.status(404).json({ error: 'Contact non trouvé' });

    }

    await UserModel.findByIdAndUpdate(userId, { $pull: { Contact: contactId } });

    res.status(200).json({ message: 'Contact supprimé avec succès' });

  } catch (e) {

    res.status(500).json({ error: e.message });

  }
});

module.exports = router;

