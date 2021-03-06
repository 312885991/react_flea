const AdminMenu = [
    {
        "id": 1,
        "name": "首页",
        "path": "/admin/home",
        "icon": "home"
    },
    {
        "id": 2,
        "name": "轮播图管理",
        "path": "/admin/picture",
        "icon": "picture"
    },
    {
        "id": 3,
        "name": "公告管理",
        "path": "/admin/announce",
        "icon": "notification"
    },
    {
        "id": 4,
        "name": "商品管理",
        "path": "/admin/good",
        "icon": "gift"
    },
    {
        "id": 5,
        "name": "评论管理",
        "path": "/admin/discuss",
        "icon": "message"
    },
    {
        "id": 6,
        "name": "用户管理",
        "path": "/admin/user",
        "icon": "user"
    },
    {
        "id": 7,
        "name": "系统管理",
        "path": "/admin/manager",
        "icon": "setting",
        "children": [
            {
                "id": 8,
                "name": "小程序管理员",
                "path": "/admin/manager/information"
            },
            {
                "id": 9,
                "name": "账号管理",
                "path": "/admin/manager/account"
            }
        ]
    },
    {
        "id": 10,
        "name": "密码修改",
        "path": "/admin/modifyPassword",
        "icon": "lock"
    }
]

export default AdminMenu