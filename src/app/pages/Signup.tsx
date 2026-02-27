import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import luqeaLogo from '../../assets/imgs/luqea.png';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { registerUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError('Completa todos los campos.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const result = registerUser(name, email, password);
    if (!result.ok) {
      setError(result.message || 'No se pudo crear la cuenta.');
      return;
    }

    setError('');
    navigate('/dashboard');
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
        <div className="flex justify-center mt-8">
          <img
            src={luqeaLogo}
            alt="Luqea logo"
            className="w-14 h-14 object-contain"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              padding: '7px',
              boxShadow: '0 8px 18px rgba(15, 23, 42, 0.12)'
            }}
          />
        </div>

        <div className="text-center mt-8 mb-8">
          <h1 className="text-4xl mt-4 mb-2" style={{ color: '#FFFFFF' }}>
            Crear cuenta
          </h1>
          <p className="text-lg" style={{ color: '#CFE6FF' }}>
            Regístrate para usar tu billetera digital
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
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{ backgroundColor: '#FEF2F2', color: '#B91C1C' }}
                role="alert"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block mb-2 text-lg" style={{ color: '#192041' }}>
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all text-lg"
                style={{
                  borderColor: '#BECAF8',
                  backgroundColor: '#FFFFFF'
                }}
                placeholder="Tu nombre"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-lg" style={{ color: '#192041' }}>
                Correo
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
                placeholder="Ingresa tu correo"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-lg" style={{ color: '#192041' }}>
                Contraseña
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
                placeholder="Crea una contraseña"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-lg" style={{ color: '#192041' }}>
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all text-lg"
                style={{
                  borderColor: '#BECAF8',
                  backgroundColor: '#FFFFFF'
                }}
                placeholder="Repite la contraseña"
                required
              />
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
              Crear cuenta
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="transition-all text-lg"
                style={{ color: '#125EFF' }}
              >
                Ya tengo cuenta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
