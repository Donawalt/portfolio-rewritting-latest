import React from 'react';

const Text = ({size = 'undefined', type = 'p', children = ''}) => {
  switch (type) {
    case 'h1':
      return <h1 className={`do-text-${size}`}>{children}</h1>
    case 'h2':
      return <h2 className={`do-text-${size}`}>{children}</h2>
    case 'h3':
      return <h3 className={`do-text-${size}`}>{children}</h3>
    case 'h4':
      return <h4 className={`do-text-${size}`}>{children}</h4>
    case 'h5':
      return <h5 className={`do-text-${size}`}>{children}</h5>
    case 'h6':
      return <h6 className={`do-text-${size}`}>{children}</h6>
    case 'p':
        return <p className={`do-text-${size}`}>{children}</p>
  
    default:
      return <p className={`do-text-${size}`}>{children}</p>
  }
}

export default Text;