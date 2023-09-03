import { ChangeEvent, KeyboardEvent, SetStateAction, useState } from 'react';
import Style from './style.module.scss'
const handleChange = (e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>, setValue: { (value: SetStateAction<string>): void; (value: SetStateAction<string>): void; (arg0: any): void; }) => {
    e.preventDefault();
    const { value } = e.target;
    setValue(value)
};

const Area = ({ name = '', label = '', placeholder = 'This is a textarea components' }) => {
    const [value, setValue] = useState('');

    return (
        <fieldset className={Style.root + ' ' + (value.length > 2 && Style.not_empty)}>
            <label className="do-text-default" htmlFor={name}>{label}</label>
            <textarea className="do-text-default" name={name} data-value={value} onChange={(e) => {
                handleChange(e, setValue);
            }}
            onBlur={(e) => {
                handleChange(e, setValue);
            }} />
        </fieldset>
    )
}
const Text = ({ name = '', label = '', placeholder = 'this is a text components' }) => {
    const [value, setValue] = useState('');
    return (
        <fieldset className={Style.root + ' ' + (value.length > 2 && Style.not_empty)}>
            <label className="do-text-default" htmlFor={name}>{label}</label>
            <input className="do-text-default" name={name} type="text" data-value={value} onChange={(e) => {
                handleChange(e, setValue);
            }}
            onBlur={(e) => {
                handleChange(e, setValue);
            }} />
        </fieldset>
    )
}

export default (props: { type: string; name: string; label: string; placeholder: string }) => {
    switch (props.type) {
        case 'text':
            return <Text name={props.name} label={props.label} placeholder={props.placeholder} />
        case 'area':
            return <Area name={props.name} label={props.label} placeholder={props.placeholder} />
        default:
            return <Text name={props.name} label={props.label} placeholder={props.placeholder} />
    }
}