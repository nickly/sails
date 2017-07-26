///e_template_categorye邮件模板类别实体
module.exports = {
    tableName: 'e_template_category',
    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        categoryName: { //类别名称
            type: 'string',
            size: 150
        },
        description: { //描述
            type: 'string',
            size: 250
        },
        parentId: { //父级ID
            type: 'integer'
        },
        templates: {
            collection: 'ETemplate',
            via: 'categoryId'
        },
        outboxs: {
            collection: 'EOutbox',
            via: 'categoryId'
        }
    }
};