


import Style from './style.module.scss';
import Logo from '../../atoms/Logo/index.';
import { useId, useState } from 'react';
import { SOCIALS } from '../../../config/site';

const RMenu = [
  // set Prices , Portfolio , Blog , About , 

  {
    name: 'About',
    link: '/about'
  },
  {
    name: 'Blog',
    link: '/blog/'
  },
  {
    name: 'Prices',
    link: '/overflow-design-build-partner/'
  }

]
const blogMenu = {
  left: [
    {
      name: 'All articles',
      link: '/blog'
    },
  ],
  right: RMenu
}
const baseMenu = {
  left: [
    {
      name: 'All Projects',
      link: '/projects'
    }, {
      name: 'Portfolio',
      subField: [
        {
          name: "Visual Identity Design",
          link: "/projects/design/"
        },
        {
          name: "Web/Product Development",
          link: "/projects/development/"
        },
        {
          name: "Photography",
          link: "/projects/photography/"
        }
      ]
    },
  ],
  right: RMenu
}

const mobileMenu = [
  {
    name: 'Prices',
    subField: [
      {
        name: "Visual Identity Design",
        link: '/independent-designer/'
      },
      {
        name: "Web Development",
        link: '/independent-developer/'
      },
      {
        name: "Photography",
        link: '/independent-photographer/'
      }
    ]
  },
  {
    name: 'Quick links',
    subField: [
      // projects , blog , about 
      {
        name: "Projects",
        link: "/projects/"
      },
      {
        name: "Blog",
        link: "/blog/"
      },
      {
        name: "About",
        link: "/about"
      }
    ]
  },
  {
    name: 'Social links',
    subField: SOCIALS.map(({ name, url }) => ({
      name,
      link: url,
    })),
  }
]

interface MenuItem {
  name: string;
  link?: string;
  subField?: MenuItem[];
}

const NavItem = ({ item }: { item: MenuItem }) => {
  const hasSubField = Boolean(item.subField?.length);
  const submenuId = useId();
  const [open, setOpen] = useState(false);

  return (
    <li
      onPointerEnter={event => hasSubField && event.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={event => hasSubField && event.pointerType === 'mouse' && setOpen(false)}
    >
      {item.link ? (
        <a
          href={item.link}
          target={item.link.includes('https') ? '_blank' : '_self'}
          className='do-text-xs'
        >
          {item.name}
        </a>
      ) : (
        <button
          type='button'
          className='do-text-xs'
          aria-expanded={hasSubField ? open : undefined}
          aria-controls={hasSubField ? submenuId : undefined}
          onClick={() => hasSubField && setOpen(value => !value)}
          onKeyDown={event => {
            if (event.key === 'Escape' && hasSubField) setOpen(false);
          }}
        >
          {item.name}
          <svg width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g clipPath="url(#clip0_2536_1014)">
              <path fillRule="evenodd" clipRule="evenodd" d="M7.52599 6.77113L3.75466 2.9998L4.69732 2.05713L7.99732 5.35713L11.2973 2.05713L12.24 2.9998L8.46866 6.77113C8.34364 6.89611 8.1741 6.96632 7.99732 6.96632C7.82055 6.96632 7.65101 6.89611 7.52599 6.77113Z" fill="#CCCCCC" />
            </g>
            <defs>
              <clipPath id="clip0_2536_1014">
                <rect width="8" height="16" fill="white" transform="translate(16) rotate(90)" />
              </clipPath>
            </defs>
          </svg>
        </button>
      )}
      {hasSubField && (
        <ul id={submenuId} data-open={open} className={Style.do_submenu}>
          <MenuList list={item.subField!} />
        </ul>
      )}
    </li>
  );
};

const MenuList = ({ list }: { list: MenuItem[] }) => {
  return (
    <>{list.map((el, index) => (
      <NavItem key={(el.name || 'item') + '-' + index} item={el} />
    ))}</>
  );
};

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section className={`${Style.do_mobile_menu} ${isOpen && Style.do_mobile_menu_open}`}>
      {
        isOpen ? <div>
          <MenuList list={mobileMenu} />
        </div> : null
      }

      <button onClick={() => {
        setIsOpen(!isOpen)
      }}>{isOpen ? 'Close' : 'Menu'}</button>
    </section>
  )
}
const Header = ({ type }) => {

  return (
    <>  <header className={Style.do_header}>
      <ul>
        <MenuList list={type === 'blog' ? blogMenu.left : baseMenu.left} />
      </ul>
      <Logo type={'header'} />
      <ul>
        <MenuList list={type === 'blog' ? blogMenu.right : baseMenu.right} />
      </ul>
    </header>
      <MobileMenu />
    </>


  )
}

export default Header;