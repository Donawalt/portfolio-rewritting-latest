

import React from 'react';
import Style from './style.module.scss';

const Button = (props: { children: any; type: any; href: any; target?: any; disabled?: boolean}) => {
  const {children, type, href, target, disabled} = props;

  switch (type) {
    case 'link':
      return (<a className={Style.root} href={href} target={target}>{children}</a>);
    case 'submit': 
      return (<input className={Style.root + " do-text-default"} type={type} value={children} disabled={disabled}/>)
  
    default:
      return (<button className={Style.root}>{children}</button>);
  }

  return <></>;
}

export default Button;