import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import luqeaLogo from '../../assets/imgs/LUQUEA_LOGO.svg';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      const isValid = login(email, password);
      if (isValid) {
        setError('');
        navigate('/dashboard');
      } else {
        setError('Correo o contraseña incorrectos.');
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 15%, rgba(66, 209, 255, 0.28) 0%, rgba(66, 209, 255, 0) 32%), radial-gradient(circle at 85% 82%, rgba(255, 0, 122, 0.18) 0%, rgba(255, 0, 122, 0) 35%), linear-gradient(120deg, rgba(78, 7, 182, 0.74) 0%, rgba(41, 45, 217, 0.72) 50%, rgba(5, 82, 250, 0.7) 100%), url('https://luqea.pe/assets/images/svg/back_slide_home.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mt-8">
          <img
            src={luqeaLogo}
            alt="Luqea logo"
            className="w-56 h-56 object-contain mx-auto -mt-16 -mb-16"
            style={{ filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.22))' }}
          />
        </div>

        <div className="text-center mt-8 mb-8">
          <h1 className="text-4xl mt-4 mb-2" style={{ color: '#FFFFFF' }}>
            Inicio de sesion
          </h1>
          <p className="text-lg" style={{ color: '#CFE6FF' }}>
            Ingresa a tu billetera digital
          </p>
        </div>

        <div
          className="rounded-2xl p-8 shadow-sm"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.93)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 20px 50px rgba(5, 8, 41, 0.35)'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-lg" style={{ color: '#192041' }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all text-lg"
                style={{
                  borderColor: '#BECAF8',
                  backgroundColor: '#FFFFFF'
                }}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-lg" style={{ color: '#192041' }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all text-lg"
                style={{
                  borderColor: '#BECAF8',
                  backgroundColor: '#FFFFFF'
                }}
                placeholder="Enter your password"
                required
              />
              {error && (
                <p className="mt-2 text-sm" style={{ color: '#E11D48' }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white transition-all hover:shadow-lg text-lg"
              style={{
                background: 'linear-gradient(90deg, #FF007A 0%, #FF2B8E 100%)',
                boxShadow: '0 10px 25px rgba(255, 0, 122, 0.35)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              Sign In
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="transition-all text-lg"
                style={{ color: '#125EFF' }}
              >
                Create Account
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
