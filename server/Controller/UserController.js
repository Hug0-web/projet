const express = require('express');
const UserModel = require('../Model/UserModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]  
 *     summary: Récupère un utilisateur par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Utilisateur non trouvé
 */

router.get('/:id', authMiddleware, async (req, res) => {

    try {

        const user = await UserModel.findById(req.params.id).populate('contacts');

        if(!user) {

            return res.status(404).json({ error: 'Utilisateur non trouvé' });

        }

        res.status(201).json(user);

    } catch(e) {

        res.status(500).json({ error: e.message });

    }
})

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags: [Users]  
 *     summary: Inscription d'un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Email, Password]
 *             properties:
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */

router.post('/register', async (req, res) => {

    try {

    const { Email, Password } = req.body;

    if (!Email || !Password) {

        return res.status(400).json({ error: 'Email et mot de passe requis' });

    }

    const exists = await UserModel.findOne({ Email });

    if(exists) {

        return res.status(409).json({ error: `l'utilisateur existe déjà` });

    }

    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    const user = new UserModel({Email, Password: hashedPassword});

    await user.save();

    res.status(201).json(user);

  } catch(e) {

    res.status(400).json({ error: e.message });

  }

});

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [Users]
 *     summary: Connexion d'un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Email, Password]
 *             properties:
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT renvoyé
 */

router.post('/login', async (req, res) => {
    
    try {

        const { Email, Password } = req.body;

        if (!Email || !Password) {

            return res.status(400).json({ error: 'Email et mot de passe requis' });

        }

        const user = await UserModel.findOne({ Email });

        if (!Email) {

            return res.status(401).json({ error: `l'utilisateur n'existe pas` })

        }

        const passwordMatching = await bcrypt.compare(Password, user.Password);

        if (!passwordMatching) {

            return res.status('401').json({ error: `Identifiants invalides` });

        }

        const token = jwt.sign({ userId: user._id, Email: user.Email, Password: Password}, JWT_SECRET, { expiresIn: '1h' });

        return res.json({ token, user: { id: user._id, email: user.Email } });

    } catch(e) {

        res.status(500).json({ error: e.message });

    }

})

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Met à jour les informations d'un utilisateur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 */

router.patch('/:id', authMiddleware, async (req, res) => {
    
    try {

        const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true } );

        if(!user) {

            return res.status(404).json({ error: 'Utilisateur non trouvé' });

        }

        res.status(201).json(user);

    } catch(e) {

        res.status(400).json({ error: e.message });

    }

})

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Supprime un utilisateur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 */

router.delete('/:id', authMiddleware, async (req,res) => {

    try {

        const user = await UserModel.findByIdAndDelete(req.params.id);

        if(!user) {

            return res.status(404).json({ error: 'Utilisateur non trouvé' });

        }

    } catch(e) {

        res.status(500).json({ error: e.message });

    }

})


module.exports = router;