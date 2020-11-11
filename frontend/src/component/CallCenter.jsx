import React from 'react';
import CallProgress from './CallProgress';
import Navbar from './Navbar';

const CallCenter = ({ calls }) => {
  return (
    <div>
      <Navbar />
      {calls.calls.map((call) => (
        <CallProgress call={call}/>
      ))}
    </div>
  );
};

export default CallCenter;
