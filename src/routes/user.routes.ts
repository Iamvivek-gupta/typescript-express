import { Router, Request, Response } from 'express';
import User from '../models/user.model';

const router = Router();

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

router.get('/users/:id', async (req:Request, res: Response) => {
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