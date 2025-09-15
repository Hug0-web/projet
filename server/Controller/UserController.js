const express = require('express');
const UserModel = require('../Model/UserModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router;

router.get('/:id', async (req, res) => {

    try {

        const user = await UserModel.findById(req.params.id).populate('Contact');

        if(!user) {

            return res.status(404).json({ error: 'Utilisateur non trouvé' });

        }

        res.status(201).json(user);

    } catch(e) {

        res.status(500).json({ error: e.message });

    }
})

router.post('/register', async (req, res) => {

    try {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({ error: 'Email et mot de passe requis' });

    }

    const exists = await UserModel.findOne({ email });

    if(exists) {

        return res.status(409).json({ error: 'Email déjà utilisé' });

    }

    const user = new UserModel(email, password);

    await user.save();

    res.status(201).json(user);

  } catch (e) {

    res.status(400).json({ error: e.message });

  }

});

router.patch('/:id', async (req, res) => {
    
    try {

        const user = await UserModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true } 
            );

        if(!user) {

            return res.status(404).json({ error: 'Utilisateur non trouvé' });

        }

        res.status(201).json(user);

    } catch(e) {

        res.status(400).json({ error: e.message });

    }

})

router.delete('/:id', async (req,res) => {

    try {

        const user = await UserModel.findByIdAndDelete(req.params.id);

        if(!user) {

            return res.status(404).json({ error: 'Utilisateur non trouvé' });

        }

    } catch(e) {

        res.status(500).json({ error: e.message });

    }

})


export default router