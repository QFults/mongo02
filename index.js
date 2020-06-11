const prompt = require('inquirer').createPromptModule()
const db = require('mongojs')('tododb')
const { green } = require('chalk')

const buffer = () => {
  prompt({
    type: 'input',
    name: 'buffer',
    message: 'Press ENTER to continue'
  })
    .then(() => mainMenu())
    .catch(err => console.error(err))
}

const viewItems = () => {
  db.items.find((err, items) => {
    if (err) { console.error(err) }
    items.forEach(item => {
      console.log(item.isDone ? green(item.text) : item.text)
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
      name: 'selectedItem',
      message: 'Select the item you want to change:',
      choices: items.map(item => item.text)
    })
      .then(({ selectedItem }) => {
        const changedItem = items.filter(item => item.text === selectedItem)[0]
        db.items.update({ _id: changedItem._id }, { $set: { isDone: !changedItem.isDone } }, err => {
          if (err) { console.error(err) }
          console.log(green('Item successfully updated!'))
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
      name: 'selectedItem',
      message: 'Select the item you want to remove:',
      choices: items.map(item => item.text)
    })
      .then(({ selectedItem }) => {
        const removedItem = items.filter(item => item.text === selectedItem)[0]
        console.log(removedItem)
        db.items.remove({ _id: removedItem._id }, err => {
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
    choices: ['View items', 'Add an item', 'Change an item', 'Remove an item', 'EXIT']
  })
    .then(({ action }) => {
      switch (action) {
        case 'View items':
          viewItems()
          break
        case 'Add an item':
          addItem()
          break
        case 'Change an item':
          changeItem()
          break
        case 'Remove an item':
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
