///s_user_role表
module.exports = {
    tableName: 's_user_role',
    attributes: {
        user_id: {
            model: 'SUser',
            columnName: 'user_id'
        },
        role_id: {
            model: 'SRole',
            columnName: 'role_id'
        }
    }
}