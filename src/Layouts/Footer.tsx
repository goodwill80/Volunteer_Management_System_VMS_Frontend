// import { AppBar, Box, Toolbar, Typography, Container } from '@mui/material';

function Footer() {
  const footerYear: number = new Date().getFullYear();
  return (
    <div className="fixed left-0 bottom-0 m-0 bg-blue-600 p-8 w-[100%]">
      <p className="text-white text-center tracking-wider">
        Copyright &copy; {footerYear} All rights reserved
      </p>
    </div>
  );
}

export default Footer;
