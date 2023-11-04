import Style from './citation.module.scss';

const Citation = (props: {author:string, content:string}) => {
    return (
        <section className={Style.root + ' do-center'}>
            <h3 className="do-text-s">{props.author}</h3>
            <p className='do-text-xl'>“{props.content}”</p>
        </section>
    )
}

export default Citation;