import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { BUNTY_LOGO_SRC, BUNTY_SLOGAN, SUPPORT_EMAIL } from '@/constants/branding';

const STATS = [
  { value: '+2M', label: 'Copropiedades en LATAM' },
  { value: '30+', label: 'Anos de experiencia' },
  { value: '99.9%', label: 'Uptime garantizado' },
];

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/inicio');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative hidden overflow-hidden bg-gradient-to-br from-[#0D2654] to-[#1A3F8F] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-16"
        >
          <div className="absolute inset-0">
            <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#2DC89A]/18 blur-3xl" />
          </div>

          <div className="relative z-10">
            <img src={BUNTY_LOGO_SRC} alt="Logo Bunty" className="h-20 w-auto object-contain xl:h-24" />
            <p className="mt-8 max-w-md text-5xl font-black leading-[1.05]">Todo en orden, todo Bunty.</p>
            <p className="mt-6 max-w-lg text-lg text-white/78">
              Plataforma de gestion con profundidad visual, operacion clara y una experiencia consistente para cada perfil.
            </p>
          </div>

          <div className="relative z-10 grid gap-4 xl:grid-cols-3">
            {STATS.map((item) => (
              <div
                key={item.label}
                className="rounded-[12px] border border-white/12 bg-white/10 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm"
              >
                <p className="text-3xl font-black">{item.value}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/78">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-[#2DC89A]/10 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[#1A3F8F]/8 blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="relative z-10 w-full max-w-[460px]"
          >
            <div className="mb-8 lg:hidden">
              <img src={BUNTY_LOGO_SRC} alt="Logo Bunty" className="h-14 w-auto object-contain sm:h-16" />
              <p className="mt-4 text-3xl font-black text-[#0D2654]">{BUNTY_SLOGAN}</p>
              <p className="mt-2 text-sm text-[#52627A]">Accede a tu cuenta para continuar con la gestion del conjunto.</p>
            </div>

            <div className="surface-card p-8 sm:p-10">
              <div className="section-header -mt-3 mb-8 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 p-1 sm:h-14 sm:w-14">
                    <img src={BUNTY_LOGO_SRC} alt="Logo Bunty" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/72">Autenticacion</p>
                    <h1 className="mt-2 text-2xl font-bold text-white sm:text-[30px]">Iniciar sesion</h1>
                  </div>
                </div>
              </div>

              <p className="mb-8 text-sm leading-relaxed text-[#52627A]">
                Usa tu correo electronico y contrasena para ingresar al portal.
              </p>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0D2654]">Correo electronico</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#52627A]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      placeholder="tu@bunty.co"
                      className="h-12 w-full border border-[#D1D9E6] bg-white pl-12 pr-4 text-sm text-[#0D2654] outline-none transition-all focus:border-[#2DC89A] focus:ring-2 focus:ring-[#2DC89A]/18"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0D2654]">Contrasena</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#52627A]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      placeholder="Ingresa tu contrasena"
                      className="h-12 w-full border border-[#D1D9E6] bg-white pl-12 pr-12 text-sm text-[#0D2654] outline-none transition-all focus:border-[#2DC89A] focus:ring-2 focus:ring-[#2DC89A]/18"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#52627A] transition-colors hover:bg-[#F4F7FB]"
                      title={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex items-center gap-2 text-sm text-[#52627A]">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(event) => setRememberDevice(event.target.checked)}
                      className="h-4 w-4 rounded border border-[#AFC0D8] text-[#2DC89A] focus:ring-[#2DC89A]"
                    />
                    <span>Recordar dispositivo</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm font-semibold text-[#0D2654] transition-colors hover:text-[#1A3F8F]"
                  >
                    Olvidaste tu contrasena?
                  </button>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  {isLoading ? 'Ingresando...' : 'Iniciar Sesion'}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>

              <div className="mt-8 rounded-[12px] bg-[#F4F7FB] px-4 py-4 text-sm leading-relaxed text-[#52627A]">
                Necesitas ayuda? Contacta a tu administrador o escribenos a{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-[#0D2654] underline-offset-2 hover:underline">
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Login;
