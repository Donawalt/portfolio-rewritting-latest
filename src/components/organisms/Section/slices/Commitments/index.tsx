
import Style from './commitments.module.scss';

const Commitments = (props: {title: string, description: string, deliverables: [string]}) => {
    const {title, description, deliverables} = props;


    return (<section className={Style["root"]}>
        <div>
            <h2 className="do-text-xl">{title}</h2>
            <p>{description}</p>
        </div>
        <ul>
            {deliverables.map(element => {
                return <li><svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_f_1776_1259)">
                <circle cx="13" cy="13.803" r="9" fill="#6AC224"/>
                </g>
                <circle cx="13" cy="13.803" r="6" fill="#42FF00"/>
                <defs>
                <filter id="filter0_f_1776_1259" x="0" y="0.802979" width="26" height="26" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_1776_1259"/>
                </filter>
                </defs>
                </svg>
                 {element}</li>
            })}
        </ul>
    </section>)
}

export default Commitments;