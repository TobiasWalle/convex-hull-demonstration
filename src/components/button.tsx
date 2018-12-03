import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<any> {
}

export const Button: React.FunctionComponent<ButtonProps> = (props) => (
  <button {...props}/>
);
