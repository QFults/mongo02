const prompt = require('inquirer').createPromptModule()
const { green } = require('chalk')
const db = require('mongojs')('tododb')

const buffer = () => {
  prompt({
    type: 'input',
    name: 'continue',
    message: 'Press ENTER to continue'
  })
    .then(() => mainMenu())
    .catch(err => console.error(err))
}

const viewList = () => {
  db.items.find((err, items) => {
    if (err) { console.error(err) }

    items.forEach(item => {
      console.log(`${item.isDone ? green(item.text) : item.text}`)
    })
    buffer()
  })
}

const addItem = () => {
  prompt({
    type: 'input',
    name: 'newItem',
    message: 'Type your new item here:'
  })
    .then(({ newItem }) => {
      db.items.insert({
        text: newItem,
        isDone: false
      }, err => {
        if (err) { console.error(err) }
        console.log(green('Item successfully added!'))
        buffer()
      })
    })
}

const changeItem = () => {
  db.items.find((err, items) => {
    if (err) { console.error(err) }

    prompt({
      type: 'list',
      name: 'updatedItem',
      message: 'Select the item you want to change:',
      choices: items.map(item => item.text)
    })
      .then(({ updatedItem }) => {
        console.log(updatedItem)
        db.items.update({ text: updatedItem }, { $set: { isDone: !items.filter(item => item.text === updatedItem)[0].isDone } }, err => {
          if (err) { console.error(err) }
          console.log('Item successfully changed!')
          buffer()
        })
      })
  })
}

const removeItem = () => {
  db.items.find((err, items) => {
    if (err) { console.error(err) }
    prompt({
      type: 'list',
      name: 'deletedItem',
      message: 'Select the item you want to remove:',
      choices: items.map(item => item.text)
    })
      .then(({ deletedItem }) => {
        db.items.remove({ text: deletedItem }, err => {
          if (err) { console.error(err) }
          console.log(green('Item successfully removed!')) 
          buffer()
        })
      })
  })
}

const mainMenu = () => {
  prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['View List', 'Add Item', 'Change Item', 'Remove Item', 'EXIT']
  })
    .then(({ action }) => {
      switch (action) {
        case 'View List':
          viewList()
          break
        case 'Add Item':
          addItem()
          break
        case 'Change Item':
          changeItem()
          break
        case 'Remove Item':
          removeItem()
          break
        case 'EXIT':
          process.exit()
          break
      }
    })
    .catch(err => console.error(err))
}

mainMenu()