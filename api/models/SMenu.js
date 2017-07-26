///s_menu系统菜单实体
module.exports = {
    tableName: 's_menu',
    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        name: {
            type: 'string',
            size: 100
        },
        code: {
            type: 'string',
            size: 100
        },
        leaf: {
            type: 'boolean'
        },
        url: {
            type: 'string',
            size: 250
        },
        sort: {
            type: 'integer'
        },
        owner:{
            model:'SRole'
        }
    }
};