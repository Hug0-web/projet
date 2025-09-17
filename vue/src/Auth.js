
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';




export default function Auth() {

const navigate = useNavigate();
const [mode, setMode] = useState('login');
const [Email, setEmail] = useState('');
const [Password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = mode === 'login' ? 'http://localhost:8080/users/login' : 'http://localhost:8080/users/register';

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email, Password }),
    });

    const data = await res.json();
    console.log(data);

    if(data.token) {

        localStorage.setItem('token', data.token);

        navigate('/Home');
    }
    }
  return (

     <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>{mode === 'login' ? 'Connexion' : 'Inscription'}</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={Email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Mot de passe" type="password" value={Password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">
          {mode === 'login' ? 'Se connecter' : "S'inscrire"}
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        {mode === 'login'
          ? "Pas encore de compte ? "
          : 'Déjà un compte ? '}
        <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? "S'inscrire" : 'Se connecter'}
        </button>
      </p>
    </div>
    );
}



