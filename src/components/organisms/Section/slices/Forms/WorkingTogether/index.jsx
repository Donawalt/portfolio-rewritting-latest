import React from 'react';

import Button from '../../../../../atoms/Button/index';
import WorkingStyle from './working.module.scss';
import ContactForm from '../../../../../molecules/Forms/components/ContactForm';

const WorkingTogether = (props) => {
    const {title} = props;
    return <section className={WorkingStyle.root}>
        <h2>{title && title} {!title && (<>Start working <br/> together</>)}</h2>
        <div>
            <div>
                <h3>Send an email</h3>
                <p>Share your project idea and let's discuss it</p>
                <Button type="link" href="mailto:contact@donaelwalter.com">Get in Touch</Button>
            </div>
            <ContactForm />
        </div>
    </section>
}


export default WorkingTogether;