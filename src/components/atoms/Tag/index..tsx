

import React from 'react';
import Style from './style.module.scss';


const Tag = ({ children, type }: { children: string | any[], type?: string }) => {
  return <div className={Style.do_tag + ' ' + Style['do_tag_'+type]}>
    <p className='do-text-s'>
      {children}
    </p>
  </div>
}

export default Tag;