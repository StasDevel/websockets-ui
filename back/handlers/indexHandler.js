import regHandler from './regHandler.js'

export default function indexHandler (type, data) {
    if(typeof type === 'string') {
        switch(type) {
            case('reg'): {
                console.log("reg")
            }
        }
    } else {
        throw new Error('Не подходящий тип')
    }
}