export * from './lib/assets/index.js';
export * from './lib/pages/index.js';
export * from './lib/users/index.js';
export * from './lib/auth/index.js';
export * from './lib/settings/index.js';
export * from './lib/friends/index.js';
export * from './lib/system-errors/index.js';

export {
  ClassModel,
  classesRouter,
  classesService,
  CreateClassSchema,
  UpdateClassSchema,
  type ClassesService,
  type CreateClassDto,
  type UpdateClassDto
} from './lib/classes/index.js';

export {
  InstructorModel,
  instructorsRouter,
  instructorsService,
  CreateInstructorSchema,
  UpdateInstructorSchema,
  type InstructorsService,
  type CreateInstructorDto,
  type UpdateInstructorDto
} from './lib/instructors/index.js';