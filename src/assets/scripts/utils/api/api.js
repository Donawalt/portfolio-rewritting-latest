/* Blog And repeatable page */ 

// Get all Articles 
export const getAllArticles = (type, data) => {
    return `*[_type == "${type}" && !(_id in path('drafts.**'))] | order(date desc)`;
}

export const getDoc = (type) => {
    return `*[_type == "${type}" && _id == "${type}" && !(_id in path('drafts.**'))][0]`
}

export const getAllPagesMenu = () => {
    return "*[defined(title) && (_type match 'solutions-' || _type match 'services' || _type match 'technologies' || _type match 'ingenierie-' || _type match 'blog-page') && !(_id in path('drafts.**'))]{title, slug, _type, coverImage} | order(lower(title) asc)"
}

export const getAllServices = () =>{
    return "*[defined(title) && (_type match 'services') && !(_id in path('drafts.**'))]{title, slug, _type, coverImage}"
}

export const getAllEditablePages = () => {
    return "* [defined(title) && (_type match 'solutions' || _type match 'services' || _type match 'technologies' || _type match 'ingenierie') && !(_id in path('drafts.**'))]"
}


///////////////////////////