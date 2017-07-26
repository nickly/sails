///e_tempate邮件模板实体
module.exports = {
    tableName: 'e_tempate',
    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        categoryId: { //模板分类
            model: 'ETemplateCategory'
        },
        contentType: { //模板类型(0: Plain Text  1:HTMLl)默认值为0
            type: 'integer'
        },
        name: { //模板名称
            type: 'string',
            size: 100
        },
        subject: { //发送邮件标题
            type: 'string',
            size: 100
        },
        content: { //发送邮件内容
            type: 'longtext'
        },
        status: { //模板状态(0:不可用 1:可用) 默认为1
            type: 'integer'
        },
        createTime: { //创建时间
            type: 'datetime'
        }
    }
};