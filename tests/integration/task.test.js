const request = require('supertest');
const httpStatus = require('http-status').status;
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { getBearerToken } = require('../fixture/token.fixture');
const { insertUsers, testUser } = require('../fixture/user.fixture');
const { insertTasks, taskUserDailies, taskUserTodo } = require('../fixture/task.fixture');
const { taskController } = require('../../src/controllers');
const { TASK_TYPE, TASK_STATUS } = require('../../src/constants');

setupTestDB();

describe('[Routes] Task = /api/tasks', () => {
  let bearerToken;
  beforeEach(async () => {
    await insertUsers([testUser]);
    bearerToken = getBearerToken(testUser);
  });

  describe('GET /tasks ', () => {
    it('should return 200 and all tasks', async () => {
      await insertTasks([taskUserDailies, taskUserTodo]);
      const res = await request(app).get('/api/v1/tasks').set('Authorization', bearerToken);
      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ _userId: testUser._id })]));
    });

    it('should return 200 and all dailies tasks', async () => {
      await insertTasks([taskUserDailies, taskUserTodo]);
      const res = await request(app).get('/api/v1/tasks?type=dailies').set('Authorization', bearerToken);
      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(
        expect.arrayContaining([expect.objectContaining({ type: TASK_TYPE.DAILIES, _userId: testUser._id })]),
      );
    });

    it('should not call taskController.getUserTasks if request has taskId in params', async () => {
      await insertTasks([taskUserDailies]);
      await request(app)
        .get('/api/v1/tasks/' + taskUserDailies._id)
        .set('Authorization', bearerToken);

      const spyTaskController = jest.spyOn(taskController, 'getUserTasks');
      expect(spyTaskController).not.toHaveBeenCalled();
    });

    it('should return 401 if unauthorized request', async () => {
      const res = await request(app).get('/api/v1/tasks');
      expect(res.status).toBe(httpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('stack');
      expect(res.body.stack).toMatch(/Please authenticate/i);
    });

    it('should return 400 if has invalid type param', async () => {
      await insertTasks([taskUserDailies, taskUserTodo]);
      const res = await request(app).get('/api/v1/tasks?type=wrongparam').set('Authorization', bearerToken);

      expect(res.status).toBe(httpStatus.BAD_REQUEST);
      expect(res.body).toHaveProperty('stack');
      expect(res.body.stack).toMatch(/type must be one of/i);
    });
  });

  describe('GET /tasks/:taskId ', () => {
    it('should return 200 and task of the user', async () => {
      await insertTasks([taskUserDailies]);
      const res = await request(app).get(`/api/v1/tasks/${taskUserDailies._id}`).set('Authorization', bearerToken);
      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(expect.objectContaining({ _id: taskUserDailies._id, _userId: testUser._id }));
    });

    it('should return 200 and empty task if user has no task', async () => {
      const res = await request(app).get(`/api/v1/tasks/${taskUserDailies._id}`).set('Authorization', bearerToken);
      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual({});
    });

    it('should return 401 if unauthorized request', async () => {
      await insertTasks([taskUserDailies]);
      const res = await request(app).get(`/api/v1/tasks/${taskUserDailies._id}`);
      expect(res.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /tasks ', () => {
    describe('=> create task(dailies) ', () => {
      it('should return 201 and create a new task', async () => {
        const task = {
          name: taskUserDailies.name,
          description: taskUserDailies.description,
          type: taskUserDailies.type,
          frequency: taskUserDailies.frequency,
        };

        const res = await request(app).post('/api/v1/tasks').set('Authorization', bearerToken).send(task);

        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body).toMatchObject({
          ...task,
          _id: expect.any(String),
          _userId: testUser._id,
        });
      });

      it('should return 400 if task body has missing required fields', async () => {
        const task = {
          name: taskUserDailies.name,
          frequency: taskUserDailies.frequency,
        };
        const res = await request(app).post('/api/v1/tasks').set('Authorization', bearerToken).send(task);

        expect(res.status).toBe(httpStatus.BAD_REQUEST);
      });

      it('should return 400 if frequency is not provided', async () => {
        const task = {
          name: taskUserDailies.name,
          description: taskUserDailies.description,
          type: taskUserDailies.type,
        };

        const res = await request(app).post('/api/v1/tasks').set('Authorization', bearerToken).send(task);

        expect(res.status).toBe(httpStatus.BAD_REQUEST);
      });

      it('should return 400 if deadlineDate is provided | does not follow the schema for type dailies', async () => {
        const task = {
          name: taskUserDailies.name,
          description: taskUserDailies.description,
          type: taskUserDailies.type,
          frequency: taskUserDailies.frequency,
          deadlineDate: '2021-12-31',
        };

        const res = await request(app).post('/api/v1/tasks').set('Authorization', bearerToken).send(task);

        expect(res.status).toBe(httpStatus.BAD_REQUEST);
      });
    });

    describe('=> create task(todo) ', () => {
      it('should return 201 and create a new task', async () => {
        const task = {
          name: taskUserTodo.name,
          description: taskUserTodo.description,
          type: taskUserTodo.type,
          deadlineDate: taskUserTodo.deadlineDate,
        };

        const res = await request(app).post('/api/v1/tasks').set('Authorization', bearerToken).send(task);

        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body).toMatchObject({
          ...task,
          _id: expect.any(String),
          _userId: testUser._id,
          deadlineDate: expect.any(String),
        });
      });

      it('should return 400 if task body has missing required fields', async () => {
        const task = {
          name: taskUserTodo.name,
        };
        const res = await request(app).post('/api/v1/tasks').set('Authorization', bearerToken).send(task);

        expect(res.status).toBe(httpStatus.BAD_REQUEST);
      });

      it('should return 400 if frequency is provided | does not follow the schema for type todo', async () => {
        const task = {
          name: taskUserTodo.name,
          description: taskUserTodo.description,
          type: taskUserTodo.type,
          frequency: 'frequency',
          deadlineDate: '2021-12-31',
        };

        const res = await request(app).post('/api/v1/tasks').set('Authorization', bearerToken).send(task);
        expect(res.status).toBe(httpStatus.BAD_REQUEST);
      });
    });

    it('should return 401 if unauthorized request', async () => {
      const res = await request(app).post(`/api/v1/tasks`);
      expect(res.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('PUT /tasks/:taskId ', () => {
    it('should return 200 and update task of the user', async () => {
      await insertTasks([taskUserDailies]);

      const updatedDescription = 'Updated description for Task User 1';
      const task = {
        name: taskUserDailies.name,
        description: updatedDescription,
        type: taskUserDailies.type,
        frequency: taskUserDailies.frequency,
        difficulty: taskUserDailies.difficulty,
      };

      delete task._id;
      delete task._userId;

      const res = await request(app)
        .put(`/api/v1/tasks/${taskUserDailies._id}`)
        .set('Authorization', bearerToken)
        .send(task);

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toMatchObject({
        name: taskUserDailies.name,
        description: updatedDescription,
        type: taskUserDailies.type,
        difficulty: taskUserDailies.difficulty,
        frequency: taskUserDailies.frequency,
        _id: taskUserDailies._id,
        _userId: testUser._id,
      });
    });

    it('should return 404 if task id does not exist', async () => {
      const updatedDescription = 'Updated description for Task User 1';
      const task = {
        name: taskUserDailies.name,
        description: updatedDescription,
        type: taskUserDailies.type,
        frequency: taskUserDailies.frequency,
        difficulty: taskUserDailies.difficulty,
      };

      const res = await request(app)
        .put(`/api/v1/tasks/${taskUserDailies._id}`)
        .set('Authorization', bearerToken)
        .send(task);

      expect(res.status).toBe(httpStatus.NOT_FOUND);
      expect(res.body).toHaveProperty('stack');
      expect(res.body.stack).toMatch(/Task not found/i);
    });

    it('should return 400 if task body has missing required fields', async () => {
      await insertTasks([taskUserDailies]);
      const task = {
        description: 'new description',
      };
      const res = await request(app)
        .put(`/api/v1/tasks/${taskUserDailies._id}`)
        .set('Authorization', bearerToken)
        .send(task);

      expect(res.status).toBe(httpStatus.BAD_REQUEST);
      expect(res.body).toHaveProperty('stack');
      expect(res.body.stack).toMatch(/is required/i);
    });

    it('should return 400 if task dailies has missing required field(frequency)', async () => {
      await insertTasks([taskUserDailies]);
      const task = {
        name: taskUserDailies.name,
        type: taskUserDailies.type,
        difficulty: taskUserDailies.difficulty,
        description: 'new description',
      };
      const res = await request(app)
        .put(`/api/v1/tasks/${taskUserDailies._id}`)
        .set('Authorization', bearerToken)
        .send(task);

      expect(res.status).toBe(httpStatus.BAD_REQUEST);
      expect(res.body).toHaveProperty('stack');
      expect(res.body.stack).toMatch(/is required/i);
    });

    it('should return 400 if task dailies has field(frequency) that is not in valid options', async () => {
      await insertTasks([taskUserDailies]);
      const task = {
        name: taskUserDailies.name,
        type: taskUserDailies.type,
        difficulty: taskUserDailies.difficulty,
        description: 'new description',
        frequency: 'incorrect frequency',
      };

      const res = await request(app)
        .put(`/api/v1/tasks/${taskUserDailies._id}`)
        .set('Authorization', bearerToken)
        .send(task);

      expect(res.status).toBe(httpStatus.BAD_REQUEST);
      expect(res.body).toHaveProperty('stack');
      expect(res.body.stack).toMatch(/frequency must be one of/i);
    });

    it('should return 400 if task todo has field(frequency)', async () => {
      await insertTasks([taskUserTodo]);
      const task = {
        name: taskUserTodo.name,
        type: taskUserTodo.type,
        difficulty: taskUserTodo.difficulty,
        description: 'new description',
        frequency: 'should not exist in type todo',
      };

      const res = await request(app).put(`/api/v1/tasks/${taskUserTodo._id}`).set('Authorization', bearerToken).send(task);

      expect(res.status).toBe(httpStatus.BAD_REQUEST);
      expect(res.body).toHaveProperty('stack');
      expect(res.body.stack).toMatch(/frequency is not allowed/i);
    });
  });

  // describe('PATCH /tasks/:taskId/status ', () => {
  //   it('should return 200 and update task status of the user', async () => {
  //     await insertTasks([taskUserDailies]);

  //     const updatedStatus = TASK_STATUS.COMPLETED;
  //     const body = {
  //       status: updatedStatus,
  //     };

  //     const res = await request(app)
  //       .patch(`/api/v1/tasks/${taskUserDailies._id}/status`)
  //       .set('Authorization', bearerToken)
  //       .send(body);

  //     expect(res.status).toBe(httpStatus.OK);
  //     expect(res.body).toMatchObject({
  //       _id: taskUserDailies._id,
  //       _userId: testUser._id,
  //       status: updatedStatus,
  //     });
  //   });

  //   it('should return 404 if task id does not exist', async () => {
  //     const updatedStatus = TASK_STATUS.COMPLETED;
  //     const body = {
  //       status: updatedStatus,
  //     };

  //     const res = await request(app)
  //       .patch(`/api/v1/tasks/${taskUserDailies._id}/status`)
  //       .set('Authorization', bearerToken)
  //       .send(body);

  //     expect(res.status).toBe(httpStatus.NOT_FOUND);
  //     expect(res.body).toHaveProperty('stack');
  //     expect(res.body.stack).toMatch(/Task not found/i);
  //   });

  //   it('should return 400 if task status is missing from request body', async () => {
  //     await insertTasks([taskUserDailies]);

  //     const res = await request(app)
  //       .patch(`/api/v1/tasks/${taskUserDailies._id}/status`)
  //       .set('Authorization', bearerToken)
  //       .send({});

  //     expect(res.status).toBe(httpStatus.BAD_REQUEST);
  //     expect(res.body).toHaveProperty('stack');
  //     expect(res.body.stack).toMatch(/status is required/i);
  //   });

  //   it('should return 400 if task status value is not in valid options', async () => {
  //     await insertTasks([taskUserDailies]);
  //     const status = 'incorrect status';
  //     const res = await request(app)
  //       .patch(`/api/v1/tasks/${taskUserDailies._id}/status`)
  //       .set('Authorization', bearerToken)
  //       .send({ status });

  //     expect(res.status).toBe(httpStatus.BAD_REQUEST);
  //     expect(res.body).toHaveProperty('stack');
  //     expect(res.body.stack).toMatch(/must be one of/i);
  //   });
  // });
});
