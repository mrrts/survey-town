import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { enhanceApp, clearTestData } from './setup-e2e';
import { SurveysService } from '../src/surveys/surveys.service';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('SurveysController (e2e)', () => {
  let app: INestApplication;
  let surveysService: SurveysService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    enhanceApp(app);
    await clearTestData(app);

    surveysService = app.get<SurveysService>(SurveysService);

    await app.init();
  });

  afterEach(async () => {
    const conn: Connection = app.get(getConnectionToken());
    await conn.close();
    await app.close();
  });

  // it('/api/surveys (POST)', async () => {
  //   // expect(await surveysService.findAll()).toHaveLength(0);

  //   const resp: request.Response = await request(app.getHttpServer())
  //     .post('/api/surveys')
  //     .send({ title: 'title1', description: 'desc1' })
  //     .end();

  //   expect(resp.status).toBe(201);

  //   // expect(await surveysService.findAll()).toHaveLength(1);
  // });
});
