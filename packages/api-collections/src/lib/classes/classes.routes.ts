import { Router } from 'express';
import { createCrudRouter, validate } from '@inithium/api-core';
import { classesService } from './classes.service.js';
import { CreateClassSchema, UpdateClassSchema } from './classes.validation.js';

const router = Router();

router.post('/upsert', validate(CreateClassSchema), async (req, res, next) => {
  try {
    const record = await classesService.upsertByJackrabbitId(req.body);
    res.status(200).json(record);
  } catch (err) {
    next(err);
  }
});

router.get('/filters', async (_req, res, next) => {
  try {
    const options = await classesService.findFilterOptions();
    res.status(200).json(options);
  } catch (err) {
    next(err);
  }
});

router.get('/category/:category', async (req, res, next) => {
  try {
    const records = await classesService.findByCategory(req.params.category);
    res.status(200).json(records);
  } catch (err) {
    next(err);
  }
});

router.get('/open', async (_req, res, next) => {
  try {
    const records = await classesService.findWithOpenSpots();
    res.status(200).json(records);
  } catch (err) {
    next(err);
  }
});

const crudRouter = createCrudRouter(classesService, {
  onCreate: CreateClassSchema,
  onUpdate: UpdateClassSchema,
  forcePagination: true,
  search: { fields: ['name'] },
  filterableFields: ['status'],
  anyOfFilter: { queryParam: 'category', fields: ['category1', 'category2', 'category3'] },
  dateRangeFilter: { startField: 'start_date', endField: 'end_date' },
});

router.use(crudRouter);

export const classesRouter = router;