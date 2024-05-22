import { writable } from 'svelte/store'

export const metadata = writable({
    tags: [],
    forms: { default: {elements:[]}},
    rules: [],
    mappings: [],
    combo_values:{}
})