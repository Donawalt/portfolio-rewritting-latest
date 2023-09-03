import { getDocument } from "./dom";
let scrollPosition = 0;

export default {
    enable(customFunc){
        const $body = typeof getDocument().querySelector('body') === 'object' ?  getDocument().querySelector('body') : false;
        if($body){
            scrollPosition = window && window.pageYOffset;
            $body.style.overflow = 'hidden';
            $body.style.position = 'fixed';
            $body.style.top = `-${scrollPosition}px`;
            $body.style.width = '100%';
        }
    },
    disable(customFunc){
        const $body = typeof getDocument().querySelector('body') === 'object' ?  getDocument().querySelector('body') : false;
        if($body){
            $body.style.overflow = 'hidden auto';
            $body.style.removeProperty('position');
            $body.style.removeProperty('top');
            $body.style.removeProperty('width');
            window && window.scrollTo(0, scrollPosition);
        }
    }
}