import Picture from '../../../../atoms/Picture';
import { useEffect } from 'react';

const Images = (props: {images, isFull:string, position:string}) => {
    const {images, isFull, position} = props;
    useEffect(()=>{
        console.log("Images from Images", images)
    }, [])
    return (<section data-full={isFull && isFull} data-postion={position && position}>
        {images.map((el, index) => <>image</>)}
    </section>)
}

export default Images;