const treeData = [
    {
        id: '1',
        name: '父1',
        children: [
            {
                id: '11',
                name: '子1',
                children: [
                    {
                        id: '111',
                        name: '孙1'
                    },
                    {
                        id: '112',
                        name: '孙2'
                    },
                    {
                        id: '113',
                        name: '孙3'
                    },
                ]
            },
            {
                id: '12',
                name: '子2',
                children: [
                    {
                        id: '121',
                        name: '孙4'
                    },
                    {
                        id: '122',
                        name: '孙5'
                    }
                ]
            },
        ]
    },
    {
        id: '2',
        name: '父2',
        children: [
            {
                id: '21',
                name: '子3',
                children: [
                    {
                        id: '211',
                        name: '孙6'
                    },
                    {
                        id: '212',
                        name: '孙7'
                    },
                    {
                        id: '213',
                        name: '孙8'
                    },
                ]
            }
        ]
    }
]

// function getParentNodes (map, id)  {
//     let t =[]
//     for (let i = 0; i < map.length; i++) {
//         const e = map[i]
//         if (e.id === id) {
//             //若查询到对应的节点，则直接返回
//             t.push(e.id)
//             break
//         } else if (e.children && e.children.length !== 0) {
//             //判断是否还有子节点，若有对子节点进行循环调用
//             let p = getParentNodes(e.children, id)
//             //若p的长度不为0，则说明子节点在该节点的children内，记录此节点，并终止循环
//             if (p.length !== 0) {
//                 p.unshift(e.id)
//                 t = p
//                 break
//             }
//         }
//     }
//     return t
// }


//调用函数方式
console.log(getParentNodes(treeData, '113'))


let array = ['00', '01', '01', '02', '03', '04', '05'];

function uniqueArray(array) {
    return array.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
}


console.log(uniqueArray(array)); // Output: [1, 2, 3, 4, 5]
