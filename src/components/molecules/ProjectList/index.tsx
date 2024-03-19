import Style from './style.module.scss';
import ProjectItem from '../ProjectItem';
const ProjectList = (props: {projects: any[] }) => {
    const {projects = []} = props;
    return (<ul className={Style.root}>
                {
            projects && projects.map((el, index)=> {
                return <li><ProjectItem index={index} title={el.name + ' - ' + el.category} picture={el.cover} link={'/projects/'+ el.category + '/' + el.seoSlug.current}/></li>
            })
        }
    </ul>)
}

export default ProjectList;