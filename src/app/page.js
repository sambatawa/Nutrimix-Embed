'use client';

import React from 'react';
import { Navbar } from '../components/Navbar.jsx';
import { Hero } from '../components/Hero.jsx';
import { Sponsor } from '../components/Sponsor.jsx';
import { About } from '../components/About.jsx';
import { Product } from '../components/Product.jsx';
import { Progress } from '../components/Progress.jsx';
import { FAQ } from '../components/FAQ.jsx';
import { Members } from '../components/Members.jsx';
import { Contact } from '../components/Contact.jsx';
import { Ajakan } from '../components/Ajakan.jsx';
import { Footer } from '../components/Footer.jsx';
import { LoginPage } from '../components/Login.jsx';
import { RegisterPage } from '../components/Register.jsx';
import CustomCursor from '../components/CustomCursor.jsx';
import "./globals.css";

export default function App() {
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('register=true')) {
      window.location.href = '/register';
    }
  }, []);

  return React.createElement(
    'div',
    {
      className: 'min-h-screen bg-linear-to-br from-[#F5F0EB] via-[#F8F4EF] to-[#FAF6F1]'
    },
    React.createElement(CustomCursor, null),
    React.createElement(Navbar, null),
    React.createElement(Hero, null),
    React.createElement(Sponsor, null),
    React.createElement(About, null),
    React.createElement(Product, null),
    React.createElement(Progress, null),
    React.createElement(FAQ, null),
    React.createElement(Members, null),
    React.createElement(Contact, null),
    React.createElement(Ajakan, null),
    React.createElement(Footer, null)
  );
}