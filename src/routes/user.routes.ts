import { Router, Request, Response } from 'express';
import NodeCache from 'node-cache';
import User from '../models/user.model';

const router = Router();
const imageCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    console.log(users)
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/users/:id', async (req, res) => {
  try{
    const userId = req.params.id;
    const user = await User.findById(userId);
    if(!user){
      res.status(404).send({message: 'User not found'});
    }

    res.status(200).send(user);
  } catch(error){
    res.status(500).send(error);
  }
});

router.post('/cache-image', async (req, res) =>  {
  try{
    const { imageUrl } = req.body;
    if( !imageUrl ){
      res.status(400).send({ message: 'Image URL is required' });
    }

    // Check if the image URL is already cached
    const cachedUrl = imageCache.get(imageUrl);
    if (cachedUrl) {
      console.log("from cache itself")
      res.status(200).send({ imageUrl: cachedUrl });
    }

    // Cache the image URL
    imageCache.set(imageUrl, imageUrl);
    console.log("without cache");
    res.status(200).send({ imageUrl });
  } catch(err){
    res.status(500).send(err);
  }
});


router.get('/users', async (req, res) => {
  try {
    console.log(req.query.name);
    const users = await User.findOne({name: req.query.name});
    console.log(users)
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;