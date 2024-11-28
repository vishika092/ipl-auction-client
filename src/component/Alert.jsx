import React, { useState, useEffect } from 'react';

const Alert = ({ message, type  }) => {

  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
    </div>
  );
};

export default Alert;
