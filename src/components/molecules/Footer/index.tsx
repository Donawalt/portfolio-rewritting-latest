import React from 'react';
import Style from './style.module.scss';
import { SOCIALS, SITE } from '../../../config/site';
import Button from '@/components/atoms/Button';

const social = (name: string) => SOCIALS.find((s) => s.name === name)?.url ?? "#";

const Star = ({ dim = false }: { dim?: boolean }) => (
    <svg
        className={dim ? Style.star_dim : Style.star_accent}
        viewBox="0 0 57 57"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path d="M21.9293 12.8376C21.7878 24.8768 31.6913 34.676 44 34.536H43.4341C31.4084 34.676 21.7878 44.4753 21.9293 56.3744V56.2344C21.7878 44.3353 12.0257 34.816 0.141478 34.676H0C12.0257 34.536 21.9293 24.8768 21.9293 12.8376Z" fill="currentColor" />
        <path d="M43.9582 0C43.8746 7.11402 49.7267 12.9045 57 12.8218H56.6656C49.5595 12.9045 43.8746 18.695 43.9582 25.7263V25.6436C43.8746 18.6123 38.1061 12.9872 31.0836 12.9045H31C38.1061 12.8218 43.9582 7.11402 43.9582 0Z" fill="currentColor" />
    </svg>
);

const FooterCol = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <p className={Style.eyebrow}>{label}</p>
        {children}
    </div>
);

const Footer = () => {
    return (
        <footer className={Style.do_footer}>
            <div className={Style.hero}>
                <div className={Style.hero_l}>
                    <p className={Style.eyebrow}>Design engineer based in Lyon, France</p>
                    <p className={Style.display}>From brief<br />to production <Star /></p>
                </div>
                <div className={Style.hero_r}>
                    <p className={Style.muted}>Available for new projects — Q1 2027.<br />Remote-first, worldwide.</p>
                    <div className={Style.btn_accent}>
                        <Button  type="link" href={`mailto:${SITE.email}`}>
							Get in Touch
						</Button> 
                    </div>
                    
                </div>
            </div>

            <div className={Style.ruler}></div>

            <nav className={Style.cols} aria-label="Footer">
                <FooterCol label="Sitemap">
                    <a href="/">Home</a>
                    <a href="/projects">Projects</a>
                    <a href="/about">About</a>
                    <a href="/blog">Blog</a>
                    <a href="/overflow-design-build-partner">Prices</a>
                </FooterCol>
                <FooterCol label="Socials">
                    <a href={social("Instagram")} target="_blank" rel="noreferrer">Instagram</a>
                    <a href={social("GitHub")} target="_blank" rel="noreferrer">GitHub</a>
                    <a href={social("Dribbble")} target="_blank" rel="noreferrer">Dribbble</a>
                    <a href={social("LinkedIn")} target="_blank" rel="noreferrer">LinkedIn</a>
                    <a href={social("Sanity")} target="_blank" rel="noreferrer">Sanity Community</a>
                </FooterCol>
                <FooterCol label="Contact">
                    <p>Lyon, France — CET</p>
                    <a href={`mailto:${SITE.email}`}>Send a message</a>
                </FooterCol>
                <FooterCol label="Now">
                    <p>Booking Q1 2027</p>
                    <p>Open to senior IC roles</p>
                    <p>Freelance &amp; contract</p>
                </FooterCol>
            </nav>

            <div className={Style.bottom}>
                <p>© {new Date().getFullYear()} {SITE.name}</p>
                <p>Built with <a href='https://astro.build/' target='_blank'>Astro</a> + <a href="https://www.sanity.io/" target='blank'>Sanity</a></p>
                <a href="#top">Back to top ↑</a>
            </div>
        </footer>
    );
};

export default Footer;
