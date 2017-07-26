///s_role_menu表
module.exports = {
    tableName: 's_role_menu',
    attributes: {
        role_id: {
            model: 'SRole'
        },
        menu_id: {
            model: 'SMenu'
        }
    }
}