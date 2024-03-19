import { useEffect } from 'react';
import Style from './style.module.scss';
import gsap from 'gsap';
import eventBus from '@/assets/scripts/utils/eventBus';

const Heading = (props: { top?, children: any, subtitle? }) => {
    const { top, children, subtitle } = props;
    useEffect(()=>{
        gsap.fromTo(`.${Style.root} [data-astro-source-file], [data-hero-project-image], .do_landing_content, .do_project_content, .do_project_hero`, {opacity:0, translateY: '16px', delay: '400ms'}, {duration: 0.6, opacity:1, stagger: 0.1, translateY: 0, ease: "power3.out", onComplete: ()=>{
            eventBus.dispatch('scroll');
        }});
    }, [])
    return (<section className={Style.root}>
        {top}
        {
            children
        }
        {subtitle}
    </section>)
}

export default Heading;
