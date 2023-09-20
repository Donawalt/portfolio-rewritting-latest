import Style from './style.module.scss';

const Heading = (props: { top?, children: any, subtitle? }) => {
    const { top, children, subtitle } = props;
    return (<section className={Style.root}>
        {top}
        {
            children
        }
        {subtitle}
    </section>)
}

export default Heading;
