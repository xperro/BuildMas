import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Client routes working!' });
});

export default router;