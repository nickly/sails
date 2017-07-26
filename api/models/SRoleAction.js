///s_role_action表
module.exports = {
    tableName: 's_role_action',
    attributes: {
        role_id: {
            model: 'SRole'
        },
        action_id: {
            model: 'SAction'
        }
    }
}