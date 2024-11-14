import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import api from '../services/api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 

  const handleLogin = async () => {
    if (email.trim() && password.trim()) {
      setLoading(true);
      setErrorMessage(''); 
      try {
        const response = await api.post('/auth/login/customer', { email, password });

        if (response.status === 200 && response.data.success) {
          Alert.alert('Login Successful', `Welcome, ${email}!`);
          navigation.navigate('Home'); 
        } else {
          setErrorMessage(response.data.message || 'Invalid email or password.');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'An error occurred during login.';
        setErrorMessage(errorMessage);
        console.error('Login Error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage('Please enter both email and password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#6200EE" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.registerText}>
        Don't have an account?{' '}
        <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
          Register here
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center', 
    paddingHorizontal: 20,
    backgroundColor: '#f7f7f7',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    color: '#333',
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center', 
  },
  button: {
    backgroundColor: '#a3080c',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%', 
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  },
  registerText: {
    textAlign: 'center',
    color: '#333',
    marginTop: 20,
  },
  registerLink: {
    color: '#a3080c',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
