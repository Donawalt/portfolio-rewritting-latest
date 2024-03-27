import Button from '../../atoms/Button/index';
import Tag from '../../atoms/Tag/index.';
import Style from './product.module.scss';


const Custom = ({ tag, content }) => {
    return <div className={Style["root"] + ` ${Style['do_custom']}`}>
        <div className={Style["do_tag"]}><Tag type='nj'>2 {tag}</Tag></div>
        <h3>CUSTOM</h3>
        <p>{content}</p>
        <Button type="link" href="https://cal.com/donael-walter/15min" target="_blank">Book a call</Button>
    </div>
}

const Product = (props: { type: 'retainer' | 'physical' | 'digital' | 'offers' | string, name: string, prices?: any, features?: any[], cover?: any, quantity?: number, content?: string }) => {
    const { name, prices, features, cover, type, quantity, content } = props;

    const tagValue = () => {
        switch (type) {
            case ('retainer' || 'offers'):
                return quantity > 1 ? 'spots left' : 'spot left';
                break;
            case ('physical' || 'digital'):
                return quantity > 1 ? 'left' : 'left'
            default:
                return quantity > 1 ? 'left' : 'left'
                break;
        }
    }

    if (type === 'custom') {
        return <Custom tag={tagValue()} content={content}/>;
    }

    return (
        <div className={Style["root"]}>
            <div className={Style["do_tag"]}><Tag type='nj'>2 {tagValue()}</Tag></div>
            <h3 className='do-text-l'>{name}</h3>
            <div className={Style["do_prices"]}>
                <p>{prices.eur} €</p>
                <p>US$ {prices.usd} </p>
            </div>
            <Button type="link" href="https://cal.com/donael-walter/15min" target="_blank">Book a call</Button>
            <ul>
                {features.map(el => <li><svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_f_2034_238)">
                        <circle cx="13" cy="13" r="9" fill="#6AC224" />
                    </g>
                    <circle cx="13" cy="13" r="6" fill="#42FF00" />
                    <defs>
                        <filter id="filter0_f_2034_238" x="0" y="0" width="26" height="26" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_2034_238" />
                        </filter>
                    </defs>
                </svg>
                    {el}</li>)}
            </ul>
        </div>
    )
}

export default Product;