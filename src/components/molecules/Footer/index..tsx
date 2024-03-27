import React from 'react';
import Style from './style.module.scss';

const Footer = () => {
  return (<footer className={Style.do_footer}>
    <p className='do-text-xs'>© Donaël Walter 2024</p>
    <ul>
    <li><a className='do-text-xs' href='https://cal.com/donael-walter/conversation-rapide?date=2023-09-20&month=2023-09' target='_blank'>Book a 15 min call</a><svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_1216_66)">
          <path d="M8 4.01277C5.78778 3.98705 3.96141 5.78769 3.98714 8.02563V7.92274C3.98714 5.73624 2.1865 3.98705 0 4.01277H0.0257235C2.21222 3.98705 3.96141 2.21213 3.98714 0.0513582V0.0256348C4.01286 2.21213 5.78778 4.01277 8 4.01277Z" fill="white" />
        </g>
        <defs>
          <clipPath id="clip0_1216_66">
            <rect width="8" height="8" fill="white" />
          </clipPath>
        </defs>
      </svg>
      </li>
      <li><a className='do-text-xs' href='https://www.instagram.com/walt_dona/' target='_blank'>Instagram</a><svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_1216_66)">
          <path d="M8 4.01277C5.78778 3.98705 3.96141 5.78769 3.98714 8.02563V7.92274C3.98714 5.73624 2.1865 3.98705 0 4.01277H0.0257235C2.21222 3.98705 3.96141 2.21213 3.98714 0.0513582V0.0256348C4.01286 2.21213 5.78778 4.01277 8 4.01277Z" fill="white" />
        </g>
        <defs>
          <clipPath id="clip0_1216_66">
            <rect width="8" height="8" fill="white" />
          </clipPath>
        </defs>
      </svg>
      </li>
      <li><a className='do-text-xs' href='https://github.com/Donawalt' target='_blank'>Github</a><svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_1216_66)">
          <path d="M8 4.01277C5.78778 3.98705 3.96141 5.78769 3.98714 8.02563V7.92274C3.98714 5.73624 2.1865 3.98705 0 4.01277H0.0257235C2.21222 3.98705 3.96141 2.21213 3.98714 0.0513582V0.0256348C4.01286 2.21213 5.78778 4.01277 8 4.01277Z" fill="white" />
        </g>
        <defs>
          <clipPath id="clip0_1216_66">
            <rect width="8" height="8" fill="white" />
          </clipPath>
        </defs>
      </svg>
      </li>
      <li><a className='do-text-xs' href='https://dribbble.com/donaelwalter' target='_blank'>Dribble</a></li>
    </ul>
  </footer>)
}

export default Footer;
