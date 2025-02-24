import Authentication from '../src/models/authentication';
import User from '../src/models/user';
import { describe, it } from 'mocha';
import register from '../src/api/User/register';
import login from '../src/api/User/login';
import assert from 'assert';
import bcrypt from 'bcryptjs';
import sinon from 'sinon';

interface ResponseStub {
  status: sinon.SinonStub;
  json: sinon.SinonStub;
}

describe('User', function() {
  it('should register a user', async function() {
    const mockRequest = (body) => ({
      body
    });
    const mockResponse = (): ResponseStub => {
      const res: ResponseStub = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
      };
      return res;
    };
    const req = mockRequest({ firstName: 'Test', lastName: 'Testerson', email: 'test@localhost.com', password: 'password' });
    const res = mockResponse();
    await register(req, res);
    assert(res.status.calledWith(200));
    assert.equal(res.json.getCall(0).args[0].user.email, 'test@localhost.com');
    assert.equal(res.json.getCall(0).args[0].user.firstName, 'Test');
    assert.equal(res.json.getCall(0).args[0].user.lastName, 'Testerson');
  });

  it('should login a user', async function() {
    const [user] = await User.insertMany([{
      email: 'test1@localhost.com',
      firstName: 'Test',
      lastName: 'Testerson'
    }]);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('password', salt);
    await Authentication.insertMany([{
      type: 'password',
      userId: user.id,
      secret: hash
    }]);

    const mockRequest = (body) => ({
      body
    });
    const mockResponse = (): ResponseStub => {
      const res: ResponseStub = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
      };
      return res;
    };
    const req = mockRequest({ email: 'test1@localhost.com', password: 'password' });
    const res = mockResponse();
    await login(req, res);
    assert(res.status.calledWith(200));
    assert.equal(res.json.getCall(0).args[0].user.email, 'test1@localhost.com');
  });
});
