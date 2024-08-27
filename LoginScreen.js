// components/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../redux/authSlice';
import Toast from 'react-native-toast-message';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.auth.users);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = () => {
    if (isRegistering) {
      if (name && email && password && phoneNumber) {
        if (!email.endsWith('@gmail.com')) {
          Toast.show({
            type: 'error',
            text1: 'Registration Failed',
            text2: 'Email must end with @gmail.com.',
          });
          return;
        }
        if (users.find(user => user.email === email)) {
          Toast.show({
            type: 'error',
            text1: 'Registration Failed',
            text2: 'Email already exists.',
          });
          return;
        }
        const userData = { name, email, password, phoneNumber };
        dispatch(register(userData));
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: 'You can now log in.',
        });
        setName('');
        setPhoneNumber('');
        setEmail('');
        setPassword('');
        setIsRegistering(false);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: 'Please fill all fields.',
        });
      }
    } else {
      if (email && password) {
        if (!email.endsWith('@gmail.com')) {
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: 'Email must end with @gmail.com.',
          });
          return;
        }
        const userExists = users.find(user => user.email === email);
        if (userExists) {
          if (userExists.password === password) {
            dispatch(login({ email, password }));
          } else {
            Toast.show({
              type: 'error',
              text1: 'Login Failed',
              text2: 'Wrong password.',
            });
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: 'Email not registered.',
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Please enter email and password.',
        });
      }
    }
  };

  const handleSwitchMode = () => {
    setIsRegistering(!isRegistering);
    // Clear all fields when switching modes
    setName('');
    setPhoneNumber('');
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    if (isLoggedIn) {
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
      });
    }
  }, [isLoggedIn]);

  return (
    <View style={styles.container}>
      {isRegistering && (
        <>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Phone Number:</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#888"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </>
      )}
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isRegistering ? "Register" : "Login"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.switchButton} onPress={handleSwitchMode}>
        <Text style={styles.switchButtonText}>
          {isRegistering ? "Switch to Login" : "Switch to Register"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default LoginScreen;