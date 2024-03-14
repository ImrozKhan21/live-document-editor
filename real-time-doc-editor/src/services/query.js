const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0; // 0 means return all documents

function getPagination(query) {
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT ;
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const skip = (page - 1) * 50;

    return {limit, skip}
}

module.exports = {
    getPagination
}