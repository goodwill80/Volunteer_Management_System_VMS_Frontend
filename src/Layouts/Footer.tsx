// import { AppBar, Box, Toolbar, Typography, Container } from '@mui/material';

function Footer() {
  const footerYear: number = new Date().getFullYear();
  return (
    <div className="absolute left-[-10px] bottom-[-10px] right-[-10px] w-screen xl:fixed xl:left-0 xl:right-0 lg:bottom-0 m-0 bg-blue-600 py-8 xl:w-[100%]">
      <p className="text-white text-center tracking-wider">
        Copyright &copy; {footerYear} All rights reserved
      </p>
    </div>
  );
}

export default Footer;
