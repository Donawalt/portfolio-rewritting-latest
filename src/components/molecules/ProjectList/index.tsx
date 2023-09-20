import Style from './style.module.scss';
import ProjectItem from '../ProjectItem';
const ProjectList = (props: {projects: any[]}) => {
    const {projects} = props;
    return (<ul className={Style.root}>
        {
            [...new Array(200)].map((el, index)=> {
                return <li><ProjectItem index={index}/></li>
            })
        }
    </ul>)
}

export default ProjectList;