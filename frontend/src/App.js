import React, { useEffect, useState } from 'react'
import Login from './component/Login'
import { useImmer } from 'use-immer'
import axios from './utils/axios'
import socket from './utils/socketio'

function App() {
  const [token, setToken] = useState()
  const [user, setUser] = useImmer({
    userName: '',
    mobileNumber: '',
    verificationCode: '',
    verificationSent: false
  })

  useEffect(() => {
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    return () => { }
  }, [])

  const sendSmsCode = async () => {
    console.log("Sending SMS")
    await axios.post('/login', {
      to: user.mobileNumber,
      userName: user.userName,
      channel: 'sms'
    })
    setUser((draft) => {
      draft.verificationSent = true;
    })
  }

  const sendVerificationCode = async () => {
    console.log('Sending Verification Code');
    const response = await axios.post('/verify', {
      to: user.mobileNumber,
      code: user.verificationCode,
      userName: user.userName
    });
    console.log('received token', response.data.token);
    setToken(response.data.token)
  }
  return (
    <div>
      <Login
        user={user}
        setUser={setUser}
        sendSmsCode={sendSmsCode}
        sendVerificationCode={sendVerificationCode}
      />
    </div>
  );
}

export default App
