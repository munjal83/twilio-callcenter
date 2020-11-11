import React from 'react';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';

function Login({ user, setUser, sendSmsCode, sendVerificationCode }) {
  const populateFields = (event, data) => {
    setUser((draft) => {
      draft[data.name] = data.value;
    });
  };
  const { username, mobileNumber, verificationCode, verificationSent } = user;

  return (
    <Grid textAlign='center' verticalAlign='middle' style={{ height: '100vh' }}>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          Login into your account
        </Header>
        <Form>
          <Segment stacked>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='username'
              value={username}
              name='username'
              onChange={(event, data) => populateFields(event, data)}
            />
            <Form.Input
              fluid
              icon='mobile alternate'
              iconPosition='left'
              placeholder='Mobile Number'
              value={mobileNumber}
              name='mobileNumber'
              onChange={(event, data) => populateFields(event, data)}
            />
            {verificationSent && (
              <Form.Input
                fluid
                icon='key'
                iconPosition='left'
                placeholder='Enter your code'
                value={verificationCode}
                onChange={(event, data) => populateFields(event, data)}
                name='verificationCode'
              />
            )}
            <Button
              color='teal'
              fluid
              size='large'
              onClick={!verificationSent ? sendSmsCode : sendVerificationCode}
            >
              {!verificationSent ? 'Login/Signup' : 'Enter Your Code'}
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default Login;
