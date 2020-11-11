import React, { useEffect, useState } from 'react'
import Login from './component/Login'
import { useImmer } from 'use-immer'
import axios from './utils/axios'
import socket from './utils/socketio'
import useTokenFromLocalStorage from './hooks/useTokenFromLocalStorage'
import CallCenter from './component/CallCenter'
import * as Twilio from 'twilio-client'

function App() {
  const [calls, setCalls] = useImmer({
    calls: []
  })
  const [user, setUser] = useImmer({
    username: '',
    mobileNumber: '',
    verificationCode: '',
    verificationSent: false
  });
  const [storedToken, setStoredToken, isValidToken] = useTokenFromLocalStorage(null)

  const [twilioToken, setTwilioToken] = useState();

  useEffect(() => {
    if(twilioToken) {
      connectTwilioVoiceClient(twilioToken)
    }
  }, [twilioToken])

  useEffect(() => {
    if (isValidToken) {
      return socket.addToken(storedToken);
    }
    socket.removeToken()
  }, [isValidToken, storedToken])

  useEffect(() => {
    socket.client.on('connect', () => {
      console.log('Connected')
    })
    socket.client.on('disconnect', () => {
      console.log('Socket.client disconnected');
    });
    socket.client.on('twilio-token', ({ token }) => {
      setTwilioToken(token)
    });
    socket.client.on('call-new', ({ data: { CallSid, CallStatus } }) => {
      setCalls(draft => {
        draft.calls.push({ CallSid, CallStatus });
      })
    });
    socket.client.on('enqueue', ({ data: { CallSid } }) => {
      setCalls(draft => {
        const index = draft.calls.findIndex(({ CallSid }) => CallSid === CallSid);
        draft.calls[index].CallStatus = 'enqueue'
      })
    })
    return () => { }
  }, [socket.client])

  const sendSmsCode = async () => {
    console.log("Sending SMS")
    await axios.post('/login', {
      to: user.mobileNumber,
      username: user.username,
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
      username: user.username
    });
    console.log('received token', response.data.token);
    setStoredToken(response.data.token)
  }

  const connectTwilioVoiceClient = (twilioToken) => {
    const device = new Twilio.Device(twilioToken, { debug: true });
    device.on('error', (error) => {
      console.error(error)
    });
    device.on('incoming', (connection) => {
      console.log("incoming from twilio");
      connection.accept();
    })
  }

  return (
    <div>
      {isValidToken ?
        (<CallCenter calls={calls} />) :
        (
          <>
            <CallCenter calls={calls} />
            <Login
              user={user}
              setUser={setUser}
              sendSmsCode={sendSmsCode}
              sendVerificationCode={sendVerificationCode}
            />
          </>)}
    </div>
  );
}

export default App
