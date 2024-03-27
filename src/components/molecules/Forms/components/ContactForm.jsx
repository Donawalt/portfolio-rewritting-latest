import Style from '../style.module.scss';
import Input from '../../../atoms/Input';
import Button from '../../../atoms/Button/index';

import { useState, useRef } from 'react';

const Message = ({ type = "error", message = "The message cannot be sent, reach out to me through email contact@donaelwalter.com" }) => {
    return <div className={Style.message} data-type={type}>
        <p><b>{type === "error" ? "Error:" : "Success:"}</b> {message}</p>
    </div>
}
const ContactForm = () => {
    const [stateMachine, setStateMachine] = useState({
        current: "empty",
        steps: {
            "empty": {
                next: "sending",
                error: "empty"
            },
            "sending": {
                next: "success",
                error: "error"
            },
            "success": {
                next: "empty",
                error: "error",
                message: "I've received your message and will get back to you soon. "
            },
            "error": {
                next: "empty",
                error: "error",
                message: "The form didn't send your message "
            }
        }
    })

    const form = useRef();

    const nextStep = () => {
        setStateMachine(state => {
            return {
                ...state,
                current: state.steps[state.current].next
            }
        });
    }
    const errorStep = () => {
        setStateMachine(state => {
            return {
                ...state,
                current: state.steps[state.current].next
            }
        });
    }


    // Fake asynchronous function to simulate a delay
    const fakeAsyncFunction = async (e) => {
        // Simulate a delay of 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
    };

    const clearForm = () => {
        let inputs = form.current.querySelectorAll('input, textarea');
        inputs.forEach(element => {
            element.value = '';
        });
    }

    const sendContact = (e) => {
        e.preventDefault();
        console.log(e);

        const formData = new FormData(form.current);
        if (formData.get('firstname') && formData.get('lastname') && formData.get('message')) {
            nextStep();
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString(),
              })
                .then(() =>  {
                    nextStep();
                    setTimeout(() => {
                        clearForm();
                        nextStep();
                    }, 2000)
                })
                .catch((error) => errorStep());
        } else {
            errorStep();
        }
    };




    return (
        <form name="aboutContact" ref={form} className={Style.root} onSubmit={sendContact} disabled={stateMachine.current !== "empty"} data-netlify={true} netlify>
            <input type="hidden" name="form-name" value="aboutContact" />
            <Input type='text' name='firstname' label='Firstname' required={true} />
            <Input type='text' name='lastname' label='Lastname' required={true} />
            <Input type='email' name='email' label='Mail' required={true} />
            <Input type='area' name='message' label='Message' required={true} />
            {stateMachine.current === "empty" ? ' ' : stateMachine.current}
            {(stateMachine.current === 'success' || stateMachine.current === 'error') && <Message type={stateMachine.current} message={stateMachine.steps[stateMachine.current].message} />}
            <Button type="submit" disabled={stateMachine.current !== "empty"}>
                Get in touch
            </Button>
        </form>
    )
}

export default ContactForm;  