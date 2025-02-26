


import Style from './style.module.scss';
import Logo from '../../atoms/Logo/index.';
import { useState } from 'react';

const RMenu = [
  // set Prices , Portfolio , Blog , About , 
  {
    name: 'Prices',
    subField: [
      {
        name: "Independent Designer",
        link: '/independent-designer/'
      },
      {
        name: "Independent Developer",
        link: '/independent-developer/'
      },
      {
        name: "Independent Photographer",
        link: '/independent-photographer/'
      }
    ]
  },
  {
    name: 'Portfolio',
    subField: [
      {
        name: "Visual Identity Design",
        link: "/projects/design/"
      },
      {
        name: "Web Development",
        link: "/projects/development/"
      },
      {
        name: "Photography",
        link: "/projects/photography/"
      }
    ]
  },
  {
    name: 'Blog',
    link: '/blog/'
  },
  {
    name: 'About',
    link: '/about'
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
      name: 'Projects',
      link: '/projects'
    }
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
    name: undefined,
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
    name: undefined,
    subField: [

      {
        name: "Instagram",
        link: "https://www.instagram.com/walt_dona/"
      },
      {
        name: "Github",
        link: "https://github.com/walt-dona"
      },
      {
        name: "Dribble",
        link: "URL_ADDRESSribbble.com/walt_dona/"
      },
      {
        name: "Behance",
        link: "https://www.behance.net/walt_dona"
      },
      {
        name: "LinkedIn",
        link: "https://www.linkedin.com/in/dona%C3%ABl-walter/"
      },

    ]
  }
]

interface MenuItem {
  name: string;
  link?: string;
  subField?: MenuItem[];
}

const MenuList = ({ list }: { list: MenuItem[] }) => {


  const SubList = ({ subList }: { subList: MenuItem[] }) => {
    return (
      <ul className={Style.do_submenu} role="menu">
       <MenuList list={subList} />
      </ul>
    );
  };

  return (
    <>{list.map((el, index) => (
      <li
        key={el.name + index}
      >

        {el.link ? (
          <a href={el.link} target={/** if external link set _tagert else _self*/ el.link.includes("https") ? "_blank" : "_self" } className='do-text-xs'>{el.name}</a>
        ) : (
          <span className='do-text-xs'
            role={el.subField ? 'menuitem' : undefined}
            aria-haspopup={el.subField ? 'true' : undefined}>
            {el.name}
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
          </span>
        )}
        {el.subField && <SubList subList={el.subField} />}
      </li>
    ))}</>
  );

}

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section className={`${Style.do_mobile_menu} ${isOpen && Style.do_mobile_menu_open}`}>
      {
        isOpen ? <div>
          <MenuList list={mobileMenu} />
        </div> : null
      }

      <button onClick={()=>{
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