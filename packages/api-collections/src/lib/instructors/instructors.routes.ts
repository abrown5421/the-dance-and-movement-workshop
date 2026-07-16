import { Router } from 'express';
import { createCrudRouter, validate } from '@inithium/api-core';
import { instructorsService } from './instructors.service.js';
import { CreateInstructorSchema, UpdateInstructorSchema } from './instructors.validators.js';

const router = Router();

router.post('/upsert', validate(CreateInstructorSchema), async (req, res, next) => {
  try {
    const record = await instructorsService.upsertByJackrabbitId(req.body);
    res.status(200).json(record);
  } catch (err) {
    next(err);
  }
});

router.get('/filters', async (_req, res, next) => {
  try {
    const options = await instructorsService.findFilterOptions();
    res.status(200).json(options);
  } catch (err) {
    next(err);
  }
});

router.get('/position/:position', async (req, res, next) => {
  try {
    const records = await instructorsService.findByPosition(req.params.position);
    res.status(200).json(records);
  } catch (err) {
    next(err);
  }
});

router.get('/active', async (_req, res, next) => {
  try {
    const records = await instructorsService.findActiveInstructors();
    res.status(200).json(records);
  } catch (err) {
    next(err);
  }
});

const crudRouter = createCrudRouter(instructorsService, {
  onCreate: CreateInstructorSchema,
  onUpdate: UpdateInstructorSchema,
  forcePagination: true,
  search: { fields: ['firstName', 'lastName', 'email'] },
  filterableFields: ['status', 'orgID', 'isInstructor'],
  anyOfFilter: { queryParam: 'position', fields: ['position1', 'position2', 'position3'] },
});

router.use(crudRouter);

export const instructorsRouter = router;