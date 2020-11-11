import React from 'react';
import { Container, Image, Menu } from 'semantic-ui-react';

const Navbar = () => {
  return (
    <Menu>
      <Container text>
        <Menu.Item>
          <i className='phone icon' />
        </Menu.Item>
        <Menu.Item header>Call Center</Menu.Item>
        <Menu.Item  position='right'>
            <Image src="https://react.semantic-ui.com/images/avatar/large/chris.jpg" avatar/>
        </Menu.Item>
        <Menu.Item>Chris</Menu.Item>
      </Container>
    </Menu>
  );
};

export default Navbar;
