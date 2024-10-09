import { Router, Request, Response } from 'express';
//import NodeCache from 'node-cache';
import User from '../models/user.model';

const router = Router();
//const imageCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
const cache = new Map<string, string>();

router.post('/users', async (req: Request, res: Response): Promise<any> => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(201).send(user);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get('/users', async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await User.find();
    console.log(users)
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/users/:id', async (req: Request, res: Response): Promise<any> => {
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

router.post('/cache-image', async (req: Request, res: Response): Promise<any> => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).send({ message: 'Image URL is required' });
    }

    // Cache the image URL with a dynamic key
    const cacheKey = `imageCache|${imageUrl}`;
    console.log(cacheKey);

    // Check if the image URL is already cached

    const cachedUrl = cache.get(cacheKey);
    if (cachedUrl) {
      console.log("from cache itself");
      return res.status(200).send({ imageUrl: cachedUrl });
    }

    cache.set(cacheKey, imageUrl);
    console.log("without cache");
    return res.status(200).send({ imageUrl });
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/users', async (req: Request, res: Response): Promise<any> => {
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