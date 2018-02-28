'use stric'

const OptionId = getAttributeSettings('optionId', 11)
const UserId = getAttributeSettings('userId', 9)
const TenantId = getAttributeSettings('tenantId', 11)

exports.AuthenticationResponseParser = class AuthenticationResponseParser {
    
    static getOptionId(data) {
        return getValue(OptionId.attribute, OptionId.length, data)
    }

    static getUserId(data) {
        return getValue(UserId.attribute, UserId.length, data)
    }

    static getTenantId(data) {
        return getValue(TenantId.attribute, TenantId.length, data)
    }
}

function getAttributeSettings (attribute, length) { 
    return { 'attribute' : attribute, 'length': length }
}

const getValue = (attribute, length, data) => {
    let choppedGetData = data.substring(data.search('\"' + attribute + '\":') + length);
    let commaLocation = choppedGetData.search(',');
    return choppedGetData.substring(0, commaLocation);
}