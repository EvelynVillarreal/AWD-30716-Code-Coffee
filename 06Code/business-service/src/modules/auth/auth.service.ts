import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crudClient from '../../shared/http/crud.client';
import { BusinessError, UnauthorizedError } from '../../shared/errors/business.errors';

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  province: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

const SALT_ROUNDS = 10;

function generateToken(userId: number, email: string, role: string): string {
  const secret = process.env.JWT_SECRET ?? '';
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';
  return jwt.sign({ userId, email, role }, secret, { expiresIn } as jwt.SignOptions);
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePasswords(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export const authService = {
  register: async (input: RegisterInput) => {
    if (!input.phone || !input.address || !input.province) {
      throw new BusinessError(400, 'El teléfono, dirección y provincia son obligatorios para el registro.');
    }

    const ecuadorPhoneRegex = /^(\+593|0)[2-9]\d{7,8}$/;
    if (!ecuadorPhoneRegex.test(input.phone)) {
      throw new BusinessError(400, 'El número de teléfono debe ser un número válido de Ecuador.');
    }

    const passwordHash = await hashPassword(input.password);

    const response = await crudClient.post('/api/user', {
      name: input.name,
      email: input.email,
      passwordHash,
      phone: input.phone,
      address: input.address,
      province: input.province,
      role: 'customer',
    });

    const user = response.data.data;
    const token = generateToken(user.id, user.email, user.role);

    return { user: { ...user, passwordHash: undefined }, token };
  },

  login: async (input: LoginInput) => {
    const response = await crudClient.get(`/api/user/email/${input.email}`).catch(() => {
      throw new UnauthorizedError('Correo o contraseña incorrectos');
    });

    const user = response.data.data;
    const passwordMatch = await comparePasswords(input.password, user.passwordHash);

    if (!passwordMatch) throw new UnauthorizedError('Correo o contraseña incorrectos');

    const token = generateToken(user.id, user.email, user.role);

    return { user: { ...user, passwordHash: undefined }, token };
  },
};
