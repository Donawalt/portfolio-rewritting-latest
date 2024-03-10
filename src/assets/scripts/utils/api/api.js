/* Blog And repeatable page */ 

export const getAllLandings = (type, data) => {
    return `*[_type == 'landing'  && !(_id in path('drafts.**'))]{
        ..., 
        content[] {
            ...,
            products[]->
        },
    }`;
}

export const getAllProjects = (type, data) => {
    return `*[_type == 'project'  && !(_id in path('drafts.**'))]`;
}

export const getAllProducts = (type, data) => {
    return `*[_type == 'products'  && !(_id in path('drafts.**'))]`;
}

export const getDocumentById = (id) => {
    return `*[_id == "${id}"][0]`
}
///////////////////////////