import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {Field} from './Field';
import {dsGenericTheme} from '@jahia/design-system-kit';
import Text from '~/SelectorTypes/Text/Text';
import {registry} from '@jahia/ui-extender';

jest.mock('~/EditPanel/WorkInProgress/WorkInProgress.utils', () => {
    return {
        showChipField: jest.fn()
    };
});

let mockEditorContext;
jest.mock('~/ContentEditor.context', () => {
    return {
        useContentEditorContext: () => (mockEditorContext)
    };
});

jest.mock('@apollo/react-hooks', () => {
    let responsemock;
    return {
        useApolloClient: () => responsemock,
        setResponseMock: m => {
            responsemock = m;
        }
    };
});

import {setResponseMock} from '@apollo/react-hooks';

describe('Field component', () => {
    let defaultProps;
    let result;

    beforeEach(() => {
        mockEditorContext = {
            registerRefreshField: () => {},
            lang: 'en',
            siteInfo: {
                languages: ['en']
            },
            nodeData: {
                uuid: '1234-1234-1234-1234',
                parent: {
                    path: '/parent-path'
                },
                primaryNodeType: {
                    name: 'thePrimaryNodeType'
                }
            }
        };
        defaultProps = {
            classes: {},
            field: {
                name: 'text',
                description: 'This is a description for this text field.',
                displayName: 'displayName',
                nodeType: {
                    properties: [
                        {
                            name: 'text',
                            displayName: 'Text'
                        }
                    ]
                },
                readOnly: false,
                selectorType: 'DatePicker',
                selectorOptions: []
            },
            fieldComponentKey: 'fieldComponentKeyForSelenium',
            labelHtmlFor: 'yoloHtmlFor',
            selectorType: {
                cmp: () => <div>test</div>,
                key: 'DatePicker'
            },
            formik: {
                error: {},
                touched: {},
                values: {}
            },
            t: i18nKey => i18nKey,
            actionContext: {},
            input: <></>,
            inputContext: {
                displayBadges: true,
                displayLabels: true,
                displayErrors: true
            },
            idInput: 'FieldID'
        };

        result = {data: {forms: {fieldConstraints: []}}};
        setResponseMock(result);
    });

    it('should call onChange from registry', () => {
        let result = false;
        const onChangePreviousValue = 'previousValue';
        const onChangeCurrentValue = 'currentValue';

        // Register onChange for DatePicker
        const datePickerOnChange = {
            targets: ['DatePicker'],
            onChange: (previousValue, currentValue, field, context) => {
                result = previousValue === onChangePreviousValue &&
                    currentValue === onChangeCurrentValue &&
                    field.name === defaultProps.field.name &&
                    context.lang === mockEditorContext.lang;
            }
        };
        registry.add('selectorType.onChange', 'callBacks', datePickerOnChange);

        // Build component
        defaultProps.input = props => <Text {...props}/>;
        defaultProps.field.multiple = false;
        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        // Call onChange from the field
        cmp.find('SingleField').props().onChange(onChangePreviousValue, onChangeCurrentValue);

        expect(result).toBe(true);
    });

    it('should render a "Shared in all languages" when field is not i18n and site have multiple languages', () => {
        let lang1 = {
            displayName: 'Deutsch',
            language: 'de',
            activeInEdit: true
        };
        let lang2 = {
            displayName: 'English',
            language: 'en',
            activeInEdit: true
        };

        const testI18nBadgeRender = (
            i18n,
            siteLanguages,
            expectedBadgeRendered
        ) => {
            defaultProps.field = {
                name: 'text',
                displayName: 'text',
                readOnly: false,
                selectorOptions: [],
                nodeType: {
                    properties: [
                        {
                            name: 'text',
                            displayName: 'Text'
                        }
                    ]
                },
                selectorType: 'Text',
                i18n: i18n
            };
            mockEditorContext.siteInfo = {
                languages: siteLanguages
            };

            const cmp = shallowWithTheme(
                <Field {...defaultProps}><div>test</div></Field>,
                {},
                dsGenericTheme
            )
                .dive();

            const badgeComponent = cmp.find({
                badgeContent:
                    'translated_content-editor:label.contentEditor.edit.sharedLanguages'
            });
            expect(badgeComponent.exists()).toBe(expectedBadgeRendered);
        };

        testI18nBadgeRender(false, [lang1, lang2], true);
        testI18nBadgeRender(true, [lang1, lang2], false);
        testI18nBadgeRender(false, [lang1], false);
        testI18nBadgeRender(true, [lang1], false);
    });

    it('should add htmlFor to the label', () => {
        defaultProps.input = props => <Text {...props}/>;
        defaultProps.field.multiple = false;
        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().debug()).toContain('htmlFor="FieldID"');
    });

    it('should display the description label when field has a description', () => {
        defaultProps.input = props => <Text {...props}/>;
        defaultProps.field.multiple = false;
        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().debug()).toContain('This is a description for this text field.');
    });

    it('should not display the description label when field has not a description', () => {
        defaultProps.input = props => <Text {...props}/>;
        defaultProps.field.multiple = false;

        defaultProps.field.description = '';
        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().debug()).not.toContain('This is a description for this text field.');
    });

    it('should not add htmlFor to the label when field is multiple', () => {
        defaultProps.input = props => <Text {...props}/>;
        defaultProps.field.multiple = true;
        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().debug()).not.toContain('htmlFor="FieldID"');
    });

    it('should display the contextualMenu when action exists', () => {
        defaultProps.actionContext.noAction = false;

        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().debug()).toContain('ContextualMenu');
    });

    it('should not display the contextualMenu when action does not exist', () => {
        defaultProps.actionContext.noAction = true;

        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().debug()).not.toContain('ContextualMenu');
    });

    it('should display an error message when field is in error', () => {
        defaultProps.formik.errors = {
            text: 'required'
        };

        defaultProps.formik.touched = {
            text: true
        };

        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().debug()).toContain('errors.required');
    });

    it('should not display an error message when field not touched', () => {
        defaultProps.formik.errors = {
            text: 'required'
        };

        defaultProps.formik.touched = {
            text: false
        };

        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().debug()).not.toContain('errors.required');
    });
});
