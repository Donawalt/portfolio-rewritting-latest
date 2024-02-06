import ProjectItem from "../../../../molecules/ProjectItem";
import Style from './featured.module.scss';

const FeaturedProject = (props:{project_one, project_two}) => {
    const {project_one, project_two} = props;
    return (
        <section className={Style.root}>
            <h2 className='do-text-xl'>Featured <br/>Projects</h2>
            <div>
                <div><ProjectItem index={1} title={project_one.name + ' - ' + project_one.category} picture={project_one.cover} link={'/projects/'+ project_one.category + '/' + project_one.seoSlug.current}/></div>
                <div><ProjectItem index={2} title={project_two.name + ' - ' + project_two.category} picture={project_two.cover} link={'/projects/'+ project_two.category + '/' + project_two.seoSlug.current}/></div>
            </div>
        </section>
    )
}

export default FeaturedProject;