const sortFilterPagination = (page, limit, totalRecord, sortData = {}, sortParam = '', sortType = 'asc') => {
    let per_page = parseInt(limit, 10) || 10;
    let current_page = parseInt(page, 10) || 1;
    
    let total_pages = Math.ceil(totalRecord / per_page);
    if (total_pages === 0) total_pages = 1;
    
    if (current_page > total_pages) current_page = total_pages;
    
    let start_from = (current_page - 1) * per_page;
    if (start_from < 0) start_from = 0;
    
    let prev_enable = current_page > 1;
    let next_enable = current_page < total_pages;
    
    let sort = {};
    if (sortParam && sortData[sortParam]) {
        sort[sortData[sortParam]] = sortType === 'desc' ? -1 : 1;
    } else {
        sort = { _id: -1 };
    }
    
    return {
        per_page,
        page: current_page,
        total_pages,
        prev_enable,
        next_enable,
        start_from,
        sort
    };
};

module.exports = { sortFilterPagination };
