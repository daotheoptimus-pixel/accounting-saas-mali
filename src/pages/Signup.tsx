import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { SignupCredentials } from '@/types/auth';
import { validateEmail, validatePassword } from '@/utils/validation';
import './Auth.css';

function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading, error, isAuthenticated } = useAuthStore();
  const [credentials, setCredentials] = useState<SignupCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!credentials.firstName.trim()) {
      errors.firstName = 'Le prénom est requis';
    }

    if (!credentials.lastName.trim()) {
      errors.lastName = 'Le nom est requis';
    }

    if (!validateEmail(credentials.email)) {
      errors.email = 'Email invalide';
    }

    if (!validatePassword(credentials.password)) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (credentials.password !== credentials.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signup(credentials);
      navigate('/', { replace: true });
    } catch (err) {
      setFormErrors({ submit: error || 'Erreur lors de l\'inscription' });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box signup-box">
        <div className="auth-header">
          <h1>AccuMali</h1>
          <p>Créez votre compte</p>
        </div>

        {formErrors.submit && (
          <div className="alert alert-error">
            {formErrors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={credentials.firstName}
                onChange={handleChange}
                placeholder="Prénom"
                disabled={isLoading}
                required
              />
              {formErrors.firstName && (
                <span className="error-message">{formErrors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={credentials.lastName}
                onChange={handleChange}
                placeholder="Nom"
                disabled={isLoading}
                required
              />
              {formErrors.lastName && (
                <span className="error-message">{formErrors.lastName}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              disabled={isLoading}
              required
            />
            {formErrors.email && (
              <span className="error-message">{formErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="company">Entreprise (optionnel)</label>
            <input
              type="text"
              id="company"
              name="company"
              value={credentials.company}
              onChange={handleChange}
              placeholder="Nom de votre entreprise"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
            {formErrors.password && (
              <span className="error-message">{formErrors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={credentials.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
            {formErrors.confirmPassword && (
              <span className="error-message">{formErrors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-login"
            disabled={isLoading}
          >
            {isLoading ? 'Création du compte...' : 'Créer un compte'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Vous avez déjà un compte?{' '}
            <Link to="/login" className="auth-link">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
