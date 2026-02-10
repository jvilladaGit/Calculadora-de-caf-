import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Mail, Lock, Loader2 } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="modal-content" style={{
                background: '#1a1a1a', padding: '2rem', borderRadius: '16px',
                width: '100%', maxWidth: '400px', border: '1px solid #333', position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#fff' }}>
                    {isLogin ? 'Bienvenido de nuevo' : 'Crear Cuenta'}
                </h2>

                <p style={{ textAlign: 'center', color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    {isLogin ? 'Ingresa para gestionar tus proyecciones' : 'Regístrate para guardar tus cálculos'}
                </p>

                {error && (
                    <div style={{ background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="input-group" style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem',
                                background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: '#fff'
                            }}
                        />
                    </div>

                    <div className="input-group" style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem',
                                background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: '#fff'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: 'var(--accent)', color: '#000', fontWeight: '600',
                            padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            marginTop: '0.5rem'
                        }}
                    >
                        {loading ? <Loader2 className="spin" size={20} /> : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#888' }}>
                    {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', marginLeft: '0.5rem', fontWeight: '500' }}
                    >
                        {isLogin ? 'Regístrate' : 'Inicia Sesión'}
                    </button>
                </div>
            </div>
        </div>
    );
}
