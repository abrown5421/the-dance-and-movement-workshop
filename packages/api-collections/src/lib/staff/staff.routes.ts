import { Router } from 'express';
import { createCrudRouter } from '@inithium/api-core';
import { staffService } from './staff.service.js';
import { CreateStaffSchema, UpdateStaffSchema } from './staff.validators.js';

const router = Router();

const crudRouter = createCrudRouter(staffService, {
  onCreate: CreateStaffSchema,
  onUpdate: UpdateStaffSchema,
  forcePagination: true,
});

router.use(crudRouter);

export const staffRouter = router;