const menus = [
    {
        'id': "00",
        "icon": "QAQ",
        "name": "系统管理",
        "description": null,
        "type": "MENU",
        "alias": "HOME",
        "url": "/system",
        "checked": true,
        "children": [
            {
                'id': "0001",
                "icon": "AQA",
                "name": "人员管理",
                "description": null,
                "type": "MENU",
                "alias": "PERSON",
                "url": "/User",
                "checked": true,
                "children": [
                    {
                        "id": "000101",
                        "icon": "SAS",
                        "name": "页面查看",
                        "description": null,
                        "type": "PERMISSION",
                        "alias": "PERSON_CHECK",
                        "url": null,
                        "checked": true,
                        "children": [],
                        "parent": "0001"
                    },
                    {
                        'id': "000102",
                        "icon": null,
                        "name": "添加用户",
                        "description": null,
                        "type": "PERMISSION",
                        "alias": "PERSON_ADD",
                        "url": null,
                        "checked": true,
                        "children": [],
                        "parent": "0001"
                    },
                    {
                        'id': "000103",
                        "icon": null,
                        "name": "删除用户",
                        "description": null,
                        "type": "PERMISSION",
                        "alias": "PERSON_DELETE",
                        "url": null,
                        "checked": true,
                        "children": [],
                        "parent": "0001"
                    }
                ],
                "parent": "00"
            },
            {
                "id": "0002",
                "icon": "DQD",
                "name": "角色管理",
                "description": null,
                "type": "MENU",
                "alias": "ROLE",
                "url": "/Role",
                "checked": true,
                "children": [
                    {
                        "id": "000201",
                        "icon": null,
                        "name": "页面查看",
                        "description": null,
                        "type": "PERMISSION",
                        "alias": "ROLE_CHECK",
                        "url": null,
                        "checked": true,
                        "children": [],
                        "parent": "0002"
                    },
                    {
                        "id": "000202",
                        "icon": null,
                        "name": "添加角色",
                        "description": null,
                        "type": "PERMISSION",
                        "alias": "ROLE_ADD",
                        "url": null,
                        "checked": true,
                        "children": [],
                        "parent": "0002"
                    },
                    {
                        "id": "000203",
                        "icon": null,
                        "name": "删除角色",
                        "description": null,
                        "type": "PERMISSION",
                        "alias": "ROLE_DELETE",
                        "url": null,
                        "checked": true,
                        "children": [],
                        "parent": "0002"
                    }
                ],
                "parent": "00"
            }
        ],
        "parent": ""
    },
    {
        "id": "01",
        "icon": "sss",
        "name": "整体概览",
        "description": null,
        "type": "MENU",
        "alias": "INDEX",
        "url": "/Home",
        "checked": true,
        "children": [
            {
                "id": "0101",
                "icon": "sss2",
                "name": "整体概览",
                "description": null,
                "type": "MENU",
                "alias": "INDEX",
                "url": null,
                "checked": false,
                "children": [
                    {
                        "id": "010101",
                        "icon": "sss3",
                        "name": "页面查看",
                        "description": null,
                        "type": "PERMISSION",
                        "alias": "PERSON_CHECK",
                        "url": null,
                        "checked": true,
                        "children": [],
                        "parent": "0101"
                    }
                ],
                "parent": "01"
            }
        ],
        "parent": ""
    }
]

/**
 * 获取父节点
 * @param map
 * @param id
 * @returns {*[]}
 */
export function getParentNodes(map, id) {
    let t = []
    for (let i = 0; i < map.length; i++) {
        const e = map[i]
        if (e.id === id) {
            //若查询到对应的节点，则直接返回
            t.push(e.id)
            break
        } else if (e.children && e.children.length !== 0) {
            //判断是否还有子节点，若有对子节点进行循环调用
            let p = getParentNodes(e.children, id)
            //若p的长度不为0，则说明子节点在该节点的children内，记录此节点，并终止循环
            if (p.length !== 0) {
                p.unshift(e.id)
                t = p
                break
            }
        }
    }
    return t
}

console.log(getParentNodes(menus, '000103'))
