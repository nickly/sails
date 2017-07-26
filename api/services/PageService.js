/**************************************
 * 分页服务
 */
module.exports = {
    PageData: function(pageIndex, totalCount, pageSize) {
        var totalPage = 0;
        if (totalCount / pageSize > parseInt(totalCount / pageSize)) {
            totalPage = parseInt(totalCount / pageSize) + 1;
        } else {
            totalPage = parseInt(totalCount / pageSize);
        }
        return { PageCount: totalPage, TotalCount: totalCount, PageSize: pageSize, PageIndex: pageIndex };
    }
};