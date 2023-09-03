import React from 'react';

import Button from '../../../../../atoms/Button/index.';
import WorkingStyle from './working.module.scss';
import ContactForm from '../../../../../molecules/Forms/components/ContactForm';

const WorkingTogether = (props) => {
    const {title} = props;
    return <section className={WorkingStyle.root}>
        <h2>{title && title} {!title && (<>Start working <br/> together</>)}</h2>
        <div>
            <div>
                <h3>Make a call</h3>
                <p>Let's discuss your project in 15 minutes</p>
                <Button type="link" href="https://cal.com/donael-walter/15min" target="_blank">Book a call</Button>
            </div>
            <ContactForm />
        </div>
    </section>
}


export default WorkingTogether;