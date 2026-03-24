import Style from './style.module.scss';
import ProjectItem from '../ProjectItem';
import { useEffect } from 'react';
import gsap from 'gsap';

interface ProjectListProps {
    projects: any[];
    variant?: 'default' | 'light';
}

const ProjectList = ({ projects = [], variant = 'default' }: ProjectListProps) => {
    const rootClass = variant === 'light' ? `${Style.root} ${Style.light}` : Style.root;

    useEffect(() => {
        gsap.fromTo(`.${rootClass} li`, {opacity:0, translateX: "16px", translateY: "16px"}, {opacity:1, stagger: 0.05, translateX: 0, translateY: 0});
    }, [rootClass]);

    return (
        <ul className={rootClass}>
            {
                projects && projects.map((el, index)=> {
                    return (
                        <li key={el.name+index}>
                            <ProjectItem 
                                index={index} 
                                title={el.name + ' ✦ ' + el.category} 
                                picture={el.cover} 
                                link={'/projects/'+ el.category + '/' + el.seoSlug.current}
                                variant={variant}
                            />
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default ProjectList;
