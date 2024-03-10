import Product from "../../../../molecules/Product";
import Style from './prices.module.scss';

const Prices = (props: {products: any[]}) => {
    const {products} = props;
    console.log("This is products", products)
    return <section className={Style['root']}>
        <h2 className="do-text-xl">Simple prices for Tailored Services</h2>
        <ul className={Style['do_grid']}>
            {products.map(product => product && product?._type === 'product' && <Product type={product._type} prices={product.price} name={product.name} quantity={product.quantity} features={product.features}/>)}
        </ul>
    </section>
}

export default Prices;
