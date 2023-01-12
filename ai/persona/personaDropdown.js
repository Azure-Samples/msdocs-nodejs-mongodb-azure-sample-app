import { Collection } from '/ai/collection/collection.js'

export class PersonaDropdown {
    tag
    callback
    personasDropdown
    collection
    constructor(tag, callback) {
        this.tag = tag;
        this.callback = callback;
        this.personasDropdown = document.getElementById(this.tag)

        this.collection = new Collection('personas', (data) => {
            this.updatePersonas(data)
            this.callback(data[0])
        })

        this.personasDropdown.addEventListener('change', (event) => {
            this.callback(JSON.parse(event.target.value))
        })

    }
    updatePersonas(personas) {
        // personas is not an array return
        if (!Array.isArray(personas)) {
            return
        }
        this.personasDropdown.innerHTML = ''
        personas.forEach(persona => {
            let option = document.createElement('option')
            option.value = JSON.stringify(persona)
            option.innerHTML = persona.name
            this.personasDropdown.appendChild(option)
        })
    }

}
