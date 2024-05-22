import { mappingsHelper } from './mappingsHelper.js'


export class rulesExecution {
    constructor() {
        this.defaultFields=new mappingsHelper().getDefaultFields()

    }
    /**
     * @param {string} fieldName 
     * @param {array} fieldList 
     * @returns {object} the field object
     */
    getField(fieldName,fieldList) {
        if (!fieldList) return
        for(let i=0;i<fieldList.length;i++) {
            let field=fieldList[i]
            if (field.name===fieldName) return field
        }
        for(let i=0;i<this.defaultFields.length;i++) {
            let field=this.defaultFields[i]
            if (field.name===fieldName) return field
        }        
    }
    checkArray(fieldName) {
        return fieldName.includes("[]")
    }
    getArrayName(fieldName) {
        if (!this.checkArray(fieldName)) return
        return fieldName.split("[")[0]  // e.g. controlnet
    }    
    // type conversion based on field type
    convertValue(value,field) {
        if (!field) return ""
        if (field.type==="checkbox" || field.type==="boolean") {
            if (value==="true") return true
            if (value==="false") return false
        }
        if (field.type==="slider" || field.type==="number") {
            if (this.isFloat(field.step)) {
                return parseFloat(value)
            }
            return parseInt(value)

        }
        return value
    }
    /**
     * gets value from custim fields and default fields
     * @param {object} data the data object 
     * @param {string} fieldName the field name including array name
     * @param {array} fieldList all custom fields
     * @param {object} arrayIdx array index for each array (e.g. controlnet: 0)
     * @returns {*}  the value
     */
    getValue(data,fieldName,fieldList,arrayIdx) {
        let field=this.getField(fieldName,fieldList)
        if (!this.checkArray(fieldName)) {
            let value= data[fieldName]
            return this.convertValue(value,field)
        }
        let arrayName= fieldName.split("[")[0]  // e.g. controlnet
        let propertyName= fieldName.split(".")[1]  // e.g. image
        let i=arrayIdx[arrayName]
        if (!data[arrayName]) throw 'array_not_found ' + arrayName
        if (!data[arrayName][i]) throw 'index_in_array_not_found ' + arrayName + ' ' + i

        let value= data[arrayName][i][propertyName]
        return  this.convertValue(value,field)
    }

    setValue(data,value,fieldName,fieldList,arrayIdx) {
        let field=this.getField(fieldName,fieldList)
        if (!this.checkArray(fieldName)) {
            data[fieldName]= this.convertValue(value,field)
            return
        }       
        let arrayName= fieldName.split("[")[0]  // e.g. controlnet
        let propertyName= fieldName.split(".")[1]  // e.g. image
        let i=arrayIdx[arrayName]
        value=this.convertValue(value,field)
        data[arrayName][i][propertyName]=value

    }
    
    isFloat(value) {
        if (typeof value !== 'number' || isNaN(value)) {
          return false; // It's not a number or is NaN (Not a Number)
        }        
        return value % 1 !== 0; // If there's a decimal part, it's a float
      } 
    /**
     * execute rules on real data
     * @param {object} data the form data 
     * @param {array} fieldList the list of field definitions
     * @param {array} rules the rules list
     * @param {object} arrayIdx array index for each array (e.g. controlnet: 0)
     * @param {string} arrayName optional: limit rules execution to that array only
     * @returns {object} {data,hiddenFields}  data and list of hidden fields
     */
    execute(data,fieldList,rules,arrayIdx={},arrayName="") {
        if (!rules) rules = []
        if (!data) return { data, hiddenFields: {}, showFields: {} }
        let hiddenFields = []
        let showFields = []
        for (let i = 0; i < rules.length; i++) {
            // { fieldName, condition, actionType, rightValue, targetField, actionValue }
            let rule = rules[i]
            let field = this.getField(rule.fieldName, fieldList)

            if (arrayName === '__ignore_arrays' && this.checkArray(field.name)) continue
            let leftValue
            try {
                leftValue = this.getValue(data, rule.fieldName, fieldList, arrayIdx)
            } catch (e) {
                // value cannot read here because not available in data object
                continue
            }

            let rightValue = rule.rightValue
            if (!field) {
                console.error('rule execution field not found:', rule.fieldName)
                continue
            }
            if (arrayName && arrayName !== '__ignore_arrays' && !this.checkArray(field.name)) continue // array mode, but field is not an array
            if (arrayName && arrayName !== '__ignore_arrays' && this.getArrayName(field.name) !== arrayName) continue // other arrays ignore

            rightValue = this.convertValue(rightValue, field)
            leftValue = this.convertValue(leftValue, field)

            let res = false
            switch (
                rule.condition // ['==', '!=', '>', '<', '>=', '<=']
            ) {
                case '===':
                case '==':
                    if (leftValue === rightValue) res = true
                    break
                case '!=':
                case '!==':
                    if (leftValue !== rightValue) res = true
                    break
                case '>':
                    if (leftValue > rightValue) res = true
                    break
                case '<=':
                    if (leftValue <= rightValue) res = true
                    break
                case '>=':
                    if (leftValue >= rightValue) res = true
                    break
                case '<':
                    if (leftValue < rightValue) res = true
                    break
            }
            console.log('executed:', leftValue, rule.condition, rightValue, res)
            if (!res) continue // rule will be not executed because condition is false

            let targetFieldName
            let targetField
            if (rule.targetField) {
                targetFieldName = rule.targetField
                targetField = this.getField(targetFieldName, fieldList)
                if (!targetField) {
                    console.error('rule execution target field not found:', targetFieldName)
                    continue
                }
            }

            if (rule.actionType === 'setValue') {
                let value = rule.actionValue
                this.setValue(data, value, targetFieldName, fieldList, arrayIdx)
            }
            if (rule.actionType === 'hideField') {
                hiddenFields.push(rule.targetField)
                targetField.hideIt = true
                targetField.showIt = false
            }
            if (rule.actionType === 'showField') {
                showFields.push(rule.targetField)
                targetField.showIt = true
                targetField.hideIt = false
            }
            if (rule.actionType === 'copyValue') {
                let fromFieldName = rule.actionValue
                let fromField = this.getField(rule.actionValue, fieldList)
                if (!fromField) {
                    console.error('rule execution from field not found:', fromFieldName)
                    continue
                }
                let value = this.getValue(data, fromFieldName, fieldList, arrayIdx)
                this.setValue(data, value, targetFieldName, fieldList, arrayIdx)
            }
            if (rule.actionType === 'copyParameter') {
                let fromFieldName = rule.actionValue
                let fromField = this.getField(rule.actionValue, fieldList)
                if (!fromField) {
                    console.error('rule execution from field not found:', fromFieldName)
                    continue
                }
                let value = this.getValue(data, fromFieldName, fieldList, arrayIdx)
                let field = this.getField(targetFieldName, fieldList)
                field._force_render = true
                field[rule.targetParameter] = value
            }
        }        
        return { data, hiddenFields, showFields }
    }

}