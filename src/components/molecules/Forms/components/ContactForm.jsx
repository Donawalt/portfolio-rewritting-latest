import Style from '../style.module.scss';
import Input from '../../../atoms/Input';
import Button from '../../../atoms/Button/index.';

const ContactForm = () => {
    return (
        <form className={Style.root}>
            <Input type='text' name='firstname' label='Firstname' />
            <Input type='text' name='lastname' label='Lastname' />
            <Input type='area' name='message' label='Message' />
            <Button type="submit">
                Get in touch
            </Button>
        </form>
    )
}

export default ContactForm;  