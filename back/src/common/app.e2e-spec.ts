import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { AppModule } from '../app.module';
describe('E2E - Register, Login, Play vs CPU, Logout', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let accessToken: string;
  let gameId: string;
  const testUser = { username: 'test_user', password: 'test_pass' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dbConnection = moduleFixture.get<Connection>('DatabaseConnection');
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteOne({ username: testUser.username });
    await app.close();
  });

  it('Should register a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    expect(res.body).toHaveProperty('message', 'User created successfully');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', testUser.username);
  });

  it('Should log in the user and obtain a token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(testUser)
      .expect(200);

    expect(res.body).toHaveProperty('access_token');
    accessToken = res.body.access_token;
  });

  it('Should create a game against the CPU', async () => {
    const res = await request(app.getHttpServer())
      .post('/game/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ mode: 'cpu' }) 
      .expect(201);
  
    expect(res.body).toHaveProperty('board'); 
    expect(res.body).toHaveProperty('currentPlayer');
  });

  it('Should make a move in the game', async () => {
    const res = await request(app.getHttpServer())
      .post('/game/move')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ gameId, position: 0 }) 
      .expect(200);

    expect(res.body).toHaveProperty('board');
    expect(res.body).toHaveProperty('turn');
    expect(res.body.board[0]).toBe('X'); 
  });

  it('Should log out by removing the token', async () => {
    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});


describe('E2E - Register, Login, Play Local (PVP) and Logout', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let accessToken: string;
  let gameId: string;
  const testUser = { username: 'test_user_pvp', password: 'test_pass' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dbConnection = moduleFixture.get<Connection>('DatabaseConnection');
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteOne({ username: testUser.username });
    await dbConnection.collection('games').deleteMany({});
    await app.close();
  });

  it('Should register a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    expect(res.body).toHaveProperty('message', 'User created successfully');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', testUser.username);
  });

  it('Should log in the user and obtain a token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(testUser)
      .expect(200);

    expect(res.body).toHaveProperty('access_token');
    accessToken = res.body.access_token;
  });

  it('Should create a local game (PVP)', async () => {
    const res = await request(app.getHttpServer())
      .post('/game/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ mode: 'pvp' })
      .expect(201);

    expect(res.body).toHaveProperty('board');
    expect(res.body).toHaveProperty('currentPlayer', 'X'); 
    gameId = res.body.gameId;
  });

  it('Should play a game where "O" wins', async () => {

    const moves = [0, 3, 1, 4, 6, 5]; 
    for (let i = 0; i < moves.length; i++) { 
      const res = await request(app.getHttpServer())
        .post('/game/move')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ gameId, position: moves[i] })
        .expect(200);

      expect(res.body).toHaveProperty('board'); 
      expect(res.body).toHaveProperty('turn'); 
      
      if (i === moves.length - 1) { 
        expect(res.body).toHaveProperty('winner', 'O');
      }
    }
  });

  it('Should log out by removing the token', async () => {
    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});