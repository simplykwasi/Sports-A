import AuthService from '../services/auth.service.js';

export async function register(req, res, next) {
  try {
    const { email, password, displayName } = req.body;
    const user = await AuthService.registerUser({ email, password, displayName });
    const token = AuthService.signToken({ userId: user.user_id, email: user.email, role: user.role });
    res.status(201).json({ user: { email: user.email, displayName: user.display_name }, token });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await AuthService.validateCredentials(email, password);
    const token = AuthService.signToken({ userId: user.user_id, email: user.email, role: user.role });
    res.json({ user: { email: user.email, displayName: user.display_name }, token });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const payload = AuthService.verifyToken(refreshToken);
    const token = AuthService.signToken({ userId: payload.userId, email: payload.email, role: payload.role });
    res.json({ token });
  } catch (error) {
    next(error);
  }
}
