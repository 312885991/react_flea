export default {
    pagination(data, handleChange, handleSizeCahnge) {
        return {
            onChange: (current) => {
                handleChange(current)
            },
            onShowSizeChange: (current, pageSize) => {
                handleSizeCahnge(current, pageSize)
            },
            current: data.pagination.current,
            pageSize: data.pagination.pageSize,
            total: data.pagination.total,
            showTotal: () => {
                return `共 ${data.pagination.total} 条数据`
            },
            showSizeChanger: true,
            pageSizeOptions: ['3', '5', '10', '20', '30']
            // 是否有跳转指定页功能
            // showQuickJumper:true
        }
    },
}