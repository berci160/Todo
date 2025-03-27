import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import bcrypt from 'bcryptjs';
import { useState } from 'react';

import { LOCAL_USERS } from 'config/config';
import {  UserData } from 'models';
import { login } from 'slices/userSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const schema = yup
    .object({
      username: yup.string().required(t('username_required')),
      password: yup.string().min(6, t('password_min_char')).required(t('password_required')),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: { username: string; password: string }) => {
    setError(null)
    const users = JSON.parse(localStorage.getItem(LOCAL_USERS) || '[]');
    const user = users.find((u: UserData) => u.name === data.username);

    if (user) {
      const isPasswordCorrect = bcrypt.compareSync(data.password, user.password);
      if (isPasswordCorrect) {
        dispatch(login({ id: user.id, name: user.name, profilePic: user.profilePic }));
        navigate('/home');
      } else {
        setError(t('bad_password'))
      }
    } else {
      setError(t('bad_username'))
    }
  };

  const handleNavigate = () => {
    navigate('/signup');
  };

  return (
    <div className="flex items-center justify-center  min-h-screen ">
      <div className="bg-gray-50 p-16 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800  p-3">{t('login')}</h1>
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
                {...register('username')}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md bg-gray-500 "
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('password')}
              </label>
              <input
                type="password"
                id="password"
                {...register('password')}
                className="mt-1 p-3 w-full border  border-gray-300 rounded-md bg-gray-500"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
          </div>
          <button type="submit" className="w-full text-sm font-semibold text-white bg-blue-600">
            {t('login')}
          </button>
        </form>
        <button onClick={handleNavigate} className="w-full mt-3 text-sm font-semibold text-white bg-blue-600">
          {t('sign_up')}
        </button>
      </div>
    </div>
  );
};

export default Login;
