

import React from 'react';
import Style from './style.module.scss';
import Logo from '../../atoms/Logo/index.';

const Header = () => {
  return (
    <header className={Style.do_header}>
      <ul><li>
        <a href='/projects' className='do-text-xs'>Projects</a></li></ul>
      <Logo type='header' />
      <ul>
        <li>
          <a href='/about' className='do-text-xs'>About</a>
        </li>
      </ul>
    </header>
  )
}

export default Header;