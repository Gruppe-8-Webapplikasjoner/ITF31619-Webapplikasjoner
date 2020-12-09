import jwt from 'jsonwebtoken';
import catchAsyncErrors from '../middleware/catchAsync.js';
import { userService } from '../services/index.js';
import ErrorHandler from '../utils/errorHandler.js';
import { sendToken } from '../utils/jwtToken.js';
import { sendMail } from '../utils/sendEmail.js';

export const register = catchAsyncErrors(async (req, res, next) => {
  const user = await userService.createUser(req.body);

  try {
    await sendMail({
      email: user.email,
      subject: 'Velkommen som bruker',
      message: `Du har fått en ny brukerkonto med epost: ${user.email}`,
    });
  } catch (error) {
    //Logg dette ordentlig
    console.log(error);
  }

  sendToken(user, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler('Fyll ut riktig epost og passord', 400));
  }

  const user = await userService.getUserByEmail({ email }, true);

  if (!user) {
    return next(new ErrorHandler('Fyll ut riktig epost og passord', 400));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Fyll ut riktig epost og passord', 400));
  }

  sendToken(user, res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: 'Logget ut',
  });
});

export const currentUser = catchAsyncErrors(async (req, res, next) => {
    //const { id } = req.user;
   //const user = await userService.getUserById(id);
   
   const user = await userService.getUserById(req.user.id);

   console.log("USER I CURRENT: ", user);
  // const user = await userService.getUserById(req.params);
  /*let token;
  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userService.getUserById(decoded.id);*/

  if (!user) {
    return next(new ErrorHandler('Finner ikke brukeren', 404));
  }
  res.status(200).json({
    success: true,
    data: user,
    message: `Velykket innlogging. Du er logget inn som ${user.email}`,
  });
});
