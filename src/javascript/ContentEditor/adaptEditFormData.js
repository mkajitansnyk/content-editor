import dayjs from '~/date.config';
import {getDynamicFieldSets, getFields} from '~/utils';
import {resolveSelectorType} from '~/SelectorTypes/resolveSelectorType';
import {adaptSystemNameField} from './adaptSystemNameField';
import {Constants} from '~/ContentEditor.constants';
import {adaptSections} from '~/ContentEditor/adaptSections';
import {getFieldValuesFromDefaultValues} from '~/ContentEditor/getFieldValuesFromDefaultValues';

// TODO https://jira.jahia.org/browse/TECH-300

const getInitialValues = (nodeData, sections) => {
    // Retrieve dynamic fieldSets
    const dynamicFieldSets = getDynamicFieldSets(sections);

    // Retrieve fields and the return object contains the field name as the key and the field value as the value
    const nodeValues = getFields(sections)
        .reduce((result, field) => ({...result, ...getFieldValues(field, nodeData)}), {});

    // Get default values for not enabled mixins
    const extendsMixinFieldsDefaultValues = getFields(sections, undefined, fieldset => fieldset.dynamic && !fieldset.activated)
        .reduce((result, field) => ({...result, ...getFieldValuesFromDefaultValues(field)}), {});

    const childrenOrderingFields = getChildrenOrderingFields(nodeData, dynamicFieldSets);

    // Work in progress
    const wipInfo = {[Constants.wip.fieldName]: {status: nodeData.wipInfo.status, languages: nodeData.wipInfo.languages}};

    // Return object contains fields and dynamic fieldSets
    return {...nodeValues, ...extendsMixinFieldsDefaultValues, ...dynamicFieldSets, ...childrenOrderingFields, ...wipInfo};
};

const getChildrenOrderingFields = (nodeData, dynamicFieldSets) => {
    const orderingInitialValues = {};

    if (nodeData.primaryNodeType.hasOrderableChildNodes) {
        if (nodeData.isPage) {
            orderingInitialValues['Children::Order'] = nodeData.children.nodes.filter(n => n.primaryNodeType.name === 'jnt:page' || n.primaryNodeType.name === 'jmix:navMenuItem');
        } else {
            orderingInitialValues['Children::Order'] = nodeData.children.nodes;
        }
    }

    // Using === false, because if it's undefined it's mean that the dynamic fieldset doest exist, so we do not need to init the values
    // But in case it's false, it's mean the dynamic fieldset exists but is not activated, so we need to init the values
    if (dynamicFieldSets[Constants.ordering.automaticOrdering.mixin] === false) {
        orderingInitialValues[Constants.ordering.automaticOrdering.mixin + '_firstDirection'] = 'desc';
        orderingInitialValues[Constants.ordering.automaticOrdering.mixin + '_firstField'] = 'jcr:lastModified';
        orderingInitialValues[Constants.ordering.automaticOrdering.mixin + '_secondDirection'] = undefined;
        orderingInitialValues[Constants.ordering.automaticOrdering.mixin + '_secondField'] = undefined;
        orderingInitialValues[Constants.ordering.automaticOrdering.mixin + '_thirdDirection'] = undefined;
        orderingInitialValues[Constants.ordering.automaticOrdering.mixin + '_thirdField'] = undefined;
    }

    return orderingInitialValues;
};

const getFieldValues = (field, nodeData) => {
    const property = nodeData.properties && nodeData.properties.find(prop => prop.name === field.propertyName && prop.definition.declaringNodeType.name === field.declaringNodeType);
    const selectorType = resolveSelectorType(field);
    const formFields = {};

    if (!property) {
        // Init value
        if (selectorType && selectorType.initValue) {
            formFields[field.name] = selectorType.initValue(field);
        }
    } else if (selectorType) {
        let adaptedPropertyValue;
        if (selectorType.adaptValue) {
            adaptedPropertyValue = selectorType.adaptValue(field, property);
        } else {
            adaptedPropertyValue = field.multiple ? property.values : property.value;
        }

        formFields[field.name] = adaptedPropertyValue;
    }

    return formFields;
};

const getDetailsValue = (sections = [], nodeData = {}, lang = 'en') => {
    // Retrieve only fields inside the metadata section
    const fields = getFields(sections, 'metadata');

    const fieldNamesToGet = ['j:lastPublished',
        'j:lastPublishedBy',
        'jcr:created',
        'jcr:createdBy',
        'jcr:lastModified',
        'jcr:lastModifiedBy'];

    if (!fields) {
        return [];
    }

    return fields
        .filter(field => fieldNamesToGet.indexOf(field.name) > -1)
        .map(field => {
            const jcrDefinition = nodeData.properties.find(
                prop => prop.name === field.name
            );

            if (field.selectorType.includes('Date')) {
                return {
                    label: field.displayName,
                    value: jcrDefinition &&
                        jcrDefinition.value &&
                        dayjs(jcrDefinition.value).locale(lang).format('L HH:mm')
                };
            }

            return {
                label: field.displayName,
                value: jcrDefinition && jcrDefinition.value
            };
        });
};

const getTechnicalInfo = (nodeData, t) => {
    return [
        {
            label: t('content-editor:label.contentEditor.edit.advancedOption.technicalInformation.contentType'),
            value: nodeData.primaryNodeType.displayName
        },
        {
            label: t('content-editor:label.contentEditor.edit.advancedOption.technicalInformation.mixinTypes'), value: [
                nodeData.primaryNodeType.name,
                ...nodeData.mixinTypes.map(m => m.name)
            ].filter(v => v).join('; ')
        },
        {
            label: t('content-editor:label.contentEditor.edit.advancedOption.technicalInformation.path'),
            value: nodeData.path
        },
        {
            label: t('content-editor:label.contentEditor.edit.advancedOption.technicalInformation.uuid'),
            value: nodeData.uuid
        }
    ];
};

const getUsagesInfo = nodeData => {
    return Object.values(nodeData.usages.nodes.reduce((acc, ref) => (
        {...acc, [ref.node.uuid]: {...ref.node, locales: acc[ref.node.uuid] ? [...acc[ref.node.uuid]?.locales, ref.language] : [ref.language]}}
    ), {}));
};

export const adaptEditFormData = (data, lang, t) => {
    const nodeData = data.jcr.result;
    const sections = adaptSections(data.forms.editForm.sections);

    const formData = {
        sections: sections,
        initialValues: getInitialValues(nodeData, sections),
        hasPreview: data.forms.editForm.hasPreview,
        nodeData,
        details: getDetailsValue(data.forms.editForm.sections, nodeData, lang),
        technicalInfo: getTechnicalInfo(nodeData, t),
        title: nodeData.displayName,
        nodeTypeDisplayName: nodeData.primaryNodeType.displayName,
        nodeTypeName: nodeData.primaryNodeType.name,
        usages: getUsagesInfo(nodeData)
    };

    adaptSystemNameField(data, formData, lang, t, nodeData.primaryNodeType, false, nodeData.moveSystemNameToTop, nodeData.isSystemNameReadOnlyMixin);

    return formData;
};
