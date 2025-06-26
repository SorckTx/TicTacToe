import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '../../lib/api';
import Image from 'next/image';
import styles from './Login.module.css'; 
import { Button, TextInput, PasswordInput } from '@shakers/ui';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.username, formData.password);
      router.push('/lobby'); 
    } catch (err) {
      setError('Incorrect username or password');
    }
  };

  const handleRegister = () => {
    router.push('/register'); 
  };

  function handleReturnLobby() {
    router.push('/lobby');
  }


  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoContainer}>
        <Image src="/letter.png" alt="Logo" width={300} height={100} priority  onClick={handleReturnLobby}/>
        <h1>Tic Tac Toe</h1>
      </div>
      <h2>Welcome!</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextInput w={300} mt={20}
          placeholder="Username"
          size="sm"
          name='username'
          required={true} 
          value={formData.username}
          onChange={handleChange}
        />

        <PasswordInput 
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={true} 
        />
        {error && <p className={styles.error}>{error}</p>}
        <Button color='yellow' type="submit" className={styles.loginButton}>Log in</Button>
      </form>
      <Button onClick={handleRegister} className={styles.registerButton}>Don't you have an account?</Button>
    </div>
  );
}