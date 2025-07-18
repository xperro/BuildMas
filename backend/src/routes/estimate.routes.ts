import { Router } from 'express';
import * as estimateController from '../controllers/estimate.controller';

const router = Router();

router.get('/', estimateController.getAll);
router.get('/:id', estimateController.getById);
router.post('/', estimateController.create);
router.put('/:id', estimateController.update);
router.delete('/:id', estimateController.remove);

export default router;
