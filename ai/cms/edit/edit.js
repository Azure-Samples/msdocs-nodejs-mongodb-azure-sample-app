
export class CMSEditor {
  cms
  isEdit = false
  container
  editor
  constructor(cms) {
    this.cms = cms

    //make element with id = editToggle visible
    let editToggle = document.getElementById('editToggle')
    editToggle.style.display = 'block'
    //add event listener to the editToggle element
    editToggle.parentElement.addEventListener('click', (e) => {
      this.toggleEdit(e.target)
    })


    //add the modal to the page
    // let div = document.createElement('div')
    // div.innerHTML = html
    // document.body.appendChild(div)


    this.container = document.getElementById("jsoneditor")
    const options = {}
    this.editor = new JSONEditor(this.container, options)
  }

  toggleEdit() {
    this.isEdit = !this.isEdit
    let elements = this.cms.page.elements

    // add event listeners to all the elements with the cms class
    for (let i = 0; i < elements.length; i++) {
      if (this.isEdit) {
        elements[i].addEventListener('click', (e) => {
          this.click(e.target)
        })
      }
    }
    if (!this.isEdit) {
      let clickedObject = this.cms.page.componentObject[this.id]
      document.getElementById('jsoneditor').style.top = '-400px'
      let json = this.editor.get()

      if (clickedObject) {
        clickedObject.save(json)
      }
      else {
        if (typeof json.stringValue === 'string')
        this.cms.page.data[this.id] = json.stringValue
      else
        this.cms.page.data[this.id] = json

        this.cms.save()
      }
    }
  }

  click(element) {
    if (!this.isEdit) return
    this.id = element.id
    let clickedObject = this.cms.page.componentObject[this.id]
    let value = element.innerText
    document.getElementById('jsoneditor').style.top = '56px'

    //check if the string value is a valid JSON string
    if (clickedObject) this.editor.set(clickedObject.data)
    else if (value[0] === '{' && value[value.length - 1] === '}') {
      this.editor.set(JSON.parse(value))
    } else this.editor.set({ stringValue: value })
  }
}