import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center footer">
      Copyright &copy; {new Date().getFullYear()} Dev Connector Again
    </footer>
  );
};

export default Footer;