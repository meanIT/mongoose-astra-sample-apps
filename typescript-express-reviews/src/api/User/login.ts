import express, { Request, Response } from 'express';
import Authentication from '../../models/authentication';
import User from '../../models/user';
import bcrypt from 'bcryptjs';

async function login(request: Request, response: Response): Promise<void> {
  const user = await User
    .findOne({ email: request.body.email })
    .setOptions({ sanitizeFilter: true });
  if (user == null) {
    response.status(404).json({ error: 'user not found' });
    return;
  }
  if (request.body.password == null) {
    response.status(400).json({ error: 'no password specified' });
    return;
  }

  const authentication = await Authentication.find({
    userId: user.id
  }).then(authentications => authentications.find(auth => auth.type === 'password'));
  if (authentication == null) {
    response.status(404).json({
      error: 'This account does not have a password set'
    });
    return;
  }
  const matches = await bcrypt.compare(
    request.body.password,
    authentication.secret as string
  );
  if (!matches) {
    response.status(500).json({ error: 'Login Failed' });
    return;
  }

  response.status(200).json({ user: user });
}

export default login;
