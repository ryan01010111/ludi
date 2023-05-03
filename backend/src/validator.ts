import z from 'zod';

const register = z.object({
  emailAddress: z.string().trim().email(),
  username: z.string().trim(),
  password: z.string().trim(),
});

const login = z.object({
  emailAddress: z.string().trim().email(),
  password: z.string().trim(),
});

export default {
  register,
  login,
};
