import {useState } from 'react';
import Style from './style.module.scss'
const handleChange = (e: any | any, setValue: { (value: any): void; (value: any): void; (arg0: any): void; }) => {
    e.preventDefault();
    const { value } = e.target;
    setValue(value)
};

const Area = ({ name = '', label = '', placeholder = 'This is a textarea components', required = false }) => {
    const [value, setValue] = useState('');

    return (
        <fieldset className={Style.root + ' ' + (value.length > 2 && Style.not_empty)}>
            <label className="do-text-default" htmlFor={name}>{label}</label>
            <textarea className="do-text-default" name={name} data-value={value} required={required} onChange={(e) => {
                handleChange(e, setValue);
            }}
            onBlur={(e) => {
                handleChange(e, setValue);
            }} />
        </fieldset>
    )
}
const Text = ({ name = '', label = '', placeholder = 'this is a text components', required = false, type = "text" }) => {
    const [value, setValue] = useState('');
    return (
        <fieldset className={Style.root + ' ' + (value.length > 2 && Style.not_empty)}>
            <label className="do-text-default" htmlFor={name}>{label}</label>
            <input className="do-text-default" name={name} type={type} required={required} data-value={value} onChange={(e) => {
                handleChange(e, setValue);
            }}
            onBlur={(e) => {
                handleChange(e, setValue);
            }} />
        </fieldset>
    )
}

export default (props: { type: string; name: string; label: string; placeholder: string, required: boolean }) => {
    switch (props.type) {
        case 'text':
            return <Text name={props.name} label={props.label} placeholder={props.placeholder} required={props.required}/>
        case 'area':
            return <Area name={props.name} label={props.label} placeholder={props.placeholder} required={props.required}/>
        default:
            return <Text type={props.type} name={props.name} label={props.label} placeholder={props.placeholder} required={props.required}/>
    }
}