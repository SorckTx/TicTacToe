import { useState } from 'react';
import { useRouter } from 'next/router';
import { registerUser } from '../../lib/api'; 
import Image from 'next/image';
import styles from './Register.module.css'; 
import { Button, TextInput, PasswordInput } from '@shakers/ui';


export default function Register() {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const validatePassword = (password) => {
    const minLength = /.{6,}/; 
    const hasNumber = /\d/; 
    const hasLowercase = /[a-z]/; 
    const hasUppercase = /[A-Z]/; 

    if (!minLength.test(password)) return "At least 6 characters.";
    if (!hasNumber.test(password)) return "At least one number.";
    if (!hasLowercase.test(password)) return "At least one lowercase letter.";
    if (!hasUppercase.test(password)) return "At least one uppercase letter.";

    return null; 
  };

  const handleAlreadyRegistered = () => {
    router.push('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // si no tuviésemos esto, la página se recargaría al hacer submit

    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError('All fields are required.');
      return;
    }
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await registerUser(formData.username, formData.password);
      router.push('/login');
    } catch (err) {
      setError(err.message);
    }
  };


  function handleReturnLobby() {
    router.push('/lobby');
  }


  return (
    <div className={styles.registerContainer}>
      <div className={styles.logoContainer}>
        <Image src="/letter.png" alt="Logo" width={300} height={100} priority onClick={handleReturnLobby}/>
        <h1>Tic Tac Toe</h1>
      </div>
      <h2>Join us!</h2>
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

        <PasswordInput
          placeholder="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required={true} 
        />  
        
        {error && <p className={styles.error}>{error}</p>} 
        {success && <p className={styles.success}>{success}</p>}
        
        <Button color="yellow" type="submit" className={styles.createButton}>Create account</Button>
        <Button color='white'variant='transparent' type="button" className={styles.registeredButton} onClick={handleAlreadyRegistered}>Already registered?</Button>
      </form>
    </div>
  );
}