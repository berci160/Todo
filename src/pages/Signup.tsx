import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import * as yup from 'yup';
import bycrypt from 'bcryptjs';
import { useDispatch } from 'react-redux';

import { LOCAL_USERS, MIN_PASSWORD_VALUE } from 'config/config';
import { UserData } from 'models';
import { registerUser } from 'slices/userSlice';

export interface SignupProps {
  username: string;
  password: string;
}

const Signup = () => {
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const PASSWORD_SALT_LENGHT = 2;

  const schema = yup
    .object({
      username: yup.string().required(t('username_required')),
      password: yup
        .string()
        .min(MIN_PASSWORD_VALUE, t('password_min_char', { min: MIN_PASSWORD_VALUE }))
        .required(t('password_required')),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupProps>({ resolver: yupResolver(schema) });

  const onSubmit = ({ password, username }: SignupProps) => {
    setError(null);

    const users: UserData[] = JSON.parse(localStorage.getItem(LOCAL_USERS) || '[]');
    const existingUser = users.find((user) => user.name === username);

    if (existingUser) {
      setError(t('user_exist'));
      return;
    }

    const hashedPassword = bycrypt.hashSync(password, PASSWORD_SALT_LENGHT);

    const newUser = {
      id: new Date().getTime(),
      name: username,
      password: hashedPassword,
      profilePic: null,
      todos: [],
    };

    users.push(newUser);

    const { id, name, profilePic } = newUser;

    dispatch(registerUser({ id, name, profilePic, password: hashedPassword }));

    navigate('/');
  };

  return (
    <div className="flex items-center justify-center  min-h-screen ">
      <div className="bg-gray-50 p-16 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800  p-3">{t('sign_up')}</h1>
        {error && <div className="text-red-500 text-sm text-center mb-4 font-bold mt-2">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="inputs space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                {t('username')}
              </label>
              <input
                type="text"
                id="username"
                className="mt-1 p-3 w-full border border-gray-300 rounded-md bg-gray-500 "
                {...register('username')}
              />
              {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('password')}
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-3 w-full border border-gray-300 rounded-md bg-gray-500"
                {...register('password')}
              />
              {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
            </div>
          </div>
          <button type="submit" className="w-full text-sm font-semibold text-white bg-blue-600">
            {t('sign_up')}
          </button>
        </form>
        <button className="w-full text-sm font-semibold  bg-blue-600 mt-3">
          <Link to="/" className="text-white">
            {t('sign_up_first')}
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Signup;
