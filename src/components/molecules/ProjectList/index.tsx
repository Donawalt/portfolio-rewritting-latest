import Style from './style.module.scss';
import ProjectItem from '../ProjectItem';
import { useEffect } from 'react';
import gsap from 'gsap';

const ProjectList = (props: {projects: any[] }) => {
    const {projects = []} = props;

    useEffect(()=>{
        gsap.fromTo(`.${Style.root} li`, {opacity:0, translateX: "16px", translateY: "16px"}, {opacity:1, stagger: 0.05, translateX: 0, translateY: 0});
    }, [])
    return (<ul className={Style.root}>
                {
            projects && projects.map((el, index)=> {
                return <li key={el.name+index}><ProjectItem index={index} title={el.name + ' ✦ ' + el.category} picture={el.cover} link={'/projects/'+ el.category + '/' + el.seoSlug.current}/></li>
            })
        }
    </ul>)
}

export default ProjectList;